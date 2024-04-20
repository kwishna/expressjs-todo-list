const fs = require('fs');
const path = require('path');

const todoFilePath = path.join(__dirname, 'todos.json');

function getAllTodos() {
  const todos = JSON.parse(fs.readFileSync(todoFilePath));
  return todos;
}

function createTodo(newTodo) {
  const todos = getAllTodos();
  const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
  newTodo.id = id;
  todos.push(newTodo);
  fs.writeFileSync(todoFilePath, JSON.stringify(todos));
  return newTodo;
}

function updateTodo(todoId, updatedTodo) {
  const todos = getAllTodos();
  const index = todos.findIndex(todo => todo.id === parseInt(todoId));
  if (index !== -1) {
    todos[index] = { id: parseInt(todoId), ...updatedTodo };
    fs.writeFileSync(todoFilePath, JSON.stringify(todos));
    return todos[index];
  } else {
    return null;
  }
}

function deleteTodo(todoId) {
  const todos = getAllTodos();
  const updatedTodos = todos.filter(todo => todo.id !== parseInt(todoId));
  fs.writeFileSync(todoFilePath, JSON.stringify(updatedTodos));
}

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
