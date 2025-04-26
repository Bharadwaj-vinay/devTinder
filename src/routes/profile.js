const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

//you can pass multiple middlewares to a route in sequence
profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    // user is attached to the request object in the userAuth middleware

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;