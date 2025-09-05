'use server';

/**
 * @fileOverview A flow to determine which products are new arrivals based on admin metadata.
 *
 * - getNewArrivals - A function that returns a list of new arrival product codes.
 * - GetNewArrivalsInput - The input type for the getNewArrivals function.
 * - GetNewArrivalsOutput - The return type for the getNewArrivals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetNewArrivalsInputSchema = z.object({
  productCodes: z
    .array(z.string())
    .describe('An array of product codes to consider.'),
  creationDates: z
    .array(z.string())
    .describe('An array of ISO date strings representing product creation dates.'),
  numProductsToDisplay: z
    .number()
    .describe('The maximum number of new arrival products to display.'),
});

export type GetNewArrivalsInput = z.infer<typeof GetNewArrivalsInputSchema>;

const GetNewArrivalsOutputSchema = z.object({
  newArrivalProductCodes: z
    .array(z.string())
    .describe(
      'An array of product codes that are considered new arrivals, sorted by freshness.'
    ),
});

export type GetNewArrivalsOutput = z.infer<typeof GetNewArrivalsOutputSchema>;

export async function getNewArrivals(input: GetNewArrivalsInput): Promise<GetNewArrivalsOutput> {
  return getNewArrivalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getNewArrivalsPrompt',
  input: {schema: GetNewArrivalsInputSchema},
  output: {schema: GetNewArrivalsOutputSchema},
  prompt: `You are an expert in e-commerce product curation.

Given a list of product codes and their creation dates, identify the most recent new arrivals.

Prioritize products with more recent creation dates.

Return a list of the {{numProductsToDisplay}} most recent product codes, sorted by freshness (most recent first).

Product Codes: {{productCodes}}
Creation Dates: {{creationDates}}

Ensure that the product codes in the returned list correspond to the provided creation dates.

Output only the product codes in array format, without additional explanations.
`,
});

const getNewArrivalsFlow = ai.defineFlow(
  {
    name: 'getNewArrivalsFlow',
    inputSchema: GetNewArrivalsInputSchema,
    outputSchema: GetNewArrivalsOutputSchema,
  },
  async input => {
    // Basic validation to ensure arrays are of equal length
    if (input.productCodes.length !== input.creationDates.length) {
      throw new Error(
        'The number of product codes must match the number of creation dates.'
      );
    }

    const {output} = await prompt(input);
    return output!;
  }
);
