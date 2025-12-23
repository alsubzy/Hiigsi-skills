'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, UserPlus, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { academicClasses, sections } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const admissionSchema = z.object({
  // Student Info
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dob: z.date({ required_error: 'Date of birth is required' }),
  gender: z.enum(['Male', 'Female', 'Other']),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  classId: z.string().min(1, 'Please select a class'),
  sectionId: z.string().min(1, 'Please select a section'),
  
  // Guardian Info
  guardians: z.array(z.object({
    relation: z.string().min(2, 'Relation is required'),
    name: z.string().min(2, 'Guardian name is required'),
    phone: z.string().min(10, 'Guardian phone is required'),
    email: z.string().email('Invalid email'),
  })),

  // Previous School
  previousSchool: z.string().optional(),
  previousClass: z.string().optional(),
});

type AdmissionFormValues = z.infer<typeof admissionSchema>;

export default function AdmissionsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [step, setStep] = React.useState(1);

    const form = useForm<AdmissionFormValues>({
        resolver: zodResolver(admissionSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            gender: 'Male',
            email: '',
            phone: '',
            address: '',
            classId: '',
            sectionId: '',
            guardians: [{ relation: 'Father', name: '', phone: '', email: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'guardians',
    });

    const onSubmit = (data: AdmissionFormValues) => {
        console.log(data);
        toast({
            title: 'Admission Successful',
            description: `${data.firstName} ${data.lastName} has been admitted.`,
        });
        router.push('/dashboard/students');
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Student Admission</CardTitle>
                <CardDescription>Fill out the form to admit a new student.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {step === 1 && (
                             <div className="space-y-4">
                                <h3 className="text-lg font-medium">Student Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                    <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="dob" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date > new Date() || date < new Date('1900-01-01')} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )}/>
                                    <FormField control={form.control} name="gender" render={({ field }) => ( <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
                                </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="classId" render={({ field }) => ( <FormItem><FormLabel>Class</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Assign class" /></SelectTrigger></FormControl><SelectContent>{academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
                                    <FormField control={form.control} name="sectionId" render={({ field }) => ( <FormItem><FormLabel>Section</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Assign section" /></SelectTrigger></FormControl><SelectContent>{sections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )}/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                    <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                </div>
                                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                             </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Guardian Information</h3>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                                        {index > 0 && <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>}
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={form.control} name={`guardians.${index}.relation`} render={({ field }) => ( <FormItem><FormLabel>Relation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                            <FormField control={form.control} name={`guardians.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                        </div>
                                         <div className="grid grid-cols-2 gap-4">
                                            <FormField control={form.control} name={`guardians.${index}.phone`} render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                            <FormField control={form.control} name={`guardians.${index}.email`} render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => append({ relation: '', name: '', phone: '', email: '' })}>
                                    <UserPlus className="mr-2 h-4 w-4" /> Add Another Guardian
                                </Button>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Previous School Details (Optional)</h3>
                                <FormField control={form.control} name="previousSchool" render={({ field }) => ( <FormItem><FormLabel>School Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="previousClass" render={({ field }) => ( <FormItem><FormLabel>Last Class Attended</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                            </div>
                        )}
                        <div className="flex justify-between">
                            {step > 1 && <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Previous</Button>}
                            <div />
                            {step < 3 && <Button type="button" onClick={nextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>}
                            {step === 3 && <Button type="submit">Complete Admission</Button>}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
