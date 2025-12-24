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

const classSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters.'),
  level: z.string().min(1, 'Level is required.'),
  status: z.enum(['Active', 'Inactive']),
});

type ClassFormValues = z.infer<typeof classSchema>;

export default function ClassesPage() {
  const { toast } = useToast();
  const [classes, setClasses] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<any | null>(null);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: { name: '', level: '', status: 'Active' },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/academics/classes');
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (error) {
      console.error("Failed to load classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: ClassFormValues) => {
    try {
      const method = editingClass ? 'PUT' : 'POST';
      const url = editingClass ? `/api/academics/classes/${editingClass.id}` : '/api/academics/classes';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast({ title: editingClass ? 'Class Updated' : 'Class Created' });
        fetchData();
        form.reset();
        setIsDialogOpen(false);
        setEditingClass(null);
      } else {
        toast({ title: 'Error', description: 'Failed to save class', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save class', variant: 'destructive' });
    }
  };

  const handleEdit = (cls: any) => {
    setEditingClass(cls);
    form.reset({
      ...cls,
      status: cls.status === 'Active' || cls.status === 'Inactive' ? cls.status : 'Active'
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingClass(null);
    form.reset({ name: '', level: '', status: 'Active' });
    setIsDialogOpen(true);
  }

  if (isLoading) return <div>Loading classes...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Classes / Grades</CardTitle>
            <CardDescription>Manage the different class levels in the school.</CardDescription>
          </div>
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add New Class</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length > 0 ? (
              classes.map(cls => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.level}</TableCell>
                  <TableCell>
                    <Badge variant={cls.status === 'Active' ? 'default' : 'secondary'}>{cls.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(cls)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="h-24 text-center">No classes found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit Class' : 'Create New Class'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Grade 10" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl><Input placeholder="e.g., High School" {...field} /></FormControl>
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
                <Button type="submit">{editingClass ? 'Save Changes' : 'Create Class'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
