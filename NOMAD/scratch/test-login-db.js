import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nomad_db',
});

try {
  const [rows] = await pool.query('SELECT id, email, name, password FROM users LIMIT 5');
  console.log('users count sample:', rows.length);
  for (const u of rows) {
    console.log('-', u.email, 'pw starts with $2?', String(u.password || '').startsWith('$2'));
  }
  const [test] = await pool.query('SELECT * FROM users WHERE email = ?', ['nonexistent@test.com']);
  console.log('email query ok, rows:', test.length);
  for (const u of rows) {
    const p = u.password || '';
    if (!p.startsWith('$2')) {
      console.log('BAD HASH (not bcrypt):', u.email);
      continue;
    }
    try {
      await bcrypt.compare('test', p);
      console.log('bcrypt ok:', u.email);
    } catch (e) {
      console.log('bcrypt THROWS:', u.email, e.message);
    }
  }
} catch (e) {
  console.error('FAILED:', e.message);
  console.error(e);
}
await pool.end();
