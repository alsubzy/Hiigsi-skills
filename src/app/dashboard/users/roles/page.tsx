'use client';

import * as React from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function RolesAndPermissionsPage() {
  const { toast } = useToast();
  const [roles, setRoles] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedRole, setSelectedRole] = React.useState<any | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/roles');
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
        if (data.length > 0) setSelectedRole(data[0]);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load roles', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Select a role to view its permissions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map(role => (
              <Button
                key={role.id}
                variant={selectedRole?.id === role.id ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => setSelectedRole(role)}
              >
                <Shield className="h-4 w-4" />
                {role.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Permissions for {selectedRole?.name}</CardTitle>
            <CardDescription>Current permissions assigned to this role in the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedRole?.permissions?.map((p: any) => (
                <div key={p.permissionId} className="flex items-center justify-between p-3 border rounded-lg bg-card shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{p.permission.subject}</span>
                    <span className="text-xs text-muted-foreground capitalize">{p.permission.action.toLowerCase()}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{p.permission.action}</Badge>
                </div>
              ))}
              {(!selectedRole?.permissions || selectedRole.permissions.length === 0) && (
                <p className="col-span-full text-center py-12 text-muted-foreground italic">No permissions assigned to this role.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
