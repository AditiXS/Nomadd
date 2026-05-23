/**
 * Paste your Atlas connection string to update .env automatically.
 * Usage: node scratch/apply-mongo-uri.mjs "mongodb+srv://user:pass@host/nomad?..."
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';

const uri = process.argv[2];
if (!uri?.includes('mongodb')) {
  console.error('Usage: node scratch/apply-mongo-uri.mjs "mongodb+srv://..."');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
let content = readFileSync(envPath, 'utf8');

const hostMatch = uri.match(/@([^/]+)/);
const clusterHost = hostMatch?.[1] || '';

content = content.replace(/^MONGODB_URI=.*$/m, `MONGODB_URI=${uri}`);
if (clusterHost) {
  if (/^MONGODB_CLUSTER=.*$/m.test(content)) {
    content = content.replace(/^MONGODB_CLUSTER=.*$/m, `MONGODB_CLUSTER=${clusterHost}`);
  } else {
    content += `\nMONGODB_CLUSTER=${clusterHost}\n`;
  }
}

writeFileSync(envPath, content);
console.log('✅ Updated .env with MONGODB_URI');
console.log('   Cluster host:', clusterHost);
