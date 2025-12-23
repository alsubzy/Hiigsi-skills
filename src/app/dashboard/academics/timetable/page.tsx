'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { timetableData as initialTimetableData, timeSlots, subjects as allSubjects, users as allUsers, academicClasses } from '@/lib/placeholder-data';
import type { TimetableEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const timetableSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  teacher: z.string().min(1, 'Teacher is required.'),
});

type TimetableFormValues = z.infer<typeof timetableSchema>;

export default function ClassTimetablePage() {
  const { toast } = useToast();
  const [timetableData, setTimetableData] = React.useState<TimetableEntry[]>(initialTimetableData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCell, setEditingCell] = React.useState<{ day: string; time: string } | null>(null);

  const form = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableSchema),
    defaultValues: { subject: '', teacher: '' },
  });
  
  const teachers = allUsers.filter(u => u.role === 'Teacher');

  const handleCellClick = (day: string, time: string) => {
    if (time === '12:00') return; // Lunch break
    setEditingCell({ day, time });
    const currentEntry = timetableData.find(d => d.day === day)?.[time];
    if (typeof currentEntry === 'object') {
        form.reset(currentEntry);
    } else {
        form.reset({ subject: '', teacher: '' });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: TimetableFormValues) => {
    if (editingCell) {
      const { day, time } = editingCell;
      const newTimetableData = timetableData.map(d => {
        if (d.day === day) {
          return { ...d, [time]: data };
        }
        return d;
      });
      setTimetableData(newTimetableData);
      toast({ title: 'Timetable Updated', description: `Slot for ${day} at ${time} has been updated.` });
    }
    setIsDialogOpen(false);
    setEditingCell(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Class Timetable</CardTitle>
                <CardDescription>Manage and view the weekly class schedule.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Select defaultValue="c3">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                        {academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button variant="outline">Print Timetable</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Day</TableHead>
                {timeSlots.map(time => (
                  <TableHead key={time} className="text-center">{time}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetableData.map(row => (
                <TableRow key={row.day}>
                  <TableCell className="font-semibold">{row.day}</TableCell>
                  {timeSlots.map(time => {
                    const entry = row[time];
                    const isLunch = time === '12:00';
                    return (
                      <TableCell 
                        key={time} 
                        className={`p-1 text-center h-24 border ${isLunch ? 'bg-muted/50' : 'cursor-pointer hover:bg-muted'}`}
                        onClick={() => handleCellClick(row.day, time)}
                      >
                        {typeof entry === 'object' ? (
                          <div className="flex flex-col items-center justify-center h-full text-xs">
                            <p className="font-bold text-sm">{entry.subject}</p>
                            <p className="text-muted-foreground">{entry.teacher}</p>
                          </div>
                        ) : isLunch ? (
                          <div className="flex items-center justify-center h-full font-semibold">LUNCH</div>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timetable Slot</DialogTitle>
            <DialogDescription>
              Update subject and teacher for {editingCell?.day} at {editingCell?.time}.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {allSubjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Assign a teacher" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {teachers.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
