const express = require("express");
const connectToDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

require("./utils/cronjob"); // Import the cron job file to start the cron job

app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
// Middleware to enable CORS for all origins
// This allows the server to accept requests from different origins
// You can configure it further to restrict to specific origins if needed
app.use(express.json());
// Middleware to parse JSON data from the request body

app.use(cookieParser());
// Middleware to parse cookies from the request headers

const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);



connectToDB().then(() => {
    console.log('Database Connection Established');
    app.listen(process.env.PORT, () => {
        console.log('Server is running');
      });
    })
    .catch((err) => {
    console.error('Error connecting to database', err);
});

