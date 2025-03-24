import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ['public'],
  strict: false,
  verbose: true,
  tablesFilter: ['customers', 'contacts', 'interactions', 'deals', 'tasks'],
});
