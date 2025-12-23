'use client';

import * as React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { syllabusData as initialSyllabusData, academicClasses, subjects as allSubjects } from '@/lib/placeholder-data';
import type { Syllabus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const syllabusSchema = z.object({
  title: z.string().min(2, 'Title is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  classId: z.string().min(1, 'Class is required.'),
  subjectId: z.string().min(1, 'Subject is required.'),
  term: z.string().min(1, 'Term is required.'),
  status: z.enum(['Not Started', 'In Progress', 'Completed']),
});

type SyllabusFormValues = z.infer<typeof syllabusSchema>;

export default function SyllabusManagementPage() {
  const { toast } = useToast();
  const [syllabus, setSyllabus] = React.useState<Syllabus[]>(initialSyllabusData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSyllabus, setEditingSyllabus] = React.useState<Syllabus | null>(null);

  const form = useForm<SyllabusFormValues>({
    resolver: zodResolver(syllabusSchema),
    defaultValues: { title: '', description: '', classId: '', subjectId: '', term: '', status: 'Not Started' },
  });

  const getClassName = (classId: string) => academicClasses.find(c => c.id === classId)?.name || 'N/A';
  const getSubjectName = (subjectId: string) => allSubjects.find(s => s.id === subjectId)?.name || 'N/A';

  const onSubmit = (data: SyllabusFormValues) => {
    if (editingSyllabus) {
      setSyllabus(syllabus.map(s => s.id === editingSyllabus.id ? { ...s, ...data } : s));
      toast({ title: 'Syllabus Updated' });
    } else {
      const newSyllabus: Syllabus = { id: `syl${syllabus.length + 1}`, ...data };
      setSyllabus([newSyllabus, ...syllabus]);
      toast({ title: 'Syllabus Entry Created' });
    }
    form.reset();
    setIsDialogOpen(false);
    setEditingSyllabus(null);
  };

  const handleEdit = (entry: Syllabus) => {
    setEditingSyllabus(entry);
    form.reset(entry);
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingSyllabus(null);
    form.reset({ title: '', description: '', classId: '', subjectId: '', term: '', status: 'Not Started' });
    setIsDialogOpen(true);
  }

  const getBadgeVariant = (status: 'Not Started' | 'In Progress' | 'Completed') => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Not Started': return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Syllabus Management</CardTitle>
            <CardDescription>Track and manage syllabus progress for each subject.</CardDescription>
          </div>
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add Syllabus Entry</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {syllabus.length > 0 ? (
              syllabus.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{getClassName(item.classId)}</TableCell>
                  <TableCell>{getSubjectName(item.subjectId)}</TableCell>
                  <TableCell>{item.term}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleEdit(item)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="h-24 text-center">No syllabus entries found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSyllabus ? 'Edit Syllabus Entry' : 'Create New Syllabus Entry'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="classId" render={({ field }) => ( <FormItem><FormLabel>Class</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger></FormControl><SelectContent>{academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="subjectId" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl><SelectContent>{allSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="term" render={({ field }) => ( <FormItem><FormLabel>Term</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Term" /></SelectTrigger></FormControl><SelectContent><SelectItem value="First Term">First Term</SelectItem><SelectItem value="Second Term">Second Term</SelectItem><SelectItem value="Third Term">Third Term</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Not Started">Not Started</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingSyllabus ? 'Save Changes' : 'Create Entry'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
