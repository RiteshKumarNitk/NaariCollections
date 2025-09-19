
import { config } from 'dotenv';
config();

import {dev} from '@genkit-ai/next';
import {googleAI} from '@genkit-ai/googleai';

import './flows/category-slider-new-arrivals.ts';
import './flows/generate-description-flow.ts';
import './flows/generate-subheadline-flow.ts';

dev({
  plugins: [googleAI()],
});

    