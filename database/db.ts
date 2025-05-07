import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { isNull, SQL, and, eq, Table, InferSelectModel, AnyColumn } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const baseDb = drizzle({ client: sql });

// Util to drop the "deletedAt" field from the inferred model (if it exists)
type RemoveDeletedAt<T> = T extends { deletedAt?: unknown } ? Omit<T, 'deletedAt'> : T;

// Helper type: a Drizzle table that owns `id` and `deletedAt` columns.
// Using `AnyColumn` keeps us fully-typed without falling back to `any`.
type SoftDeleteTable = Table & {
  id: AnyColumn;
  deletedAt: AnyColumn;
};

// Create the extended db object
export const db = baseDb as typeof baseDb & {
  /**
   * Soft-delete a single row by id. The implementation merely builds the query –
   * callers can decide whether to execute it or chain additional query helpers.
   */
  $softDelete: <TTable extends SoftDeleteTable>(
    table: TTable,
    id: string
  ) => Promise<void | unknown>;

  /**
   * Select all rows that are **not** soft-deleted according to the supplied predicate.
   * The result type is inferred directly from the Drizzle table definition so that
   * callers get fully-typed results (e.g. `Contact[]`, `Task[]`, …).
   */
  $whereNotDeleted: <TTable extends SoftDeleteTable>(
    table: TTable,
    where: SQL
  ) => Promise<RemoveDeletedAt<InferSelectModel<TTable>>[]>;
};

db.$softDelete = async <TTable extends SoftDeleteTable>(table: TTable, id: string) => {
  await baseDb
    .update(table as Table)
    .set({ deletedAt: new Date() })
    .where(eq(table.id, id))
    .execute();
};

db.$whereNotDeleted = async <TTable extends SoftDeleteTable>(
  table: TTable,
  where: SQL
): Promise<RemoveDeletedAt<InferSelectModel<TTable>>[]> => {
  return (await baseDb
    .select()
    .from(table as Table)
    .where(and(isNull(table.deletedAt), where))
    .execute()) as RemoveDeletedAt<InferSelectModel<TTable>>[];
};

// Stand-alone alias if other modules ever need it
export type ExtendedDb = typeof db;
