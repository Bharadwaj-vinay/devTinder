const Razorpay = require("razorpay");


const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

module.exports = instance;

//get them both razorpay dashboard once you are registered
//Accounts & Settings => API Keys => Generate Key Id
//key_id can be public, its like a username
//key_secret is like a password
//add both of thenm to your .env files