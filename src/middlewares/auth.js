const User = require("../models/user");
const jwt = require("jsonwebtoken"); 


const userAuth = async (req, res, next) => {
   try {
    //read the token from the request cookie
   const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send("Please login to access this resource");
    }

   const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    // verify the token using the secret key
    // if the token is valid, it will return the decoded message
    // if the token is invalid, it will throw an error
    // decodedMessage - data that was encoded in the token
    // process.env.JWT_SECRET - secret key used to sign the token
    // you can use any string as a secret key, but it's recommended to use a long and random string
    // to make it harder to guess

    // decodedMessage - data that was encoded in the token
   // to verify, you pass the same secret key that you signed the token with
    // decodedMessage - data that was encoded in the token

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if(!user) {
        throw new Error("User not found");
    }

    req.user = user;
    // attach the user to the request object this way, you can access the user
    // in the next middleware or route handler
    
    next();
    // if the user is found, call the next to move to the next middleware
   } catch (error) {
    res.status(400).send("ERROR1: " + error.message);
   }
};

module.exports = {
    userAuth,
};