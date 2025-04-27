const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4, // Minimum length of 4 characters
        maxLength: 50, // Maximum length of 50 characters
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Convert to lowercase
        trim: true, // Remove whitespace
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter a valid Email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
                throw new Error("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol");
            }
        }
    },
    age: {
        type: Number, 
        min: 18, // Minimum age of 18
    },
    gender: {
        type: String,
        lowercase: true, // Convert to lowercase
        enum: {
            values: ["male", "female", "other"],  // Allowed values
            message: "{VALUE} is not a valid gender type", // Error message if value is not in the allowed values
        },
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error("Gender data is invalid"); 
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png", // Default profile picture URL
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Enter a valid photo URL");
            }
        }
    },
    about: {
        type: String,
        default: "Hey there! I'm using DevTinder.",
    },
    skills: {
        type: [String], // Array of strings
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// User schema methods cannot be used in arrow functions
// Arrow functions do not have their own this binding, so they cannot be used as schema methods
// schema methods work based on the instance of the model so  we need 'this' binding

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DevTinderPractice", {
        expiresIn: '7d'
    });
    //{_id: user._id} - payload - data to be encoded in the token
    // "DevTinderPractice" - secret key - used to sign the token
    // Secret key - secret key is something only the server should know
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isValidPassword = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    
    return isValidPassword;
};

module.exports = mongoose.model("User", userSchema);