import {readFileSync, existsSync} from 'fs';
import {join} from 'path';
import {Client} from 'pg';

async function main() {
  const root = join(__dirname, '..', '..');
  const sqlPath = join(root, 'falla_cero.sql');
  const resetPath = join(root, 'reset_sequences.sql');

  if (!existsSync(sqlPath)) {
    console.error('falla_cero.sql not found at', sqlPath);
    process.exit(1);
  }

  const sql = readFileSync(sqlPath, 'utf8');
  const resetSql = existsSync(resetPath) ? readFileSync(resetPath, 'utf8') : null;

  // Connection settings should match api-graphql/src/app.module.ts
  const client = new Client({
    host: process.env.DB_HOST || 'db.utvt.cloud',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'fallacero',
    password: process.env.DB_PASS || 'WB&0dp043NZp',
    database: process.env.DB_NAME || 'db_fallacero',
  });

  try {
    await client.connect();
    console.log('Connected to database, starting import...');

    // Execute the SQL dump. Many Postgres servers accept multiple statements in one query.
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Imported falla_cero.sql successfully.');

    if (resetSql) {
      console.log('Applying reset_sequences.sql...');
      await client.query(resetSql);
      console.log('Sequences reset.');
    }

    await client.end();
    console.log('Done.');
  } catch (err: any) {
    console.error('Import failed:', err.message || err);
    try { await client.query('ROLLBACK'); } catch (_) {}
    await client.end();
    process.exit(1);
  }
}

main();
