const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET; // Change this to a secure secret for production

function createUser(username, password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      }
    });
  });
}

function authenticateUser(username, password) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        reject(new Error('User not found'));
      } else {
        const match = await bcrypt.compare(password, row.password);
        if (match) {
          resolve(row.id);
        } else {
          reject(new Error('Incorrect password'));
        }
      }
    });
  });
}

function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

module.exports = {
  createUser,
  authenticateUser,
  generateAccessToken
};
