'use client';

import * as React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name is required.'),
  classId: z.string().min(1, 'Class is required.'),
  teacherId: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export default function SubjectsPage() {
  const { toast } = useToast();
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [classes, setClasses] = React.useState<any[]>([]);
  const [teachers, setTeachers] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<any | null>(null);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: '', classId: '', teacherId: '', status: 'Active' },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subRes, classRes, teacherRes] = await Promise.all([
        fetch('/api/academics/subjects'),
        fetch('/api/academics/classes'),
        fetch('/api/staff') // Fetch staff to get teachers
      ]);
      if (subRes.ok && classRes.ok && teacherRes.ok) {
        setSubjects(await subRes.json());
        setClasses(await classRes.json());
        setTeachers(await teacherRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'N/A';
  }

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Unassigned';
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned';
  }

  const onSubmit = async (data: SubjectFormValues) => {
    try {
      const method = editingSubject ? 'PUT' : 'POST';
      const url = editingSubject ? `/api/academics/subjects/${editingSubject.id}` : '/api/academics/subjects';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast({ title: editingSubject ? 'Subject Updated' : 'Subject Created' });
        fetchData();
        form.reset();
        setIsDialogOpen(false);
        setEditingSubject(null);
      } else {
        toast({ title: 'Error', description: 'Failed to save subject', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save subject', variant: 'destructive' });
    }
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    form.reset({
      ...subject,
      teacherId: subject.teacherId || '',
      status: subject.status === 'Active' || subject.status === 'Inactive' ? subject.status : 'Active'
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingSubject(null);
    form.reset({ name: '', classId: '', teacherId: '', status: 'Active' });
    setIsDialogOpen(true);
  }

  if (isLoading) return <div>Loading subjects...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subjects</CardTitle>
            <CardDescription>Manage and assign subjects to classes.</CardDescription>
          </div>
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add New Subject</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length > 0 ? (
              subjects.map(subject => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{getClassName(subject.classId)}</TableCell>
                  <TableCell>{getTeacherName(subject.teacherId)}</TableCell>
                  <TableCell>
                    <Badge variant={subject.status === 'Active' ? 'default' : 'secondary'}>{subject.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(subject)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">No subjects found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Create New Subject'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Physics" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class / Grade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Assign a teacher" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingSubject ? 'Save Changes' : 'Create Subject'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
