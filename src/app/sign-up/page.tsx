'use client';

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';

const signUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    role: z.enum(['Admin', 'Teacher', 'Clerk', 'Accountant']),
    code: z.string().optional(), // For verification code
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [verifying, setVerifying] = React.useState(false);

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { email: '', password: '', firstName: '', lastName: '', role: 'Teacher', code: '' },
    });

    const onSubmit = async (values: SignUpValues) => {
        if (!isLoaded) return;
        setIsLoading(true);

        try {
            // 1. Create Clerk user with unsafeMetadata for the role
            await signUp.create({
                emailAddress: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                unsafeMetadata: {
                    role: values.role
                }
            });

            // 2. Prepare email verification
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            setVerifying(true);
            toast({ title: 'Verification Required', description: 'A code has been sent to your email.' });
        } catch (err: any) {
            toast({
                title: 'Sign Up Failed',
                description: err.errors?.[0]?.message || 'Could not create account',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onVerify = async (values: SignUpValues) => {
        if (!isLoaded) return;
        setIsLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: values.code || '',
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.push('/dashboard');
                toast({ title: 'Success', description: 'Account created and verified!' });
            }
        } catch (err: any) {
            toast({
                title: 'Verification Failed',
                description: err.errors?.[0]?.message || 'Invalid code',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                        {verifying ? 'Enter the verification code sent to your email' : 'Join our School Management System'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!verifying ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl><Input placeholder="John" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Your Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                                    <SelectItem value="Clerk">Clerk</SelectItem>
                                                    <SelectItem value="Accountant">Accountant</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Your role will determine your access permissions.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Next
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onVerify)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verification Code</FormLabel>
                                            <FormControl><Input placeholder="123456" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Verify & Complete
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={() => setVerifying(false)}>Back to Sign Up</Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    {!verifying && (
                        <div className="text-sm text-center text-muted-foreground italic">
                            Already have an account?{' '}
                            <Link href="/sign-in" className="text-primary hover:underline font-medium non-italic">
                                Sign in
                            </Link>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
