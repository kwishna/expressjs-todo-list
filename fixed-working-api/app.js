const express = require('express');
// const bodyParser = require('body-parser');
const morgan = require('morgan')
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

const todoController = require('./controller/todoController');
const landingController = require('./controller/landingController');
const authController = require('./controller/authController');

// Set up Global configuration access
dotenv.config({path: path.resolve('./.env')});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())

// CORS Middleware
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
app.use('/', landingController);
app.use('/auth', authController);

// todoController.use(authenticateToken);
app.use('/todos', todoController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
