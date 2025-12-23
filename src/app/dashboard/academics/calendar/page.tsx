'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { calendarEvents as initialEvents } from '@/lib/placeholder-data';
import type { CalendarEvent } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const eventSchema = z.object({
  title: z.string().min(2, 'Title is required.'),
  date: z.date({ required_error: 'A date is required.' }),
  type: z.enum(['event', 'exam', 'holiday']),
  description: z.string().min(2, 'Description is required.'),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function AcademicCalendarPage() {
  const { toast } = useToast();
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: '', type: 'event', description: '' },
  });

  const onSubmit = (data: EventFormValues) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...data } : e));
      toast({ title: 'Event Updated', description: 'The event has been successfully updated.' });
    } else {
      const newEvent: CalendarEvent = { id: `e${events.length + 1}`, ...data };
      setEvents([newEvent, ...events]);
      toast({ title: 'Event Added', description: 'The new event has been added to the calendar.' });
    }
    form.reset();
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    form.reset(event);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    form.reset({ title: '', date: date || new Date(), type: 'event', description: '' });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({ title: 'Event Deleted', variant: 'destructive' });
  };

  const dayEvents = date ? events.filter(e => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) : [];

  const getBadgeVariant = (type: 'event' | 'exam' | 'holiday') => {
    switch (type) {
      case 'exam': return 'destructive';
      case 'holiday': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Academic Calendar</CardTitle>
                        <CardDescription>Schedule and manage school events, exams, and holidays.</CardDescription>
                    </div>
                    <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                components={{
                    Day: ({ date, ...props }) => {
                    const dayHasEvents = events.some(e => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
                    return (
                        <div className="relative">
                            <props.day date={date} {...props} />
                            {dayHasEvents && (
                            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-primary" />
                            )}
                        </div>
                    );
                    },
                }}
                />
            </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card>
            <CardHeader>
                <CardTitle>Events for {date ? format(date, 'MMMM d, yyyy') : 'Today'}</CardTitle>
            </CardHeader>
            <CardContent>
                {dayEvents.length > 0 ? (
                    <ul className="space-y-4">
                        {dayEvents.map(event => (
                            <li key={event.id} className="rounded-lg border p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">{event.description}</p>
                                    </div>
                                    <Badge variant={getBadgeVariant(event.type)} className="capitalize">{event.type}</Badge>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(event)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                        <CalendarIcon className="h-12 w-12 mb-4" />
                        <p>No events for this day.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Event Title</FormLabel><FormControl><Input placeholder="e.g., Science Fair" {...field} /></FormControl><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="date" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="rounded-md border"/></FormItem>)}/>
              <FormField control={form.control} name="type" render={({ field }) => ( <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="event">Event</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="holiday">Holiday</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Briefly describe the event" {...field} /></FormControl><FormMessage /></FormItem> )}/>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
