const jwt = require('jsonwebtoken');

/**
* Middleware function to authenticate a request using a JWT token.
*
* This middleware function is responsible for verifying the JWT token provided in the
* 'Authorization' header of the request. If the token is valid, the middleware will
* attach the decoded user information to the request object, allowing subsequent
* middleware functions to access the user data.
*
* If the token is missing or invalid, the middleware will return a 401 Unauthorized
* or 403 Forbidden response, respectively.
*
* @param {Object} req - The Express request object.
* @param {Object} res - The Express response object.
* @param {Function} next - The next middleware function in the stack.
* @returns {void}
*/
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;