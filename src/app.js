require('dotenv').config();
const express = require('express');
const app = express();
const taskRoutes = require('./routes/task.routes');

app.use(express.json());
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
