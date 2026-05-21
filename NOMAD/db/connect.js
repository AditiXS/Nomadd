import mongoose from 'mongoose';
import dns from 'node:dns';

/** Node on Windows sometimes fails SRV lookup; prepend public DNS resolvers. */
function ensureDnsForAtlas() {
  if (process.platform !== 'win32') return;
  try {
    const current = dns.getServers();
    const extras = ['8.8.8.8', '8.8.4.4'];
    const merged = [...extras, ...current.filter((s) => !extras.includes(s))];
    dns.setServers(merged);
  } catch {
    /* ignore */
  }
}

export function getMongoUri() {
  if (process.env.MONGODB_URI?.trim()) {
    return process.env.MONGODB_URI.trim();
  }

  const user = process.env.MONGODB_USER;
  const pass = process.env.MONGODB_PASSWORD;
  const host = (process.env.MONGODB_CLUSTER || process.env.MONGODB_HOST || '').trim();

  if (user && pass && host) {
    const clusterHost = host
      .replace(/^mongodb\+srv:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^[^@]+@/, '');
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${clusterHost}/nomad?retryWrites=true&w=majority`;
  }

  throw new Error(
    'Set MONGODB_URI in .env, or set MONGODB_USER, MONGODB_PASSWORD, and MONGODB_CLUSTER (host from Atlas → Connect → Drivers, e.g. nomad.xxxxx.mongodb.net)'
  );
}

export async function connectDB() {
  ensureDnsForAtlas();
  const uri = getMongoUri();
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 20000,
    family: 4,
  });
  console.log('✅ MongoDB Atlas connected');
}
