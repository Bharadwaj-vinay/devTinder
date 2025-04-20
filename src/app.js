const express = require('express');
const connectToDB = require('./config/database');

const app = express();
const User = require("./models/user");

app.use(express.json());
// Middleware to parse JSON data from the request body

app.post("/signup", async (req, res) => {

  // creating a new instance of the User model with the current user data
  const user = new User(req.body);

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

app.get('/user', async (req, res) => {
  try {
    const user = await User.findOne({emailId: req.body.emailId});
    res.send(user);
    //const users = await User.find({emailId: req.body.emailId});

    // if  (!users.length) {
    //   return res.status(404).send("User not found");
    // } else {
    //   // If user is found, send the user data as a response
    //   res.send(users);
    // }
  } catch (error) {
    res.status(400).send("Error fetching user: " + error.message);
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    // {} as no filter to fetch all users
      res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete('/user', async (req,res) => {
  const userId = req.body.userId; 
  try {
    const user = await User.findByIdAndDelete(userId); 
    // If user is not found, send a 404 response
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      // If user is found, send the user data as a response
      res.send("User deleted successfully");
    }
  } catch  (error) {
    res.status(400).send("Error deleting user");
  }
});

app.patch('/user', async (req, res) => {
  const data = req.body;
  const userId = req.body.userId;

  try {
    await User.findByIdAndUpdate(userId, data);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
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

