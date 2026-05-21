// API base URL — uses relative path in production (same origin),
// falls back to localhost:3001 for local development
const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

export default API_BASE;
