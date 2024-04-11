const express = require('express');
const auth = require('../auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userId = await auth.createUser(username, password);
    res.json({ message: 'User created successfully', userId });
  } catch (error) {
    if (error.message === 'Username already exists') {
      return res.status(400).json({ error: 'Duplicate username' });
    }
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
    console.error(error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
