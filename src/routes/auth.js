const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

  try {
    // Validate the request body
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating a new instance of the User model with the current user data
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    
    // saving the user instance to the database 
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    // handling any errors that occur during the save operation
    // 400 - Bad Request
    // 500 - Internal Server Error
    // 401 - Unauthorized
    // 403 - Forbidden
    // 404 - Not Found
    res.status(400).send("Error adding user: " + error.message);
  }
});

authRouter.post('/login', async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Credentials!");
      }
  
      // Find the user by emailId
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("Invalid Credentials");
      }
  
      const isValidPassword = await user.validatePassword(password);
      // Validate the password using the method defined in the user schema
  
      if (isValidPassword) {
        //create a JWT token
  
        const token = await user.getJWT();
        // Generate a JWT token using the method defined in the user schema
  
        // Set the token in the cookie
        res.cookie("token", token, {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expiration time (1 day)
          //httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          //secure: true, // Set to true if using HTTPS
          //sameSite: "Strict", // Prevents CSRF attacks
          //maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
        });
        // this is how you set a cookie in the response
  
        //Add the token to a cookie & send the response
        res.send("Login successful");
      } else {
        throw new Error("Invalid Credentials");
      }
       
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  });

  module.exports = authRouter;