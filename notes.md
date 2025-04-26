

app.get('/user', async (req, res) => {
  try {
    // const user = await User.findOne({emailId: req.body.emailId});
    // res.send(user);
    const users = await User.find({emailId: req.body.emailId});

    if  (!users.length) {
      return res.status(404).send("User not found");
    } else {
      // If user is found, send the user data as a response
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Error fetching user: " + error.message);
  }
});

Filters:

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    // {} as no filter to fetch all users
      res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});


app.delete('/user/:userId', async (req,res) => {
  const userId = req.params?.userId; 
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


API level validations:

app.patch('/user/:userId', async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;

  const ALLOWED_UPDATES = [
    'photoUrl', 'about', 'gender', 'age', 'skills', 'userId'
  ];

  try {
    const isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    // Check if the update is allowed / API level validation
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    await User.findByIdAndUpdate(userId, data, {
      returnDocument: 'after', // Return the updated document, if 'before' is used, it will return the document before the update
      runValidators: true, // Validate the update against the schema
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("UPDATE FAILED: " + error.message);
  }
});

Schema-level validations are run for:

save()
create()
Update methods (updateOne, updateMany, findByIdAndUpdate, etc.) if runValidators: true is set.
insertMany() if validateBeforeSave: true is set.


How express routing works: 

app.use():

The app.use() method is used to register middleware or routers in an Express application.
In this case, it is registering the routers (authRouter, profileRouter, and requestRouter) to handle requests.

Mounting Routers:

Each router (authRouter, profileRouter, requestRouter) is mounted at the root path ("/"). This means that any route defined in these routers will be accessible from the root path of the application.
For example:
If authRouter defines a route like /login, it will be accessible at http://localhost:7777/login.
If profileRouter defines a route like /profile, it will be accessible at http://localhost:7777/profile.

Order of Middleware Execution:

Express processes middleware and routers in the order they are registered. So, requests will first pass through authRouter, then profileRouter, and finally requestRouter.
If a route is matched in authRouter, Express will not proceed to the next router unless next() is explicitly called.

Router Logic:

Each router (authRouter, profileRouter, requestRouter) is likely defined in separate files (e.g., ./routes/auth.js, ./routes/profile.js, ./routes/request.js).
These files export a router object created using express.Router(). For example:

const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    // Handle login logic
});

module.exports = router;

Routing Flow:

When a request is made to the server (e.g., http://localhost:7777/login), Express will:
Match the root path ("/") and pass the request to authRouter.
If no matching route is found in authRouter, it will proceed to profileRouter.
If still no match, it will proceed to requestRouter.

Separation of Concerns:

By using routers, the application logic is modularized. Each router handles a specific set of routes (e.g., authentication, profile management, requests), making the codebase easier to maintain and scale.
Example Flow:
A POST request to /login:
The request is passed to authRouter.
If authRouter has a /login route, it handles the request and sends a response.
If not, the request moves to profileRouter, and so on.
This modular approach ensures clean and organized routing in the application.