'use client';

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestFeesAction, type FormState } from './actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  location: z.string().min(2, 'Location is required.'),
  costOfServices: z.string().min(10, 'Cost of services description is required.'),
  economicIndexData: z.string().min(10, 'Economic index data is required.'),
  historicalFeeData: z.string().min(10, 'Historical fee data is required.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function FeeStructurePage() {
  const { toast } = useToast();
  const initialState: FormState = { message: '', result: null };
  const [state, formAction] = useFormState(suggestFeesAction, initialState);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: 'Mogadishu, Somalia',
      costOfServices: 'Moderate cost of living, with increasing prices for fuel and imported goods.',
      economicIndexData: 'Stable but slowly growing economy. Average family income is around $500/month.',
      historicalFeeData: 'Last year, fees for this grade were: Tuition $200/term, Transport $50/month.',
      gradeLevel: 'Grade 10',
    },
  });

  useEffect(() => {
    if (state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  const { isSubmitting } = form.formState;

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6" />
            AI-Assisted Fee Suggestion
          </CardTitle>
          <CardDescription>
            Provide details below and let our AI propose a new fee structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mogadishu, Somalia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                            Grade {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costOfServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost of Services in the Area</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe local costs for transport, food, utilities, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="economicIndexData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Economic Index Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the economic status of the target population, average income, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalFeeData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Fee Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details of previous fee structures for this grade."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Fees
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="lg:col-span-2">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>AI Proposal</CardTitle>
            <CardDescription>
              Suggestions from our AI will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Tuition Fee</CardDescription>
                            <CardTitle className="text-2xl">${state.result.tuitionFee}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Transport Fee</CardDescription>
                            <CardTitle className="text-2xl">${state.result.transportFee}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Meals Fee</CardDescription>
                            <CardTitle className="text-2xl">${state.result.mealsFee}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Accommodation</CardDescription>
                            <CardTitle className="text-2xl">${state.result.accommodationFee}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                <div>
                  <h3 className="font-semibold">Justification</h3>
                  <p className="text-sm text-muted-foreground">
                    {state.result.justification}
                  </p>
                </div>
              </div>
            ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
                    <Sparkles className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Waiting for input...</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
