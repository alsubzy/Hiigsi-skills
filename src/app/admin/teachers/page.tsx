'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, Search, EyeIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  lastLogin?: string | null;
  teacher: {
    employeeId: string;
    qualification: string | null;
    specialization: string | null;
  } | null;
  roles?: {
    role: {
      id: string;
      name: string;
    };
  }[];
  activityLogs?: any[];
};

export default function TeachersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    employeeId: '',
    qualification: '',
    specialization: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    fetchTeachers();
  }, [user, authLoading, filters]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
      });

      const response = await fetch(`/api/admin/teachers?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }

      const data = await response.json();
      setTeachers(data.data);
      setPagination({
        total: data.meta.total,
        totalPages: data.meta.totalPages,
      });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teachers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = () => {
    setEditingTeacher(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      employeeId: '',
      qualification: '',
      specialization: '',
      status: 'ACTIVE',
    });
    setShowTeacherForm(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone || '',
      password: '',
      employeeId: teacher.teacher?.employeeId || '',
      qualification: teacher.teacher?.qualification || '',
      specialization: teacher.teacher?.specialization || '',
      status: teacher.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    });
    setShowTeacherForm(true);
  };

  const handleViewProfile = async (teacher: Teacher) => {
    try {
      // Fetch full teacher details from teacher-specific endpoint
      const response = await fetch(`/api/admin/teachers/${teacher.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedTeacher(data.teacher);
        setShowProfileView(true);
      } else {
        // Fallback to user endpoint
        const userResponse = await fetch(`/api/admin/users/${teacher.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setSelectedTeacher(userData.user);
          setShowProfileView(true);
        } else {
          throw new Error('Failed to fetch teacher details');
        }
      }
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teacher profile',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (teacherId: string) => {
    setTeacherToDelete(teacherId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;

    try {
      const response = await fetch(`/api/admin/users/${teacherToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Teacher and associated user have been deleted.',
        });
        fetchTeachers();
        setDeleteConfirmOpen(false);
        setTeacherToDelete(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete teacher');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete teacher',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.firstName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'First name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.lastName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Last name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: 'Validation Error',
        description: 'Valid email is required',
        variant: 'destructive',
      });
      return;
    }

    if (!editingTeacher && (!formData.password || formData.password.length < 8)) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingTeacher 
        ? `/api/admin/users/${editingTeacher.id}` 
        : '/api/admin/teachers';
      const method = editingTeacher ? 'PUT' : 'POST';

      const payload: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || undefined,
        employeeId: formData.employeeId?.trim() || undefined,
        qualification: formData.qualification?.trim() || undefined,
        specialization: formData.specialization?.trim() || undefined,
        status: formData.status,
        userType: 'TEACHER', // Ensure userType is set for updates
      };

      if (!editingTeacher) {
        if (!formData.password) {
          throw new Error('Password is required for new teachers');
        }
        payload.password = formData.password;
      } else if (formData.password && formData.password.length >= 8) {
        payload.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
      }

      toast({
        title: 'Success',
        description: editingTeacher ? 'Teacher updated successfully' : 'Teacher created successfully',
      });

      setShowTeacherForm(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save teacher',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground">Manage teachers and their information</p>
        </div>
        <Button onClick={handleCreateTeacher}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or employee ID..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Status Filter</label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => setFilters({ ...filters, status: value || '', page: 1 })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Items per page</label>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) => setFilters({ ...filters, limit: parseInt(value), page: 1 })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>
                Showing {teachers.length} of {pagination.total} teachers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {loading ? 'Loading...' : 'No teachers found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.firstName} {teacher.lastName}
                      </TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>
                        {teacher.teacher?.employeeId || '-'}
                      </TableCell>
                      <TableCell>
                        {teacher.teacher?.qualification || '-'}
                      </TableCell>
                      <TableCell>
                        {teacher.teacher?.specialization || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={teacher.status === 'ACTIVE' ? 'default' : 'secondary'}
                          className={teacher.status === 'SUSPENDED' ? 'bg-yellow-500 text-white' : ''}
                        >
                          {teacher.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewProfile(teacher)}
                            title="View Profile"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span className="sr-only">View Profile</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTeacher(teacher)}
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(teacher.id)}
                            className="text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {filters.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTeacherForm} onOpenChange={setShowTeacherForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Create New Teacher'}</DialogTitle>
            <DialogDescription>
              {editingTeacher
                ? 'Update teacher information and details.'
                : 'Add a new teacher to the system. A user account will be created automatically.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editingTeacher}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {!editingTeacher && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
              </div>
            )}

            {editingTeacher && (
              <div className="space-y-2">
                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Leave blank to keep current password</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="Auto-generated if empty"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g., B.Ed, M.Ed"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowTeacherForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Full Profile View Dialog */}
      <Dialog open={showProfileView} onOpenChange={setShowProfileView}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Teacher Full Profile</DialogTitle>
            <DialogDescription>
              Complete information about the teacher
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeacher && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium">{selectedTeacher.firstName} {selectedTeacher.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedTeacher.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div>
                      <Badge
                        variant={selectedTeacher.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className={selectedTeacher.status === 'SUSPENDED' ? 'bg-yellow-500 text-white' : ''}
                      >
                        {selectedTeacher.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Information */}
              {selectedTeacher.teacher && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Teacher Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Employee ID</Label>
                      <p className="font-medium">{selectedTeacher.teacher.employeeId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Qualification</Label>
                      <p className="font-medium">{selectedTeacher.teacher.qualification || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Specialization</Label>
                      <p className="font-medium">{selectedTeacher.teacher.specialization || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">User ID</Label>
                    <p className="font-mono text-sm break-all">{selectedTeacher.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Account Created</Label>
                    <p className="font-medium">{new Date(selectedTeacher.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedTeacher.lastLogin && (
                    <div>
                      <Label className="text-muted-foreground">Last Login</Label>
                      <p className="font-medium">{new Date(selectedTeacher.lastLogin).toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Roles</Label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {selectedTeacher.roles?.map((userRole) => (
                        <Badge key={userRole.role.id} variant="outline">
                          {userRole.role.name}
                        </Badge>
                      )) || <Badge variant="outline">Teacher</Badge>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Logs */}
              {selectedTeacher.activityLogs && selectedTeacher.activityLogs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {selectedTeacher.activityLogs.slice(0, 5).map((log: any, index: number) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{log.event || 'Activity'}</p>
                            {log.description && (
                              <p className="text-xs text-muted-foreground mt-1">{log.description}</p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowProfileView(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowProfileView(false);
                  handleEditTeacher(selectedTeacher);
                }}>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Teacher
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this teacher? This will also delete the associated user account and all related records. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeleteConfirmOpen(false);
              setTeacherToDelete(null);
            }}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

