const express = require('express');
const connectToDB = require('./config/database');

const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {

  // creating a new instance of the User model with the current user data
  const user = new User({
    firstName: "Ajay",
    lastName: "Kumar",
    emailId: "ajay@kumar.com",
    password: "ajay@123",
  });
  try {
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

connectToDB().then(() => {
    console.log('Database Connection Established');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
      });
    })
    .catch((err) => {
    console.error('Error connecting to database', err);
});

