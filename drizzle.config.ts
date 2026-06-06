import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${nodeEnv}` });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
