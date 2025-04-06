const express = require('express');

const app = express();
//creates an instance of express, our router

// this method will match only the HTTP GET API calls to /user
app.get("/user", (req, res) => {
    res.send({
        name: "Bhradwaj",
        age: 28,
    });
});

app.post("/user", (req, res) => {
    console.log("User Created");
    res.send("Data saved successfully");
});

app.delete("/user", (req, res) => {
    res.send("Data deleted successfully");
});

// this method will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send('Hello FROM THE Server!');
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});