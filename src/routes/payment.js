const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay.js");
const Payment = require("../models/payment");
const User = require("../models/user");
const {mebershipAmount} = require("../utils/constants");
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");

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


// make sure the name of the webhook you have defined in your razorpay
// is what you are using here as well eg., "/your_api_route/your_webhook_name"
// ***VImp***: webhook API must not have user auth since its the razorpay endpoint that is
// gonna call the webhook API & since it won't have login access, and we shouldn't restrict it anyway
paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        const webhookSignature = req.headers["X-Razorpay-Signature"];
        // req.get("X-Razorpay-Signature") would also work

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if(!isWebhookValid) {
            return res.status(400).json({message: "Webhook signature is invalid"});
        }

        //Update the payment status in DB
        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({orderId: paymentDetails.order_id});
        payment.status = paymentDetails.status;

        await payment.save();

        //marK user memebership status in DB

        const user = await User.findone({_id: payment.userId});
        user.isPremium = true;
        user.memebershipType = payment.notes.memebershipType;

        await user.save();

        //the events we get are based on what exists for webhook on razorpay
        // if (req.body.event === "payment.captured") {

        // }

        // if (req.body.event === "payment.failed") {

        // }

        //its imperative to send a success response, else the razorpay endpoint will keep
        // trying to call the webhook again & again till its gets a response, which might lead 
        // an infinite loop
        return res.status(200).json({message: "Webhook received successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
    const user = req.user.toJSON();
    //ITS IMPORTANT TO CONVERT TO JSON TO AVOID BUGS

    if (user.isPremium) {
        return res.json({isPremium: true});
    } else {
        return res.json({isPremium: false});
    }
});

module.exports = paymentRouter;