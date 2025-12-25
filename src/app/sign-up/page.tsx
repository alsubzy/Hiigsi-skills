'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const signUpSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'Student'
        },
    });

    const onSubmit = async (values: SignUpValues) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: data.message || 'Account created successfully!'
                });
                setTimeout(() => {
                    router.push('/sign-in');
                }, 1500);
            } else {
                toast({
                    title: 'Registration Failed',
                    description: data.error || 'Failed to create account',
                    variant: 'destructive',
                });
            }
        } catch (err: any) {
            toast({
                title: 'Registration Failed',
                description: 'An unexpected error occurred',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Registration Form */}
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
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500">Enter your details to create your account.</p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John"
                                                    {...field}
                                                    className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Doe"
                                                    {...field}
                                                    className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="john.doe@example.com"
                                                {...field}
                                                className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Role Field */}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 border-gray-300">
                                                    <SelectValue placeholder="Select your role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Student">Student</SelectItem>
                                                <SelectItem value="Teacher">Teacher</SelectItem>
                                                <SelectItem value="Parent">Parent</SelectItem>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                    placeholder="Enter password"
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

                            {/* Confirm Password Field */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="Confirm password"
                                                    {...field}
                                                    className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Sign Up Button */}
                            <Button
                                type="submit"
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Create Account
                            </Button>
                        </form>
                    </Form>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-gray-600">
                        Already Have An Account?{' '}
                        <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign In
                        </Link>
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between text-xs text-gray-500 pt-8">
                        <span>Copyright © 2025 Hiigsi Enterprises LTD.</span>
                        <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 items-center justify-center p-12">
                <div className="max-w-lg text-white space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold leading-tight">
                            Join Hiigsi School Management System
                        </h2>
                        <p className="text-indigo-100 text-lg">
                            Create your account and start managing your educational journey today.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
