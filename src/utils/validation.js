const validator = require("validator");

const validateSignUpData = req => {
    const {firstName, lastName, emailId, password} = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
        throw new Error("Please enter a strong password!");
    } else if (req.body.skills?.length > 10) {
        throw new Error("Skills cannot be more than 10");
      }
};

const validateEditProfileData = req => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "skills", "about",
         "photoUrl", "gender", "age"];

    const isEditAllowed = Object.keys(req.body).every(key => allowedEditFields.includes(key));

    return isEditAllowed;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
};