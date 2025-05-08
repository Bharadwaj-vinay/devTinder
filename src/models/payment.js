const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true, // User ID is mandatory
        },
        orderId: {
            type: String,
            required: true, // Order ID is mandatory
            unique: true, // Ensure no duplicate orders
        },
        paymentId: {
            type: String,
        },
        status: {
            type: String,
            required: true, 
        },
        amount: {
            type: Number,
            required: true, // Payment amount is mandatory
            min: 0, // Ensure the amount is non-negative
        },
        currency: {
            type: String,
            required: true, // Currency is mandatory
            default: "USD", // Default currency is USD
            enum: ["USD", "EUR", "INR"], // Allowed currencies
        },
        receipt: {
            type: String,
            required: true
        },
        notes: {
            firstName: {
                type: String
            },
            lastName: {
                type: String
            },

        }
    }, 
    {timestamps: true}
);


module.exports = mongoose.model("Payment", paymentSchema);