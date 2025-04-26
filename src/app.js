const express = require("express");
const connectToDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");


app.use(express.json());
// Middleware to parse JSON data from the request body

app.use(cookieParser());
// Middleware to parse cookies from the request headers

const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const authRouter = require("./routes/auth");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);



connectToDB().then(() => {
    console.log('Database Connection Established');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
      });
    })
    .catch((err) => {
    console.error('Error connecting to database', err);
});

