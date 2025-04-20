const mongoose = require('mongoose');
const validator = require('validator');

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

module.exports = mongoose.model("User", userSchema);