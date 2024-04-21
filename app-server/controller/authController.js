const express = require('express');
const auth = require('../handlers/auth');
const User = require('../models/User');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {

    if (username && password) {

      if (await auth.isExistingUser(username)) {
        return res.status(409).json({ message: `${username} User already exists` });
      }

      const userId = await auth.createUser(username, password);
      res.status(201).json({ message: 'User created successfully', userId });

    }

    else {
      return res.status(400).json({ error: 'Invalid username/password.' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});


// Login
/**
* Handles the login process for the application.
*
* @param {Object} req - The HTTP request object.
* @param {string} req.body.username - The username provided by the user.
* @param {string} req.body.password - The password provided by the user.
* @param {Object} res - The HTTP response object.
* @returns {Promise<Object>} - An object containing the access token if the login is successful, or an error message if the login fails.
*/
router.post('/login', async (req, res) => {
  const requserName = req?.body?.username;
  const reqPassword = req?.body?.password;

  try {
    if (!(await auth.isExistingUser(requserName))) {
      return res.status(401).json({ message: `${requserName} User does exists.` });
    }

    const user = await auth.getUserForDB(requserName);
    const { password } = user;

    if (!(await auth.isValidPassword(reqPassword, password))) {
      return res.status(401).json({ message: `Invalid Password Provided!` });
    }

    const accessToken = auth.generateAccessToken(user);

    res.status(200).json({ success: true, accessToken });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
