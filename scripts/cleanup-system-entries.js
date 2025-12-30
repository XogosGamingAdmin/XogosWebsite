#!/usr/bin/env node
/**
 * Cleanup System Entries
 * Removes system-generated statistics and financials entries
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function cleanup() {
  const client = await pool.connect();
  try {
    console.log('\nRemoving system-generated entries...\n');

    // Delete system statistics
    const statsResult = await client.query(
      "DELETE FROM xogos_statistics WHERE updated_by = 'system' RETURNING id"
    );
    console.log(`Deleted ${statsResult.rowCount} system statistics entries`);

    // Delete system financials
    const finResult = await client.query(
      "DELETE FROM xogos_financials WHERE updated_by = 'system' RETURNING id"
    );
    console.log(`Deleted ${finResult.rowCount} system financials entries\n`);

    // Show remaining statistics
    const remaining = await client.query(
      'SELECT id, accounts, active_users, total_hours, last_updated, updated_by FROM xogos_statistics ORDER BY last_updated DESC LIMIT 5'
    );
    console.log('Remaining statistics entries:');
    remaining.rows.forEach(row => {
      const date = new Date(row.last_updated).toLocaleString();
      console.log(`  ${date} | Accounts: ${row.accounts}, Users: ${row.active_users}, Hours: ${row.total_hours} | By: ${row.updated_by}`);
    });

    client.release();
    pool.end();
    console.log('\nCleanup complete!\n');
  } catch (error) {
    console.error('\nError:', error.message);
    client.release();
    pool.end();
    process.exit(1);
  }
}

cleanup();
