'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (values: SignInValues) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            let data;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.indexOf('application/json') !== -1) {
                data = await response.json();
            } else {
                // Handle non-JSON response (likely a server crash or 500 page)
                const text = await response.text();
                console.error('Non-JSON response received:', text);
                throw new Error(response.status === 500 ? 'Server internal error' : 'Invalid server response');
            }

            if (response.ok) {
                console.log('Login successful, redirecting to:', data.redirectUrl);
                toast({ title: 'Success', description: 'Signed in successfully!' });

                // Use window.location for a hard refresh/navigation to ensure cookies are picked up
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                } else {
                    router.push('/dashboard');
                }
            } else {
                console.error('Login failed:', data);
                toast({
                    title: 'Sign In Failed',
                    description: data.error || 'Invalid email or password',
                    variant: 'destructive',
                });
            }
        } catch (err: any) {
            console.error('Login submission error:', err);
            toast({
                title: 'Sign In Failed',
                description: err.message || 'An unexpected connection error occurred',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Login Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Hiigsi</span>
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-500">Enter your email and password to access your account.</p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="sellostore@company.com"
                                                {...field}
                                                className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Sellostore."
                                                    {...field}
                                                    className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    />
                                    <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                                        Remember Me
                                    </label>
                                </div>
                                <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot Your Password?
                                </Link>
                            </div>

                            {/* Log In Button */}
                            <Button
                                type="submit"
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Log In
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or Login With</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 border-gray-300 hover:bg-gray-50"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 border-gray-300 hover:bg-gray-50"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    Apple
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600">
                        Don't Have An Account?{' '}
                        <Link href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register Now.
                        </Link>
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between text-xs text-gray-500 pt-8">
                        <span>Copyright © 2025 Hiigsi Enterprises LTD.</span>
                        <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Preview/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 items-center justify-center p-12">
                <div className="max-w-lg text-white space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold leading-tight">
                            Effortlessly manage your team and operations.
                        </h2>
                        <p className="text-indigo-100 text-lg">
                            Log in to access your CRM dashboard and manage your team.
                        </p>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                        <div className="space-y-4">
                            {/* Mini Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/20 rounded-lg p-4">
                                    <div className="text-2xl font-bold">$189,374</div>
                                    <div className="text-xs text-indigo-100">Total Revenue</div>
                                </div>
                                <div className="bg-white/20 rounded-lg p-4">
                                    <div className="text-2xl font-bold">00:01:30</div>
                                    <div className="text-xs text-indigo-100">Active Time</div>
                                </div>
                            </div>

                            {/* Mini Chart Visualization */}
                            <div className="bg-white/20 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span>Data Overview</span>
                                    <span>Weekly</span>
                                </div>
                                <div className="h-24 flex items-end justify-between gap-2">
                                    {[40, 70, 45, 90, 65, 50, 75].map((height, i) => (
                                        <div key={i} className="flex-1 bg-white/40 rounded-t" style={{ height: `${height}%` }} />
                                    ))}
                                </div>
                            </div>

                            {/* Mini Table */}
                            <div className="bg-white/20 rounded-lg p-4 space-y-2">
                                <div className="text-xs font-medium">Data Categories</div>
                                <div className="space-y-1">
                                    {['Present', 'Absent', 'Late'].map((item, i) => (
                                        <div key={i} className="flex justify-between text-xs">
                                            <span>{item}</span>
                                            <span className="font-medium">{[6248, 1752, 500][i]} Units</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
