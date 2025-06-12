const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.get('/tasks', taskController.syncTasks);

router.post('/tasks', taskController.createTask);

router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;