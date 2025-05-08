const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = rqeuire("../utils/razorpay.js");
const payment = require("../models/payment");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {
        const {membershipType} = req.body;
        const {firstName, lastName, emailId} = req.user;

        razorpayInstance.orders.create({
            "amount": mebershipAmount[membershipType] * 100, // in paisa
            "currency": "INR",
            "receipt": "receipt1",
            "notes": {//like a metadata that you can attach with the order
                "firstName": firstName                                                                                                    ,
                "lastName": lastName,
                "emailId": emailId,
                "membershipType": membershipType, 
            },
        });

        //Save it in my database
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        });
        const savedPayment = await payment.save();

        //Return back my order details to FrontEnd
        res.json({...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
});
module.exports = paymentRouter;