const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const schema = require('./schema');

const pool = new Pool({
  connectionString: 'postgresql://usuario:senha@localhost:5439/desafioSerUtil',
});

const db = drizzle(pool, { schema });

module.exports = { db, schema };
