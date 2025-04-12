const express = require('express');

const app = express();
//creates an instance of express, our router

const { adminAuth, userAuth }  = require("./middlewares/auth")

// this method will match only the HTTP GET API calls to /user
// app.get("/user/:userId", (req, res) => {
//     console.log(req.params);
//     // this will print the userId passed in the URL
//     // for example, if the URL is /user/123, then req.params will be { userId: '123' }
//     console.log(req.query);
//     // this will print the query parameters passed in the URL
//     // for example, if the URL is /user/123?name=John&age=25,
//     //  then req.query will be { name: 'John', age: '25' }
//     res.send({
//         name: "Bharadwaj",
//         age: 29,
//     });
// });


// // ab?c means b is optional, so it will match both /abc and /ac
// app.get("/abc", (req, res) => {
//     res.send({
//         name: "Vinay",
//         age: 25,
//     });
// });

// app.post("/user", (req, res) => {
//     console.log("User Created");
//     res.send("Data saved successfully");
// });

// app.delete("/user", (req, res) => {
//     res.send("Data deleted successfully");
// });

// // this method will match all the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//     res.send('Hello FROM THE Server!');
// });

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
    res.send("User logged in");
});
//placed sepecific route before so that it will be executed first
// so that auth middleware will not be executed for this route

app.get("/user", userAuth, (req, res) => {
    res.send("User data sent");
});

app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("User deleted");
});

app.get("/getUserData", (req, res) => {
    throw new Error("Error!!!!!");
    // this will be caught by the error middleware
    //if we dont use try catch, the error will be caught by the default error middleware
    res.send("User data sent");
});

app.use("/", (err, req, res, next)=> {
    if (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});