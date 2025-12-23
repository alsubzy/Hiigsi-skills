'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const profileSchema = z.object({
    name: z.string().min(2, 'Name is required.'),
    email: z.string().email(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(8, 'Current password is required.'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your new password.'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
});

export default function UserSettingsPage() {
    const { toast } = useToast();

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: 'Principal', email: 'admin@hiigsi.com' }
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
    });

    function onProfileSubmit(data: any) {
        toast({ title: 'Profile Updated', description: 'Your profile information has been updated.' });
    }
    
    function onPasswordSubmit(data: any) {
        toast({ title: 'Password Changed', description: 'Your password has been changed successfully.' });
        passwordForm.reset();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Settings</h1>
            <p className="text-muted-foreground mb-6">Manage your personal profile, password, and notification preferences.</p>
            <Tabs defaultValue="profile">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Update your personal information and avatar.</CardDescription>
                        </CardHeader>
                         <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                                <CardContent className="space-y-6">
                                     <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src="https://picsum.photos/seed/principal/100" />
                                            <AvatarFallback>PA</AvatarFallback>
                                        </Avatar>
                                        <Button type="button">Change Avatar</Button>
                                    </div>
                                    <FormField control={profileForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                    <FormField control={profileForm.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button type="submit">Save Changes</Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
                 <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>For security, choose a strong, unique password.</CardDescription>
                        </CardHeader>
                        <Form {...passwordForm}>
                             <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                                <CardContent className="space-y-4">
                                    <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => ( <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                    <FormField control={passwordForm.control} name="newPassword" render={({ field }) => ( <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                    <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button type="submit">Update Password</Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
                 <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Choose how you want to be notified.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <FormLabel>Email Notifications</FormLabel>
                                    <p className="text-sm text-muted-foreground">Receive important updates via email.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                             <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <FormLabel>Push Notifications</FormLabel>
                                    <p className="text-sm text-muted-foreground">Get real-time alerts on your devices.</p>
                                </div>
                                <Switch />
                            </div>
                             <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <FormLabel>Monthly Newsletter</FormLabel>
                                    <p className="text-sm text-muted-foreground">Subscribe to our monthly newsletter.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

    