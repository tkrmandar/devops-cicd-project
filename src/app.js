const express = require('express');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(helmet());
app.use(express.json());

let tasks = [];

app.get('/', (req, res) => res.json({ message: 'Task Manager API', version: '1.0.0' }));

app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', uptime: process.uptime() }));

app.get('/tasks', (req, res) => res.json({ tasks, count: tasks.length }));

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = { id: uuidv4(), title, description: description || '', status: 'pending', createdAt: new Date().toISOString() };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted' });
});

module.exports = { app, resetTasks: () => { tasks = []; } };
