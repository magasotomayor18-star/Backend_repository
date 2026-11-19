import { readFile } from 'node:fs/promises';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set before seeding.');
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
let transactionStarted = false;

try {
  await client.connect();
  await client.query('BEGIN');
  transactionStarted = true;
  await client.query('SELECT pg_advisory_xact_lock(34117204)');

  const { rows } = await client.query('SELECT COUNT(*)::int AS total FROM public.producto');
  if (rows[0].total === 0) {
    const seedSql = await readFile(new URL('./seed.sql', import.meta.url), 'utf8');
    await client.query(seedSql);
    console.log('Inserted the 10,000 demo products.');
  } else {
    console.log(`Seed skipped; product table already has ${rows[0].total} rows.`);
  }

  await client.query('COMMIT');
} catch (error) {
  if (transactionStarted) {
    await client.query('ROLLBACK');
  }
  throw error;
} finally {
  await client.end();
}
