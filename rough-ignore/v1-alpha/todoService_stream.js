const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

function getUserTodoFilePath(userId) {
  return path.join(__dirname, `todos_${userId}.json`);
}

function getAllTodos(userId) {
  return new Promise((resolve, reject) => {
    const todoFilePath = getUserTodoFilePath(userId);
    if (fs.existsSync(todoFilePath)) {
      const todosStream = fs.createReadStream(todoFilePath);
      let data = '';

      todosStream.on('data', chunk => {
        data += chunk;
      });

      todosStream.on('end', () => {
        const todos = JSON.parse(data);
        resolve(todos);
      });

      todosStream.on('error', error => {
        reject(error);
      });
    } else {
      resolve([]);
    }
  });
}

function createTodoFile(userId) {
  return new Promise((resolve, reject) => {
    const todoFilePath = getUserTodoFilePath(userId);
    const writeStream = fs.createWriteStream(todoFilePath);

    writeStream.on('error', error => {
      reject(error);
    });

    writeStream.on('finish', () => {
      resolve();
    });

    writeStream.write('[]');
    writeStream.end();
  });
}

function createTodo(userId, newTodo) {
  return new Promise(async (resolve, reject) => {
    try {
      const todoFilePath = getUserTodoFilePath(userId);
      if (!fs.existsSync(todoFilePath)) {
        await createTodoFile(userId);
      }

      let todos = await getAllTodos(userId);

      const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
      newTodo.id = id;
      todos.push(newTodo);

      const writeStream = fs.createWriteStream(todoFilePath);
      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          callback(null, chunk);
        }
      });

      transformStream.write(JSON.stringify(todos));
      transformStream.pipe(writeStream);

      writeStream.on('error', error => {
        reject(error);
      });

      writeStream.on('finish', () => {
        resolve(newTodo);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateTodo(userId, todoId, updatedTodo) {
  return new Promise(async (resolve, reject) => {
    try {
      const todoFilePath = getUserTodoFilePath(userId);
      if (!fs.existsSync(todoFilePath)) {
        await createTodoFile(userId);
      }

      let todos = await getAllTodos(userId);

      const index = todos.findIndex(todo => todo.id === parseInt(todoId));
      if (index !== -1) {
        todos[index] = { id: parseInt(todoId), ...updatedTodo };

        const writeStream = fs.createWriteStream(todoFilePath);
        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            callback(null, chunk);
          }
        });

        transformStream.write(JSON.stringify(todos));
        transformStream.pipe(writeStream);

        writeStream.on('error', error => {
          reject(error);
        });

        writeStream.on('finish', () => {
          resolve(todos[index]);
        });
      } else {
        reject(new Error('Todo not found'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

function deleteTodo(userId, todoId) {
  return new Promise(async (resolve, reject) => {
    try {
      const todoFilePath = getUserTodoFilePath(userId);
      if (!fs.existsSync(todoFilePath)) {
        resolve();
      } else {
        let todos = await getAllTodos(userId);

        const updatedTodos = todos.filter(todo => todo.id !== parseInt(todoId));

        const writeStream = fs.createWriteStream(todoFilePath);
        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            callback(null, chunk);
          }
        });

        transformStream.write(JSON.stringify(updatedTodos));
        transformStream.pipe(writeStream);

        writeStream.on('error', error => {
          reject(error);
        });

        writeStream.on('finish', () => {
          resolve();
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
};