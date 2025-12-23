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
import { academicClasses } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const examSchema = z.object({
  name: z.string().min(2, 'Exam name is required.'),
  classId: z.string().min(1, 'Class is required.'),
  startDate: z.date({ required_error: 'Start date is required.' }),
  endDate: z.date({ required_error: 'End date is required.' }),
  status: z.enum(['Upcoming', 'Ongoing', 'Completed']),
});

type ExamFormValues = z.infer<typeof examSchema>;

const initialExams = [
    { id: 'ex1', name: 'Mid-Term Examination', classId: 'c3', startDate: new Date(2024, 9, 15), endDate: new Date(2024, 9, 25), status: 'Upcoming' },
    { id: 'ex2', name: 'Final Examination', classId: 'c5', startDate: new Date(2024, 11, 10), endDate: new Date(2024, 11, 20), status: 'Upcoming' },
    { id: 'ex3', name: 'Unit Test 1', classId: 'c1', startDate: new Date(2024, 8, 5), endDate: new Date(2024, 8, 5), status: 'Completed' },
];

export default function ExamsPage() {
  const { toast } = useToast();
  const [exams, setExams] = React.useState(initialExams);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingExam, setEditingExam] = React.useState<typeof initialExams[0] | null>(null);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: { name: '', classId: '', status: 'Upcoming' },
  });

  const getClassName = (classId: string) => {
    return academicClasses.find(c => c.id === classId)?.name || 'N/A';
  }

  const onSubmit = (data: ExamFormValues) => {
    if (editingExam) {
      setExams(exams.map(s => s.id === editingExam.id ? { ...s, ...data } : s));
      toast({ title: 'Exam Updated', description: 'The exam has been updated.' });
    } else {
      const newExam = { id: `ex${exams.length + 1}`, ...data };
      setExams([newExam, ...exams]);
      toast({ title: 'Exam Created', description: 'A new exam has been added.' });
    }
    form.reset();
    setIsDialogOpen(false);
    setEditingExam(null);
  };

  const handleEdit = (exam: typeof initialExams[0]) => {
    setEditingExam(exam);
    form.reset(exam);
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingExam(null);
    form.reset({ name: '', classId: '', status: 'Upcoming' });
    setIsDialogOpen(true);
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'secondary';
      case 'Ongoing': return 'default';
      case 'Completed': return 'outline';
      default: return 'secondary';
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Exams</CardTitle>
            <CardDescription>Create and manage examinations for different classes.</CardDescription>
          </div>
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Create New Exam</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length > 0 ? (
              exams.map(exam => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>{getClassName(exam.classId)}</TableCell>
                  <TableCell>{format(exam.startDate, 'PPP')}</TableCell>
                  <TableCell>{format(exam.endDate, 'PPP')}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(exam.status)}>{exam.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(exam)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="h-24 text-center">No exams found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Exam Name</FormLabel><FormControl><Input placeholder="e.g., Mid-Term Exam" {...field} /></FormControl><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="classId" render={({ field }) => ( <FormItem><FormLabel>Class</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl><SelectContent>{academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
                <FormField control={form.control} name="endDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
              </div>
              <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Upcoming">Upcoming</SelectItem><SelectItem value="Ongoing">Ongoing</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingExam ? 'Save Changes' : 'Create Exam'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
