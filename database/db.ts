import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { isNull, SQL, and, eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const baseDb = drizzle({ client: sql });

// Add custom methods to the Drizzle instance
type ExtendedDb = typeof baseDb & {
  $softDelete: (table: any, id: string) => Promise<unknown>;
  $whereNotDeleted: <T = any>(table: any, where: SQL) => Promise<T[]>;
};

// Create the extended db object
export const db = baseDb as ExtendedDb;

db.$softDelete = async (table: any, id: string) => {
  return baseDb.update(table).set({ deletedAt: new Date() }).where(eq(table.id, id));
};

db.$whereNotDeleted = <T = any>(table: any, where: SQL): Promise<T[]> => {
  return baseDb
    .select()
    .from(table)
    .where(and(isNull(table.deletedAt), where));
};
