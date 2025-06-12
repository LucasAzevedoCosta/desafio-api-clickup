const { pgTable, text, timestamp, pgEnum } = require('drizzle-orm/pg-core');

const statusEnum = pgEnum('status_enum', ['to do', 'in progress', 'complete']);

const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),    
  title: text('title'),
  description: text('description'),
  status: statusEnum('status'),
  startDate: timestamp('start_date'),
  deadline: timestamp('deadline'),
});

module.exports = { tasks, statusEnum };
