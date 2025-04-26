

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


