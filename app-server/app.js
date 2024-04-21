const express = require('express');
// const bodyParser = require('body-parser');
const morgan = require('morgan')
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

const todoController = require('./controller/todoController');
const landingController = require('./controller/landingController');
const authController = require('./controller/authController');

const errorHandler = require('./middlewares/error-handler');

// Set up Global configuration access
dotenv.config({ path: path.resolve('./.env') });

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
/**
* Middleware to set CORS headers on all requests.
* Allows any origin to access the API and sets the Content-Type header.
*/
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// //passport middleware
// // Session middleware
// /**
// * Configures the session middleware for the Express application.
// * 
// * This middleware sets up session management for the application, using the
// * provided secret key to encrypt the session data. The `resave` option is set
// * to `false`, which means the session will not be saved back to the session
// * store on every request. The `saveUninitialized` option is set to `true`,
// * which means uninitialized sessions will be saved.
// */
// app.use(session({
// secret: 'your-secret-key',
// resave: false,
// saveUninitialized: true
// }));

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use('/', landingController);
app.use('/auth', authController);
app.use('/todos', todoController);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Middleware to authenticate requests
/**
* Middleware function to authenticate requests using a JWT token.
*
* This middleware function checks the 'Authorization' header of the incoming
* request for a valid JWT token. If the token is present and valid, it
* attaches the decoded user information to the `req.user` object, allowing
* subsequent middleware functions to access the authenticated user data.
*
* If the token is missing or invalid, the middleware will return a 401
* Unauthorized or 403 Forbidden response, respectively.
*
* @param {Object} req - The Express request object.
* @param {Object} res - The Express response object.
* @param {Function} next - The next middleware function in the stack.
*/
function authenticateLoginToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
