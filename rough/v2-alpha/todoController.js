const express = require('express');
const db = require('./db');
const auth = require('./auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userId = await auth.createUser(username, password);
    res.json({ message: 'User created successfully', userId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userId = await auth.authenticateUser(username, password);
    const accessToken = auth.generateAccessToken(userId);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// CRUD operations for TODOs
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  db.all('SELECT * FROM todos WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    } else {
      res.json(rows);
    }
  });
});

router.post('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { task, completed } = req.body;
  db.run('INSERT INTO todos (user_id, task, completed) VALUES (?, ?, ?)', [userId, task, completed || 0], function(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to create todo' });
    } else {
      res.json({ id: this.lastID, user_id: userId, task, completed: completed || 0 });
    }
  });
});

router.put('/:id', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const todoId = req.params.id;
  const { task, completed } = req.body;
  db.run('UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?', [task, completed, todoId, userId], function(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to update todo' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.json({ id: todoId, user_id: userId, task, completed });
    }
  });
});

router.delete('/:id', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const todoId = req.params.id;
  db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', [todoId, userId], function(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to delete todo' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.sendStatus(204);
    }
  });
});

// ----------------------------

// // CRUD operations for TODOs
// router.get('/', authenticateToken, async (req, res) => {
//   const userId = req.user.userId;
//   try {
//     const todos = await Todo.findAll({ where: { userId } });
//     res.json(todos);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch todos' });
//   }
// });

// router.post('/', authenticateToken, async (req, res) => {
//   const userId = req.user.userId;
//   const { task, completed } = req.body;
//   try {
//     const todo = await Todo.create({ userId, task, completed });
//     res.json(todo);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create todo' });
//   }
// });

// router.put('/:id', authenticateToken, async (req, res) => {
//   const userId = req.user.userId;
//   const todoId = req.params.id;
//   const { task, completed } = req.body;
//   try {
//     const todo = await Todo.findOne({ where: { id: todoId, userId } });
//     if (!todo) {
//       return res.status(404).json({ error: 'Todo not found' });
//     }
//     todo.task = task;
//     todo.completed = completed;
//     await todo.save();
//     res.json(todo);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update todo' });
//   }
// });

// router.delete('/:id', authenticateToken, async (req, res) => {
//   const userId = req.user.userId;
//   const todoId = req.params.id;
//   try {
//     const todo = await Todo.findOne({ where: { id: todoId, userId } });
//     if (!todo) {
//       return res.status(404).json({ error: 'Todo not found' });
//     }
//     await todo.destroy();
//     res.sendStatus(204);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete todo' });
//   }
// });


module.exports = router;
