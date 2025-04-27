
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

// Get all the pending connection requests for the logged in user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
        .populate("fromUserId", ["firstName", "lastName"]);
        // The populate() method is used to replace the specified path in the document with documents from other collections.
        // The second argument specifies which fields to include in the populated documents.
        // Second argument can be space separated string of fields or an array of strings.
        //.populate("fromUserId", "firstName lastName emailId") or .populate("fromUserId", ["firstName", "lastName", "emailId"])

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        });
    } catch (error) {
        res.status(400).send('ERROR: ' + error.message);
    }
});


module.exports = userRouter;