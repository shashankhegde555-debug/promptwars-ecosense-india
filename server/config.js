import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(10, 'Gemini API key is required'),
  GCP_PROJECT_ID: z.string().default('ecosense-india'),
  GCS_BUCKET_NAME: z.string().default('ecosense-india-analytics'),
  BIGQUERY_DATASET: z.string().default('ecosense_analytics'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
});

let config;
try {
  const parsed = envSchema.parse(process.env);
  config = {
    gemini: {
      apiKey: parsed.GEMINI_API_KEY,
      model: 'gemini-2.5-flash',
    },
    gcp: {
      projectId: parsed.GCP_PROJECT_ID,
      bucketName: parsed.GCS_BUCKET_NAME,
      bigqueryDataset: parsed.BIGQUERY_DATASET,
    },
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
    isProduction: parsed.NODE_ENV === 'production',
  };
} catch (err) {
  console.error('Invalid environment configuration:', err.errors);
  process.exit(1);
}

export default config;
