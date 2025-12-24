'use client';

import * as React from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (values: SignInValues) => {
        if (!isLoaded) return;
        setIsLoading(true);

        try {
            const result = await signIn.create({
                identifier: values.email,
                password: values.password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });

                // Fetch user data to determine role-based redirection
                try {
                    const authMeRes = await fetch('/api/auth/me');
                    if (authMeRes.ok) {
                        const authData = await authMeRes.json();
                        const roles = authData.user?.roles || [];
                        if (roles.includes('Admin')) {
                            router.push('/admin/dashboard');
                        } else {
                            router.push('/dashboard');
                        }
                    } else {
                        // Fallback to regular dashboard if check fails
                        router.push('/dashboard');
                    }
                } catch (error) {
                    console.error('Failed to fetch user roles for redirection:', error);
                    router.push('/dashboard');
                }

                toast({ title: 'Success', description: 'Signed in successfully!' });
            } else {
                console.log(result);
                toast({ title: 'Error', description: 'Further action required. Check console.', variant: 'destructive' });
            }
        } catch (err: any) {
            toast({
                title: 'Sign In Failed',
                description: err.errors?.[0]?.message || 'Invalid email or password',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@example.com" {...field} />
                                        </FormControl>
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
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-muted-foreground italic">
                        Don't have an account?{' '}
                        <Link href="/sign-up" className="text-primary hover:underline font-medium non-italic">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
