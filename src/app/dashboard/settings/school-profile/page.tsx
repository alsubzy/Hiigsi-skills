'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

const profileSchema = z.object({
  schoolName: z.string().min(3, 'School name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  mission: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SchoolProfilePage() {
    const { toast } = useToast();
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            schoolName: 'Hiigsi International School',
            email: 'contact@hiigsi.edu.so',
            phone: '+252 61 123 4567',
            address: 'KM4, Wadajir District',
            city: 'Mogadishu',
            state: 'Banaadir',
            zip: 'MG010',
            mission: 'To provide a world-class education that empowers students with knowledge, skills, and values to thrive in a global society.',
        }
    });

    function onSubmit(data: ProfileFormValues) {
        toast({ title: 'Profile Updated', description: 'School profile has been saved successfully.' });
        console.log(data);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>School Profile</CardTitle>
                <CardDescription>Manage your school's general information and branding.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="https://picsum.photos/seed/school-logo/200" alt="School Logo" />
                                <AvatarFallback>HIS</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">School Logo</h3>
                                <p className="text-sm text-muted-foreground">Upload your school's logo. Recommended size: 200x200px.</p>
                                <Button type="button" variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload Logo</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="schoolName" render={({ field }) => ( <FormItem><FormLabel>School Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                             <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                            <FormField control={form.control} name="state" render={({ field }) => ( <FormItem><FormLabel>State/Region</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                            <FormField control={form.control} name="zip" render={({ field }) => ( <FormItem><FormLabel>ZIP/Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        </div>
                        
                        <FormField control={form.control} name="mission" render={({ field }) => ( <FormItem><FormLabel>School Mission</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem> )}/>

                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">Save Changes</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

    