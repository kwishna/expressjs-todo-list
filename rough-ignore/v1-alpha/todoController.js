const express = require('express');
const todoService = require('./todoService');

const router = express.Router();

// GET all TODOs
router.get('/', (req, res) => {
  const todos = todoService.getAllTodos();
  res.json(todos);
});

// POST a new TODO
router.post('/', (req, res) => {
  const newTodo = req.body;
  const createdTodo = todoService.createTodo(newTodo);
  res.json(createdTodo);
});

// PUT update a TODO
router.put('/:id', (req, res) => {
  const todoId = req.params.id;
  const updatedTodo = todoService.updateTodo(todoId, req.body);
  res.json(updatedTodo);
});

// DELETE a TODO
router.delete('/:id', (req, res) => {
  const todoId = req.params.id;
  todoService.deleteTodo(todoId);
  res.sendStatus(204);
});

module.exports = router;
