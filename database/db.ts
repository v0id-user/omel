import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  isNull,
  SQL,
  and,
  eq,
  gt,
  lt,
  Table,
  InferSelectModel,
  AnyColumn,
  desc,
  asc,
} from 'drizzle-orm';

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

// Interface for tables that support pagination
interface PaginatedTable {
  id: AnyColumn;
}

// Define pagination direction type
type PaginationDirection = 'asc' | 'desc';

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

  /**
   * Cursor-based pagination helper. Returns `limit` rows that are **not** soft-deleted
   * and an opaque `nextCursor` string that can be supplied in the next call.
   *
   * – `cursor` should be the `id` of the last item from the previous page.
   * – `direction` defaults to `'asc'`. If `'desc'`, results are reversed accordingly.
   *
   * Note: This function enforces ordering by id for consistent pagination.
   */
  $paginateCursor: <TTable extends SoftDeleteTable & PaginatedTable>(
    table: TTable,
    opts: {
      where?: SQL;
      cursor?: string | null;
      limit?: number;
      direction?: PaginationDirection;
    }
  ) => Promise<{
    data: RemoveDeletedAt<InferSelectModel<TTable>>[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;
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
    .where(and(isNull(table.deletedAt), where) as SQL)
    .execute()) as RemoveDeletedAt<InferSelectModel<TTable>>[];
};

db.$paginateCursor = async <TTable extends SoftDeleteTable & PaginatedTable>(
  table: TTable,
  {
    where,
    cursor,
    limit = 20,
    direction = 'asc',
  }: {
    where?: SQL;
    cursor?: string | null;
    limit?: number;
    direction?: PaginationDirection;
  }
) => {
  // Build the base predicate: not soft-deleted
  let predicate: SQL = isNull(table.deletedAt);

  if (where) predicate = and(predicate, where) as SQL;

  // Apply cursor filter based on the id column.
  if (cursor) {
    const cursorCondition = (
      direction === 'asc' ? gt(table.id, cursor!) : lt(table.id, cursor!)
    ) as SQL;

    predicate = and(predicate, cursorCondition) as SQL;
  }

  // Build the query with DB-level sorting
  const query = baseDb
    .select()
    .from(table as Table)
    .where(predicate)
    .limit(limit + 1);

  // Add order by clause based on direction
  const rows = (await (
    direction === 'asc' ? query.orderBy(asc(table.id)) : query.orderBy(desc(table.id))
  ).execute()) as RemoveDeletedAt<InferSelectModel<TTable>>[];

  let nextCursor: string | null = null;
  let hasMore = false;

  if (rows.length > limit) {
    const next = rows.pop()!;
    nextCursor = (next as any).id as string;
    hasMore = true;
  }

  return { data: rows, nextCursor, hasMore };
};

// Stand-alone alias if other modules ever need it
export type ExtendedDb = typeof db;
