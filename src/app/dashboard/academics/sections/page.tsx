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

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required.'),
  classId: z.string().min(1, 'Class/Grade is required.'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  status: z.enum(['Active', 'Inactive']),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export default function SectionsPage() {
  const { toast } = useToast();
  const [sections, setSections] = React.useState<any[]>([]);
  const [classes, setClasses] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<any | null>(null);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { name: '', classId: '', capacity: 30, status: 'Active' },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [secRes, classRes] = await Promise.all([
        fetch('/api/academics/sections'),
        fetch('/api/academics/classes')
      ]);
      if (secRes.ok && classRes.ok) {
        setSections(await secRes.json());
        setClasses(await classRes.json());
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

  const onSubmit = async (data: SectionFormValues) => {
    try {
      const method = editingSection ? 'PUT' : 'POST';
      const url = editingSection ? `/api/academics/sections/${editingSection.id}` : '/api/academics/sections';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast({ title: editingSection ? 'Section Updated' : 'Section Created' });
        fetchData();
        form.reset();
        setIsDialogOpen(false);
        setEditingSection(null);
      } else {
        toast({ title: 'Error', description: 'Failed to save section', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save section', variant: 'destructive' });
    }
  };

  const handleEdit = (section: any) => {
    setEditingSection(section);
    form.reset({
      ...section,
      status: section.status === 'Active' || section.status === 'Inactive' ? section.status : 'Active'
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingSection(null);
    form.reset({ name: '', classId: '', capacity: 30, status: 'Active' });
    setIsDialogOpen(true);
  }

  if (isLoading) return <div>Loading sections...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sections</CardTitle>
            <CardDescription>Organize classes into different sections.</CardDescription>
          </div>
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add New Section</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section Name</TableHead>
              <TableHead>Class / Grade</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.length > 0 ? (
              sections.map(section => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.name}</TableCell>
                  <TableCell>{getClassName(section.classId)}</TableCell>
                  <TableCell>{section.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={section.status === 'Active' ? 'default' : 'secondary'}>{section.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(section)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">No sections found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Edit Section' : 'Create New Section'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Section A" {...field} /></FormControl>
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
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
                <Button type="submit">{editingSection ? 'Save Changes' : 'Create Section'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
