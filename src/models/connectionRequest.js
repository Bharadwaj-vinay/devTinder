const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["ignore", "interested", "accepted", "rejected"],
        message: "{VALUE} is incorrec status type",
    }
}, {timestamps: true});

//enum is used to define a set of possible values for a field

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    // Check if the user is trying to send a request to himself
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send a connection request to yourself");
    }
    // equals() method is used to compare two ObjectId values

    next();
}
);
// The pre-save hook is a middleware function that runs before saving a document to the database.

connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
); // TODO: Read about indexing in MongoDB
// This creates a compound index on the fromUserId and toUserId fields, which can improve query performance when searching for connection requests between two users.
// The index is created in ascending order for (1).
// The index is created in descending order for (-1).


const ConnnectionRequest = model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnnectionRequest;