'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [emailSent, setEmailSent] = React.useState(false);

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit = async (values: ForgotPasswordValues) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                setEmailSent(true);
                toast({
                    title: 'Email Sent',
                    description: data.message
                });
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Failed to send reset email',
                    variant: 'destructive',
                });
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <CardTitle>Check Your Email</CardTitle>
                        <CardDescription>
                            We've sent password reset instructions to your email address.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/sign-in">
                            <Button className="w-full" variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Forgot Password?</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you instructions to reset your password.
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
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="your.email@example.com"
                                                {...field}
                                                className="h-11"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Send Reset Link
                            </Button>

                            <Link href="/sign-in">
                                <Button variant="ghost" className="w-full" type="button">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Login
                                </Button>
                            </Link>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
