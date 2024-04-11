# Todo API

This is a simple RESTful API for managing todo lists. It allows users to create, read, update, and delete todo items.

## Getting Started

To get started with the Todo API, follow these instructions:

### Prerequisites

- Node.js installed on your machine
- SQLite database management system

### Installation

1. Clone the repository:


2. Navigate to the project directory:


3. Install dependencies:


4. Create a `.env` file in the project root and configure the environment variables:


5. Run the server:


## Usage

### Authentication

To use the API, you need to obtain an access token by authenticating with your username and password. Send a POST request to `/login` with your credentials in the request body. The API will respond with an access token, which you can use to authenticate subsequent requests by including it in the `Authorization` header as a Bearer token.

### Endpoints

- `POST /signup`: Register a new user.
- `POST /login`: Authenticate and obtain an access token.
- `GET /todos`: Retrieve all todo items for the authenticated user.
- `POST /todos`: Create a new todo item.
- `PUT /todos/:id`: Update an existing todo item.
- `DELETE /todos/:id`: Delete a todo item.

### Example Usage

<pre>
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
</pre>