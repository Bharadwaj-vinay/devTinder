const adminAuth = (req, res, next) => {
    // this will execute for all the requests
    // we can use this to log the request, authenticate the user, etc.
    console.log("Authorization is being checked");
    const token = "abc";
    const isAuthorized = token === "xabc";
    if (!isAuthorized) {
        res.status(401).send("Unauthorized");
    } else {
        console.log("Authorization is successful");
        next();
    }
};

const userAuth = (req, res, next) => {
    // this will execute for all the requests
    // we can use this to log the request, authenticate the user, etc.
    console.log("User Authorization is being checked");
    const token = "abc";
    const isAuthorized = token === "abc";
    if (!isAuthorized) {
        res.status(401).send("Unauthorized");
    } else {
        console.log("Authorization is successful");
        next();
    }
};

module.exports = {
    adminAuth,
    userAuth,
};