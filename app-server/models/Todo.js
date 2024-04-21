const { DataTypes } = require('sequelize');
const db = require('../db.js');
const User = require('./User');

const Todo = db.define('Todo', {
  task: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  userId: {
    type: User,
    allowNull: false
  }
});

// Define associations if any
Todo.belongsTo(User); // Example association: Each todo belongs to a user

module.exports = Todo;
