const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Set up Global configuration access
dotenv.config({path: path.resolve('./.env')});
const User = require('./models/User');
const { log } = require('console');

async function createUser(username, password) {
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser?.dataValues?.id) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    return { message: 'User created successfully', userId: user.id };
    
  } catch (error) {
    console.error(error?.message);
    throw new Error('Failed to create user');
  }
}

async function authenticateUser(username, password) {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Incorrect password');
    }
    return user.id;
  } catch (error) {
    console.error(error?.message);
    throw error;
  }
}

function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}



// function generateAccessToken(userId) {
//   // Check if there is an existing token
//   const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is passed in the Authorization header
  
//   // If there is no existing token or the existing token is expired, generate a new token
//   if (!token || isTokenExpired(token)) {
//     return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   } else {
//     return token; // Return the existing token
//   }
// }

// function isTokenExpired(token) {
//   try {
//     // Decode the token to get the expiration time
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const expirationTime = decoded.exp * 1000; // Convert expiration time to milliseconds
//     const currentTime = Date.now();
//     // Check if the current time is greater than the expiration time
//     return currentTime > expirationTime;
//   } catch (error) {
//     // If there's an error decoding the token, consider it expired
//     return true;
//   }
// }

module.exports = {
  createUser,
  authenticateUser,
  generateAccessToken
};