import { Pool } from 'pg';

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

export async function query<T>(text: string, params?: Array<string | number | boolean | null>) {
  const client = await getDb().connect();

  try {
    const result = await client.query<T>(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}
