const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
   try {
    //read the token from thr request cookie
   const token = req.cookies?.token;

    if (!token) {
        throw new Error("Token not found!!");
    }

   const decodedMessage = await jwt.verify(token, "DevTinderPractice");
   // to verify, you pass the same secret key that you signed the token with
    // decodedMessage - data that was encoded in the token

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if(!user) {
        throw new Error("User not found");
    }

    req.user = user;
    // attach the user to the request object this way, you can access the user
    //  in the next middleware or route handler
    
    next();
    // if the user is found, call the next to move to the next middleware
   } catch (error) {
    res.status(400).send("ERROR: " + error.message);
   }
};

module.exports = {
    userAuth,
};