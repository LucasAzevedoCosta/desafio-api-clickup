/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: "postgresql",
  dbCredentials: {
     url: "postgresql://usuario:senha@localhost:5439/desafioSerUtil",
  },
};
