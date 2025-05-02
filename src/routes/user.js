
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_FIELDS = [
    "firstName",
    "lastName",
    "emailId",
    "about",
    "age",
];

// Get all the pending connection requests for the logged in user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
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

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", USER_SAFE_FIELDS)
        .populate("toUserId", USER_SAFE_FIELDS);

        const data = connections.map((connection) => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId
            } 
            
            return connection.fromUserId;
        });

        res.json({
            data,
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        //User feed is a collection of all the users except
        // his own and the users he has already connected with
        // ignored connections
        const loggedInUser = req.user;

        const page = parseInt(req.query?.page) || 1;
        let limit = parseInt(req.query?.limit) || 10;
        limit = Math.min(limit, 50); // Limit the maximum number of users to 50

        const skipValue = (page - 1) * limit;

        const connections = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
        })
        .select("fromUserId toUserId");
        // The select() method is used to specify which fields to include or exclude from the result set.

        const hideUsersFromFeed = new Set();
        connections.forEach(connection => {
            hideUsersFromFeed.add(connection.toUserId.toString());
            hideUsersFromFeed.add(connection.fromUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: {$ne: loggedInUser._id}},
                {_id: {$nin: Array.from(hideUsersFromFeed)}}
            ]
        })
        .select(USER_SAFE_FIELDS)
        .skip(skipValue)
        .limit(limit);
        // The skip() method is used to skip the first n documents in the result set.
        // The limit() method is used to limit the number of documents returned in the result set.  ;
        // The $ne operator is used to specify that the value of the field should not be equal to the specified value.
        // The $nin operator is used to specify that the value of the field should not be in the specified array.

        res.json({
            data: users
        });
    } catch (error) {
        res.status(400).json({
            message: "ERROR: " + error.message,
        });
    }
});

module.exports = userRouter;