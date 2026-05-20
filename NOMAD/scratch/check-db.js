import mysql from 'mysql2/promise';

async function main() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'aditi786'
    });
    await conn.query('CREATE DATABASE IF NOT EXISTS nomad_db');
    console.log('✅ Database nomad_db checked/created successfully!');
    await conn.end();
  } catch (err) {
    console.error('❌ Database check/creation failed:', err.message);
  }
}

main();
