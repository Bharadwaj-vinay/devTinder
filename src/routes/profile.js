const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

//you can pass multiple middlewares to a route in sequence
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    // user is attached to the request object in the userAuth middleware

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    //validate the edit data
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
            //return res.status(400).send("Invalid edit request"); either approach is valid
        }

        const loggedInUser = req.user; 
        // loggedInUser is attached to the request object in the userAuth middleware

        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        //update the user object with the new data

        //save the updated user object to the database
        await loggedInUser.save();
        //res.send(`${loggedInUser.firstName}, your profile was updated successfully`);

        res.json({
            message: `${loggedInUser.firstName}, your profile was updated successfully`,
            user: loggedInUser
        });
        //send a success message and the updated user object as a response which is the standard way to send a response

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = profileRouter;