
'use server';

/**
 * @fileOverview A flow to generate a homepage subheadline using AI.
 *
 * - generateSubheadline - A function that generates a subheadline based on the main headline.
 * - GenerateSubheadlineInput - The input type for the generateSubheadline function.
 * - GenerateSubheadlineOutput - The return type for the generateSubheadline function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSubheadlineInputSchema = z.object({
  headline: z.string().describe('The main headline of the homepage.'),
});

export type GenerateSubheadlineInput = z.infer<
  typeof GenerateSubheadlineInputSchema
>;

const GenerateSubheadlineOutputSchema = z.object({
  subheadline: z.string().describe('The generated subheadline.'),
});

export type GenerateSubheadlineOutput = z.infer<
  typeof GenerateSubheadlineOutputSchema
>;

export async function generateSubheadline(
  input: GenerateSubheadlineInput
): Promise<GenerateSubheadlineOutput> {
  return generateSubheadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubheadlinePrompt',
  input: { schema: GenerateSubheadlineInputSchema },
  output: { schema: GenerateSubheadlineOutputSchema },
  prompt: `You are an expert copywriter for a women's ethnic wear brand called "Naari".

Your task is to write a compelling, concise, and elegant subheadline for the homepage hero section.

The subheadline should complement the main headline, be aspirational, and evoke a sense of modern femininity and heritage. Keep it under 150 characters.

Main Headline: "{{headline}}"

Generate only the subheadline text.
`,
});

const generateSubheadlineFlow = ai.defineFlow(
  {
    name: 'generateSubheadlineFlow',
    inputSchema: GenerateSubheadlineInputSchema,
    outputSchema: GenerateSubheadlineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    