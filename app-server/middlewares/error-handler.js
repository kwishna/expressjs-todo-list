/**
* Middleware function to handle errors that occur during the request-response cycle.
*
* This middleware function is responsible for logging the error message and sending a generic 500 Internal Server Error response to the client.
*
* @param {Error} err - The error object that was thrown.
* @param {Request} req - The Express request object.
* @param {Response} res - The Express response object.
* @param {NextFunction} next - The Express next middleware function.
*/
const errorHandler = (err, req, res, next) => {
    console.error(err?.message);
    res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;