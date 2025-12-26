'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const userFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().optional(),
  userType: z.enum(['TEACHER', 'ADMIN', 'ACCOUNTANT', 'STAFF'], {
    required_error: 'Please select a user type.',
  }),
  roleId: z.string().optional(), // Keep for backward compatibility but prefer userType
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'], {
    required_error: 'Please select a status.',
  }),
  sendWelcomeEmail: z.boolean().optional(),
  temporaryPassword: z.string().optional(),
  // Teacher-specific fields
  employeeId: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

type Role = {
  id: string;
  name: string;
  description: string | null;
};

type UserFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user?: any;
  roles: Role[];
};

export function UserForm({ open, onOpenChange, onSuccess, user, roles }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatePassword, setGeneratePassword] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState('');

  // Determine userType from existing user's role
  const getUserTypeFromRole = (roles: any[]): 'TEACHER' | 'ADMIN' | 'ACCOUNTANT' | 'STAFF' | undefined => {
    if (!roles || roles.length === 0) return undefined;
    const roleName = roles[0]?.role?.name;
    const roleNameToUserType: Record<string, 'TEACHER' | 'ADMIN' | 'ACCOUNTANT' | 'STAFF'> = {
      'Teacher': 'TEACHER',
      'Admin': 'ADMIN',
      'Accountant': 'ACCOUNTANT',
      'Staff': 'STAFF',
    };
    return roleNameToUserType[roleName];
  };

  const defaultValues: Partial<UserFormValues> = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    userType: getUserTypeFromRole(user?.roles) || undefined,
    roleId: user?.roles?.[0]?.role?.id || '',
    status: user?.status || 'ACTIVE',
    sendWelcomeEmail: false,
    employeeId: user?.teacher?.employeeId || '',
    qualification: user?.teacher?.qualification || '',
    specialization: user?.teacher?.specialization || '',
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        userType: getUserTypeFromRole(user.roles),
        roleId: user.roles?.[0]?.role?.id || '',
        status: user.status || 'ACTIVE',
        sendWelcomeEmail: false,
        employeeId: user.teacher?.employeeId || '',
        qualification: user.teacher?.qualification || '',
        specialization: user.teacher?.specialization || '',
      });
    } else {
      form.reset(defaultValues);
    }
  }, [user, open]);

  const generateRandomPassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one of each character type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
    
    // Fill the rest of the password
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password to mix the required characters
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setTemporaryPassword(password);
    form.setValue('temporaryPassword', password);
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    
    try {
      const url = user ? `/api/admin/users/${user.id}` : '/api/admin/users';
      const method = user ? 'PUT' : 'POST';
      
      // Prepare payload - use temporaryPassword if generated, otherwise use password field
      const password = generatePassword ? temporaryPassword : (data.temporaryPassword || '');
      
      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        userType: data.userType,
        status: data.status,
        sendWelcomeEmail: data.sendWelcomeEmail || false,
      };

      // Only include password for new users or if password is being changed
      if (!user && password) {
        payload.password = password;
        payload.temporaryPassword = password;
      }

      // Include teacher-specific fields if userType is TEACHER
      if (data.userType === 'TEACHER') {
        if (data.employeeId) payload.employeeId = data.employeeId;
        if (data.qualification) payload.qualification = data.qualification;
        if (data.specialization) payload.specialization = data.specialization;
      }

      // For updates, include userType if it changed
      if (user && data.userType) {
        payload.userType = data.userType;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      const result = await response.json();
      
      toast({
        title: 'Success',
        description: user ? 'User updated successfully' : 'User created successfully',
      });
      
      onOpenChange(false);
      onSuccess();
      
      // If this is a new user and we generated a password, show it
      if (!user && generatePassword) {
        toast({
          title: 'Temporary Password',
          description: `Password for ${data.email}: ${temporaryPassword}`,
          variant: 'default',
          duration: 10000,
        });
      }
      
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create New User'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Update user details and permissions.'
              : 'Add a new user to the system. A welcome email will be sent if selected.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="john.doe@example.com" 
                        type="email" 
                        {...field} 
                        disabled={!!user}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {!user && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="generatePassword"
                    checked={generatePassword}
                    onChange={(e) => {
                      setGeneratePassword(e.target.checked);
                      if (e.target.checked) {
                        generateRandomPassword();
                      } else {
                        setTemporaryPassword('');
                        form.setValue('temporaryPassword', '');
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="generatePassword" className="text-sm font-medium">
                    Generate temporary password
                  </label>
                </div>
                
                {generatePassword && temporaryPassword && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">Temporary Password:</p>
                    <div className="flex items-center">
                      <code className="font-mono bg-white p-2 rounded border flex-1">
                        {temporaryPassword}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(temporaryPassword);
                          toast({
                            title: 'Copied!',
                            description: 'Password copied to clipboard',
                          });
                        }}
                        className="ml-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      This password will be shown only once. Make sure to copy it now.
                    </p>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendWelcomeEmail"
                    {...form.register('sendWelcomeEmail')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="sendWelcomeEmail" className="text-sm font-medium">
                    Send welcome email with account details
                  </label>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Role and permissions will be assigned automatically
                    </p>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Teacher-specific fields */}
            {form.watch('userType') === 'TEACHER' && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium">Teacher Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Auto-generated if empty" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., B.Ed, M.A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mathematics, Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {user ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
