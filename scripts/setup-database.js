#!/usr/bin/env node
/**
 * Database Setup Script
 * Connects to AWS RDS and initializes the schema
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  console.log('\n🔧 Xogos Database Setup\n');
  console.log(`Connecting to: ${process.env.DATABASE_HOST}`);
  console.log(`Database: ${process.env.DATABASE_NAME}`);
  console.log(`User: ${process.env.DATABASE_USER}\n`);

  try {
    // Test connection
    console.log('1️⃣  Testing connection...');
    const client = await pool.connect();
    console.log('   ✅ Connected successfully!\n');

    // Read schema file
    console.log('2️⃣  Reading schema file...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('   ✅ Schema file loaded\n');

    // Execute schema
    console.log('3️⃣  Creating tables...');
    await client.query(schema);
    console.log('   ✅ Tables created successfully!\n');

    // Verify tables
    console.log('4️⃣  Verifying tables...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('   Tables found:');
    result.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });

    client.release();

    console.log('\n🎉 Database setup complete!\n');
    console.log('Next steps:');
    console.log('1. Test locally: npm run dev');
    console.log('2. Go to: http://localhost:3000/admin/statistics');
    console.log('3. Add some test data\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nCommon fixes:');
    console.error('- Check DATABASE_* variables in .env.local');
    console.error('- Verify database endpoint is correct');
    console.error('- Check security group allows your IP');
    console.error('- Confirm password is correct\n');
    process.exit(1);
  }
}

setupDatabase();
