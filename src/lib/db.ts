import { Pool } from 'pg';
import type { QueryResultRow } from 'pg';

let pool: Pool | null = null;

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  return new Pool({ connectionString });
}

export function getDb() {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}

type QueryParam = string | number | boolean | null;

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: QueryParam[]
) {
  const client = await getDb().connect();

  try {
    const result = await client.query<T>(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}
