const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",
    userAuth, 
    async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        // Check if the status is valid
        const allowedStatuses = ["ignore", "interested"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: " + status,
            });
        }

        //check if the user is trying to send a request to himself


        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res
                .status(404)
                .json({message: "User not found"});
        }

        // Check if the user is trying to send a request to an existing connection
        const existingRequest = await ConnnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId }, // from user to to user
                { fromUserId: toUserId, toUserId: fromUserId } // from to user to the fromz user
            ]
        });
        //TODO: Read about query operators in MongoDB

        if (existingRequest) {
            return res
            .status(400)
            .json({message: "Connection request already exists"});
        }

        //create a new connection request object
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        //save the connection request object to the database
        const data = await connectionRequest.save();

        //res.json() is used to send a JSON response with the given data 
        res.json({
            message: req.user.firstName + " " + status + " " + toUser.firstName,
            data
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

requestRouter.post("/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            const {status, requestId} = req.params;

            //check if the status is valid
            const allowedStatuses = ["accepted", "rejected"];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid status type: " + status,
                });
            }

            //check if the requestId is valid
            // request is only valid if the loggedInUser is the toUserId, 
            // and the status is "interested"
            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });

            if (!connectionRequest) {
                return res.status(404).json({
                    message: "Connection request not found or already reviewed",
                });
            }
            //update the status of the connection request
            connectionRequest.status = status;
            const data = await connectionRequest.save();
            //update the status of the connection request

            res.json({
                message: loggedInUser.firstName + " " + status + " the request",
                data
            });
        } catch (error) {
            res.status(400).send("ERROR: " + error.message);
        }
    }
);

module.exports = requestRouter;