const express = require('express');

const app = express();
//creates an instance of express, our router

app.use("/", (req, res) => {
    res.send('Namaste from the Author!');
});

app.use("/test", (req, res) => {
    res.send('Namaste from the Test!');
});

app.use("/hello", (req, res) => {
    res.send('Hello Hello Hello!!!');
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});