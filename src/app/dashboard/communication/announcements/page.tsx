'use client';

import * as React from 'react';
import { PlusCircle, Search, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { announcements as initialAnnouncements } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  content: z.string().min(20, 'Content must be at least 20 characters.'),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = React.useState(initialAnnouncements);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = React.useState<typeof initialAnnouncements[0] | null>(null);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: '', content: '' },
  });

  const onSubmit = (data: AnnouncementFormValues) => {
    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...a, ...data, date: new Date().toISOString().split('T')[0] } : a));
      toast({ title: 'Announcement Updated' });
    } else {
      const newAnnouncement = { id: `an${announcements.length + 1}`, ...data, author: 'Admin', date: new Date().toISOString().split('T')[0], read: false };
      setAnnouncements([newAnnouncement, ...announcements]);
      toast({ title: 'Announcement Posted' });
    }
    form.reset();
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
  };
  
  const handleEdit = (announcement: typeof initialAnnouncements[0]) => {
    setEditingAnnouncement(announcement);
    form.reset(announcement);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast({ title: 'Announcement Deleted', variant: 'destructive' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Broadcast important messages to all users.</CardDescription>
            </div>
            <Button onClick={() => { setEditingAnnouncement(null); form.reset(); setIsDialogOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Announcement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search announcements..." className="pl-8" />
          </div>
          <div className="space-y-4">
            {announcements.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>
                        By {item.author} on {new Date(item.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        {!item.read && <Badge>New</Badge>}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="content" render={({ field }) => ( <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem> )}/>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingAnnouncement ? 'Save Changes' : 'Post Announcement'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
