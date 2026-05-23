import dotenv from 'dotenv';
import { getMongoUri, connectDB } from '../db/connect.js';
import mongoose from 'mongoose';

dotenv.config();

try {
  console.log('Connecting to:', getMongoUri().replace(/:([^:@]+)@/, ':***@'));
  await connectDB();
  await mongoose.connection.db.admin().ping();
  console.log('✅ Ping OK');
  await mongoose.disconnect();
} catch (e) {
  console.error('❌', e.message);
  process.exit(1);
}
