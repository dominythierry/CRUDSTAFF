const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_tXy9sdcTu5ig@ep-round-moon-acer9avg-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
  } else {
    console.log("Conectado ao PostgreSQL!");
    release();
  }
});

module.exports = pool;