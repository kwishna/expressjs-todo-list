const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Set up Global configuration access
dotenv.config({ path: path.resolve('./.env') });
const User = require('../models/User');

/**
* Checks if a user with the given username already exists in the database.
*
* @param {string} username - The username to check.
* @returns {Promise<boolean>} - `true` if a user with the given username exists, `false` otherwise.
*/
async function isExistingUser(username) {
  const existingUser = await User.findOne({ where: { username } });
  return !!existingUser?.dataValues?.id;
}

/**
* Creates a new user in the system.
*
* @param {string} username - The username for the new user.
* @param {string} password - The password for the new user.
* @returns {Promise<{ message: string, userId: number }>} - An object containing a success message and the ID of the newly created user.
* @throws {Error} - If the username already exists or there is a failure creating the user.
*/
async function createUser(username, password) {
  try {
    const _salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, _salt);
    const user = await User.create({ username, password: hashedPassword });
    return user.id;
  } catch (error) {
    console.error(error?.message);
    throw new Error('Failed to create user');
  }
}

/**
* Compares a provided password with a stored password hash.
*
* @param {string} userPassword - The password to compare against the stored hash.
* @returns {Promise<boolean>} - A Promise that resolves to true if the passwords match, false otherwise.
* @throws {Error} - If an error occurs while comparing the passwords.
*/
async function isValidPassword(password, userPassword) {
  try {
    const match = await bcrypt.compare(password, userPassword);
    return match;
  } catch (error) {
    throw error;
  }
}

/**
* Retrieves a user from the database by their username.
*
* @param {string} username - The username of the user to retrieve.
* @returns {Promise<User|null>} - A Promise that resolves to the user object if found, or null if not found.
* @throws {Error} - If an error occurs while retrieving the user from the database.
*/
async function getUserForDB(username) {
  try {
    return await User.findOne({ where: { username } });
  } catch (err) {
    throw err;
  }
}

/**
* Generates a JWT access token for the given user ID.
*
* @param {User.User} user - The ID of the user to generate the token for.
* @returns {string} A JWT access token that expires in 1 hour.
*/
function generateAccessToken(user) {
  const payload = {
    userId: user.id,
    userName: user.username
  }
  console.log(payload);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
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
  isExistingUser,
  createUser,
  isValidPassword,
  getUserForDB,
  generateAccessToken
};