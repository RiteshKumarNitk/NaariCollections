'use server';

/**
 * @fileOverview A flow to generate product descriptions using AI.
 *
 * - generateDescription - A function that generates a product description based on its attributes.
 * - GenerateDescriptionInput - The input type for the generateDescription function.
 * - GenerateDescriptionOutput - The return type for the generateDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product.'),
  fabric: z.string().describe('The fabric of the product.'),
});

export type GenerateDescriptionInput = z.infer<
  typeof GenerateDescriptionInputSchema
>;

const GenerateDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated product description.'),
});

export type GenerateDescriptionOutput = z.infer<
  typeof GenerateDescriptionOutputSchema
>;

export async function generateDescription(
  input: GenerateDescriptionInput
): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: GenerateDescriptionOutputSchema },
  prompt: `You are an expert copywriter for a women's ethnic wear brand called "Naari".

Your task is to write a compelling, concise, and elegant product description.

The tone should be sophisticated, aspirational, and celebratory of Indian heritage and modern femininity.

Use the following product details to craft the description. Focus on the key features and the feeling the garment evokes. Keep it under 200 characters.

Product Name: {{name}}
Category: {{category}}
Fabric: {{fabric}}

Generate only the description text.
`,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
