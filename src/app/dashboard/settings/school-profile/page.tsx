'use client';

import * as React from 'react';
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
import { Upload, Loader2 } from 'lucide-react';

const profileSchema = z.object({
    schoolName: z.string().min(3, 'School name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number is required'),
    address: z.string().min(5, 'Address is required'),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    principalName: z.string().min(3, 'Principal name is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SchoolProfilePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            schoolName: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            principalName: '',
        }
    });

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/settings/school-profile');
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    form.reset({
                        schoolName: data.schoolName || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        address: data.address || '',
                        website: data.website || '',
                        principalName: data.principalName || '',
                    });
                }
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, [form]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    async function onSubmit(data: ProfileFormValues) {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings/school-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast({ title: 'Profile Updated', description: 'School profile has been saved successfully.' });
            } else {
                toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;

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
                            <FormField control={form.control} name="schoolName" render={({ field }) => (<FormItem><FormLabel>School Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="principalName" render={({ field }) => (<FormItem><FormLabel>Principal Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Full Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}