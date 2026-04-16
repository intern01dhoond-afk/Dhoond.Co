const { Pool } = require("pg");

// Support both individual vars and a full DATABASE_URL (Neon, Railway, Render etc.)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        // SSL is required for all managed cloud Postgres providers (Neon, Supabase, Railway…)
        // rejectUnauthorized: false is safe for trusted providers; set to true if you have a CA cert
        ssl: { rejectUnauthorized: false },
      }
    : {
        // Local development — no SSL needed
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host:     process.env.DB_HOST,
        port:     Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
      }
);

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

module.exports = pool;