const express = require('express');

const router = express.Router();

// Routes
router.get('/', (req, res) => {
    res.redirect('/welcome');
  });
  
  router.get('/welcome', (req, res) => {
    const api_info = `
      Welcome to the TODO application!
      Here are the available APIs:
  
      1. POST /auth/signup - Sign up for a new account.
         Example request body:
         {
           "username": "exampleUser",
           "password": "examplePassword"
         }
  
         Curl example:
         curl -X POST -H "Content-Type: application/json" -d '{"username":"exampleUser", "password":"examplePassword"}' http://localhost:3000/auth/signup
  
      2. POST /auth/login - Log in to obtain access token.
         Example request body:
         {
           "username": "exampleUser",
           "password": "examplePassword"
         }
  
         Curl example:
         curl -X POST -H "Content-Type: application/json" -d '{"username":"exampleUser", "password":"examplePassword"}' http://localhost:3000/auth/login
  
      3. GET /todos/list - Get all TODOs for the authenticated user.
  
         Curl example:
         curl -X GET -H "Authorization: Bearer <access_token>" http://localhost:3000/todos/list
  
      4. POST /todos/create - Create a new TODO.
         Example request body:
         {
           "task": "Example task",
           "completed": false
         }
  
         Curl example:
         curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <access_token>" -d '{"task":"Example task", "completed":false}' http://localhost:3000/todos/create
  
      5. PUT /todos/:id/update - Update a TODO by ID.
         Example request body:
         {
           "task": "Updated task",
           "completed": true
         }
  
         Curl example:
         curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <access_token>" -d '{"task":"Updated task", "completed":true}' http://localhost:3000/todos/1/update
  
      6. DELETE /todos/:id/delete - Delete a TODO by ID.
  
         Curl example:
         curl -X DELETE -H "Authorization: Bearer <access_token>" http://localhost:3000/todos/1/delete
    `;
    const instructions = `
    <html>
    <head>
      <title>Welcome to the TODO application!</title>
    </head>
    <body>
      <h1>Welcome to the TODO application!</h1>
      <p>Here are the available APIs:</p>
      <ol>
        <li>
          <b>POST /auth/signup</b> - Sign up for a new account.
          <br>
          Example request body:
          <pre>
            {
              "username": "exampleUser",
              "password": "examplePassword"
            }
          </pre>
          Curl example:
          <pre>
            ${api_info}
          </pre>
        </li>
        <!-- Add more list items for other APIs -->
      </ol>
    </body>
    </html>
  `;
  res.send(instructions);
  });

  
module.exports = router;