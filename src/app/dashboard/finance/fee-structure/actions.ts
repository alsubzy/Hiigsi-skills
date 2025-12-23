'use server';

import { suggestFees, type SuggestFeesOutput } from '@/ai/flows/suggest-fees';
import { z } from 'zod';

export interface FormState {
  message: string;
  result: SuggestFeesOutput | null;
}

const formSchema = z.object({
  location: z.string(),
  costOfServices: z.string(),
  economicIndexData: z.string(),
  historicalFeeData: z.string(),
  gradeLevel: z.string(),
});

export async function suggestFeesAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    location: formData.get('location'),
    costOfServices: formData.get('costOfServices'),
    economicIndexData: formData.get('economicIndexData'),
    historicalFeeData: formData.get('historicalFeeData'),
    gradeLevel: formData.get('gradeLevel'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check your inputs.',
      result: null,
    };
  }

  try {
    const result = await suggestFees(validatedFields.data);
    return {
      message: '',
      result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while communicating with the AI. Please try again.',
      result: null,
    };
  }
}
