'use server';
/**
 * @fileOverview An AI agent for suggesting school fees based on various factors.
 *
 * - suggestFees - A function that handles the fee suggestion process.
 * - SuggestFeesInput - The input type for the suggestFees function.
 * - SuggestFeesOutput - The return type for the suggestFees function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFeesInputSchema = z.object({
  location: z.string().describe('The location of the school.'),
  costOfServices: z.string().describe('The cost of services in the area.'),
  economicIndexData: z.string().describe('Economic index data for the region.'),
  historicalFeeData: z.string().describe('Historical fee data for the school.'),
  gradeLevel: z.string().describe('The grade level for which fees are being suggested.'),
});
export type SuggestFeesInput = z.infer<typeof SuggestFeesInputSchema>;

const SuggestFeesOutputSchema = z.object({
  tuitionFee: z.number().describe('Suggested tuition fee.'),
  transportFee: z.number().describe('Suggested transport fee.'),
  mealsFee: z.number().describe('Suggested meals fee.'),
  accommodationFee: z.number().describe('Suggested accommodation fee, if applicable.'),
  justification: z.string().describe('The AI's justification for the suggested fees based on the input data.'),
});
export type SuggestFeesOutput = z.infer<typeof SuggestFeesOutputSchema>;

export async function suggestFees(input: SuggestFeesInput): Promise<SuggestFeesOutput> {
  return suggestFeesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFeesPrompt',
  input: {schema: SuggestFeesInputSchema},
  output: {schema: SuggestFeesOutputSchema},
  prompt: `You are an AI assistant helping a school administrator suggest school fees.

  Based on the following information, suggest reasonable fees for tuition, transport, meals, and accommodation (if applicable) for the specified grade level.

  Location: {{{location}}}
  Cost of Services: {{{costOfServices}}}
  Economic Index Data: {{{economicIndexData}}}
  Historical Fee Data: {{{historicalFeeData}}}
  Grade Level: {{{gradeLevel}}}

  Provide a justification for your suggestions.

  Format your output as a JSON object with the following keys:
  - tuitionFee (number): Suggested tuition fee.
  - transportFee (number): Suggested transport fee.
  - mealsFee (number): Suggested meals fee.
  - accommodationFee (number): Suggested accommodation fee, if applicable.
  - justification (string): The AI's justification for the suggested fees based on the input data.
`,
});

const suggestFeesFlow = ai.defineFlow(
  {
    name: 'suggestFeesFlow',
    inputSchema: SuggestFeesInputSchema,
    outputSchema: SuggestFeesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
