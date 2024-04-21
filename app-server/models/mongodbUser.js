const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

/**
* Defines the schema for a User document in the MongoDB database.
* 
* The schema includes the following fields:
* - `name`: A required string field representing the user's name.
* - `email`: A required, unique, and lowercase string field representing the user's email address. It is validated to ensure it is a valid email format.
* - `photo`: An optional string field representing the user's profile photo.
* - `password`: A required string field representing the user's password. It is hashed using bcrypt and the `select` option is set to `false` to prevent it from being returned in queries.
* - `passwordConfirm`: A required string field that must match the `password` field. This is used for password confirmation during user registration.
*/
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name!"]
    },
    email: {
        type: String,
        required: [true, "Please Provide your Email!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords don't Match!"
        }
    }
});

const MongoUser = mongoose.model("myUser", userSchema);
module.exports = MongoUser;