const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:'); // Use in-memory database for simplicity

// Create users table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Create todos table
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      task TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
