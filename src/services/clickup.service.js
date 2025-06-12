const axios = require('axios');

const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';
const headers = {
  Authorization: process.env.CLICKUP_TOKEN,
};

async function getTasksFromClickUp(listId) {
  const response = await axios.get(`${CLICKUP_API_BASE}/list/${listId}/task`, { headers });
  return response.data.tasks;
}

async function createTaskInClickUp(listId, taskData) {
  const response = await axios.post(`${CLICKUP_API_BASE}/list/${listId}/task`, taskData, { headers });
  return response.data;
}

module.exports = {
  getTasksFromClickUp,
  createTaskInClickUp,
};