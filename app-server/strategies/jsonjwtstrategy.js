const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose');
// const User = mongoose.model("myUser");
const User = require('../models/User');
const auth = require('../handlers/auth');

/**
* Configures a JSON Web Token (JWT) authentication strategy for Passport.js.
* This strategy is used to authenticate users by verifying a JWT token sent in the request headers.
*
* @param {Object} passport - The Passport.js instance to configure the strategy on.
* @returns {void}
*/
module.exports = passport => {
    passport.use(new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, async (username, done) => {
            try {

                if (!auth.isExistingUser(username)) {
                    return done(null, false, { message: 'User not found!' });
                }

                const user = await auth.getUserForDB(username);
                const { dbUserPassword } = user;

                if (!(await auth.isValidPassword(password, dbUserPassword))) {
                    return done(null, false, { message: 'Incorrect username or password' });
                }
                return done(null, user);

            } catch (err) {
                console.log(err);
                return done(err);
            }
        }));
}

// /**
// * Serializes a user object into an identifier (in this case, the user's ID) that can be stored in the session.
// * This function is called by Passport.js when a user is authenticated.
// *
// * @param {Object} user - The user object to be serialized.
// * @param {function} done - The callback function to be called with the serialized user identifier.
// */
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// /**
// * Deserializes a user identifier (in this case, the user's ID) from the session and retrieves the corresponding user object.
// * This function is called by Passport.js when a user is authenticated and their session is restored.
// *
// * @param {string} id - The user identifier (in this case, the user's ID) to be deserialized.
// * @param {function} done - The callback function to be called with the deserialized user object.
// */
// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findOne({ where: { id } });
//         done(null, user);
//     } catch (err) {
//         done(err);
//     }
// });