const express = require('express');
const Todo = require('../models/Todo');
const authenticateLoginToken = require('../middlewares/authorization');

const router = express.Router();

router.use(authenticateLoginToken);

// ----------- CRUD ---------------

/**
* Retrieves a list of todos for the authenticated user.
*
* @param {Object} req - The HTTP request object.
* @param {Object} req.user - The authenticated user object.
* @param {string} req.user.userId - The unique identifier of the authenticated user.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A promise that resolves when the response is sent.
*/
router.get('/list', async (req, res) => {
  const userId = req.user.userId;
  try {
    const todos = await Todo.findAll({ where: { userId } });
    res.status(200).json(todos);
  } catch (error) {
    console.error(error?.message);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new TODO
/**
* Creates a new TODO item for the authenticated user.
*
* @param {Object} req - The HTTP request object.
* @param {string} req.user.userId - The ID of the authenticated user.
* @param {string} req.body.task - The task description for the new TODO item.
* @param {Object} res - The HTTP response object.
* @returns {Promise<Object>} - The newly created TODO item.
* @throws {Error} - If there is an error creating the TODO item.
*/
router.post('/create', async (req, res) => {
  const userId = req.user.userId;
  const { task } = req.body;

  console.log(userId, task);
  try {
    const todo = await Todo.create({ "userId": `${userId}`, task });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update an existing TODO by ID
/**
* Updates an existing TODO item.
*
* @param {string} req.params.id - The ID of the TODO item to update.
* @param {string} req.body.task - The new task text for the TODO item.
* @param {boolean} req.body.completed - The new completed status for the TODO item.
* @returns {Promise<Object>} The updated TODO item.
*/
router.put('/:id/update', async (req, res) => {
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
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a TODO by ID
/**
* Deletes a todo item by its ID.
*
* @param {string} req.params.id - The ID of the todo item to delete.
* @param {object} req.user - The authenticated user object.
* @param {number} req.user.userId - The ID of the authenticated user.
* @returns {204} - Successful deletion of the todo item.
* @returns {404} - Todo item not found.
* @returns {500} - Failed to delete the todo item.
*/
router.delete('/:id/delete', async (req, res) => {
  const userId = req.user.userId;
  const todoId = req.params.id;
  try {
    const todo = await Todo.findOne({ where: { id: todoId, userId } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    await todo.destroy();
    res.status(202).json({ message: "Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// // Middleware to authenticate requests
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];

//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

module.exports = router;
