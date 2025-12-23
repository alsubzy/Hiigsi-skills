'use client';

import * as React from 'react';
import { PlusCircle, Shield, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialRoles = [
  { id: 'admin', name: 'Admin', isSystem: true, permissions: ['all'] },
  { id: 'teacher', name: 'Teacher', isSystem: false, permissions: ['read:students', 'write:grades'] },
  { id: 'parent', name: 'Parent', isSystem: false, permissions: ['read:own_child_grades'] },
  { id: 'accountant', name: 'Accountant', isSystem: false, permissions: ['read:finance', 'write:finance'] },
];

const allPermissions = [
    { id: 'user_management', label: 'User Management', sub: ['create:users', 'read:users', 'update:users', 'delete:users'] },
    { id: 'academics', label: 'Academics', sub: ['read:classes', 'write:classes', 'read:grades', 'write:grades'] },
    { id: 'finance', label: 'Finance', sub: ['read:finance', 'write:finance', 'manage:invoices'] },
    { id: 'reports', label: 'Reports', sub: ['generate:reports', 'view:analytics'] },
];

export default function RolesAndPermissionsPage() {
  const [roles, setRoles] = React.useState(initialRoles);
  const [selectedRole, setSelectedRole] = React.useState(initialRoles[0]);
  const [isEditingPermissions, setIsEditingPermissions] = React.useState(false);
  const [pendingPermissions, setPendingPermissions] = React.useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [roleToDelete, setRoleToDelete] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPendingPermissions(selectedRole.permissions);
  }, [selectedRole]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPendingPermissions(prev => {
      const isAll = permission === 'all';
      const isSub = permission.includes(':');
      const module = isSub ? permission.split(':')[1].split('_')[0] : '';
      
      let newPermissions = [...prev];

      if (isAll) {
          return checked ? ['all'] : [];
      }
      
      if (checked) {
          newPermissions.push(permission);
          // if all sub permissions of a module are checked, check the module
          const modulePermissions = allPermissions.find(p => p.id.startsWith(module))?.sub || [];
          const allModulePermsChecked = modulePermissions.every(p => newPermissions.includes(p));
          if(allModulePermsChecked && modulePermissions.length > 0) {
              const mainPerm = allPermissions.find(p => p.id.startsWith(module))?.id;
              if(mainPerm) newPermissions.push(mainPerm);
          }

      } else {
          newPermissions = newPermissions.filter(p => p !== permission);
          // if a module is unchecked, uncheck all its sub permissions
          if (!isSub) {
              const modulePermissions = allPermissions.find(p => p.id === permission)?.sub || [];
              newPermissions = newPermissions.filter(p => !modulePermissions.includes(p));
          }
           // if any sub permission is unchecked, uncheck the main module permission
          const mainPerm = allPermissions.find(p => p.id.startsWith(module))?.id;
          if(mainPerm) {
             newPermissions = newPermissions.filter(p => p !== mainPerm);
          }
          // if unchecking a permission that was part of 'all', remove 'all'
          if(newPermissions.includes('all')) {
            newPermissions = newPermissions.filter(p => p !== 'all');
          }
      }

      return newPermissions;
    });
  };

  const savePermissions = () => {
    setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, permissions: pendingPermissions } : r));
    setIsEditingPermissions(false);
  };

  const cancelEdit = () => {
    setPendingPermissions(selectedRole.permissions);
    setIsEditingPermissions(false);
  };
  
  const attemptDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if(role && !role.isSystem) {
        setRoleToDelete(roleId);
        setIsDeleteDialogOpen(true);
    }
  }

  const confirmDeleteRole = () => {
    if(roleToDelete) {
        setRoles(roles.filter(r => r.id !== roleToDelete));
        if(selectedRole.id === roleToDelete) {
            setSelectedRole(roles[0]);
        }
        setRoleToDelete(null);
        setIsDeleteDialogOpen(false);
    }
  }

  const isPermissionChecked = (perm: string) => {
    if(pendingPermissions.includes('all')) return true;
    if(!perm.includes(':')) { // main module permission
        const modulePerms = allPermissions.find(p => p.id === perm)?.sub || [];
        if(modulePerms.length === 0) return pendingPermissions.includes(perm);
        return modulePerms.every(p => pendingPermissions.includes(p));
    }
    return pendingPermissions.includes(perm);
  }


  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Select a role to view and edit its permissions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map(role => (
              <div key={role.id} className="flex items-center">
                 <Button
                    variant={selectedRole.id === role.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => { setSelectedRole(role); setIsEditingPermissions(false); }}
                >
                    {role.name} {role.isSystem && <Shield className="h-4 w-4 ml-auto text-muted-foreground" />}
                </Button>
                {!role.isSystem && (
                     <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={() => attemptDeleteRole(role.id)}>
                        <Trash className="h-4 w-4" />
                     </Button>
                )}
              </div>
            ))}
             <div className="pt-4">
                <Input placeholder="Add new role..." onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                        const newRole = { id: e.currentTarget.value.toLowerCase().replace(' ', '-'), name: e.currentTarget.value, isSystem: false, permissions: [] };
                        setRoles([...roles, newRole]);
                        e.currentTarget.value = '';
                    }
                }}/>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Permissions for {selectedRole.name}</CardTitle>
                    <CardDescription>
                        {selectedRole.isSystem ? "System role permissions cannot be modified." : "Toggle permissions for this role."}
                    </CardDescription>
                </div>
                {!selectedRole.isSystem && (
                    !isEditingPermissions ? (
                        <Button onClick={() => setIsEditingPermissions(true)}>Edit Permissions</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
                            <Button onClick={savePermissions}>Save Changes</Button>
                        </div>
                    )
                )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all"
                      checked={pendingPermissions.includes('all')}
                      onCheckedChange={(checked) => handlePermissionChange('all', !!checked)}
                      disabled={!isEditingPermissions}
                    />
                    <Label htmlFor="all" className="font-semibold text-lg">Full Access</Label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">Grants access to all current and future permissions.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPermissions.map(module => (
                <div key={module.id} className="space-y-3">
                  <div className="flex items-center space-x-2">
                     <Checkbox
                        id={module.id}
                        checked={isPermissionChecked(module.id)}
                        onCheckedChange={(checked) => handlePermissionChange(module.id, !!checked)}
                        disabled={!isEditingPermissions}
                     />
                    <Label htmlFor={module.id} className="font-semibold">{module.label}</Label>
                  </div>
                  <div className="pl-6 space-y-2">
                    {module.sub.map(perm => (
                      <div key={perm} className="flex items-center space-x-2">
                        <Checkbox
                          id={perm}
                          checked={isPermissionChecked(perm)}
                          onCheckedChange={(checked) => handlePermissionChange(perm, !!checked)}
                          disabled={!isEditingPermissions}
                        />
                        <Label htmlFor={perm} className="text-muted-foreground font-normal capitalize">{perm.split(':')[0].replace('_', ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the role. Users assigned to this role will lose their permissions.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteRole}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
