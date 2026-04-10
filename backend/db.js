const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10,
      }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'barbearia_db',
        password: 'admin',
        port: 5432,
      }
);

module.exports = pool;