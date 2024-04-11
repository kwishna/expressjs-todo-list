const express = require('express');
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ----------- CRUD ---------------

router.get('/list', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const todos = await Todo.findAll({ where: { userId } });
    res.json(todos);
  } catch (error) {
    console.error(error?.message);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new TODO
router.post('/create', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { task } = req.body;

  console.log(userId, task);
  try {
    const todo = await Todo.create({ "userId": `${userId}`, task });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update an existing TODO by ID
router.put('/:id/update', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const todoId = req.params.id;
  const { task, completed } = req.body;

  try {
    const todo = await Todo.findOne({ where: { id: todoId, userId } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    todo.task = task;
    todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a TODO by ID
router.delete('/:id/delete', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const todoId = req.params.id;
  try {
    const todo = await Todo.findOne({ where: { id: todoId, userId } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    await todo.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
