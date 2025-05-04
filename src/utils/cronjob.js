const cron = require('node-cron');
const {subDays, startOfDay, endOfDay} = require('date-fns');


cron.schedule('* * * * * *', async () => {
    // Add your task logic here
    // For example, you can call a function or perform some database operations
    // await someFunction();
});

//Cron syntax 
//Cron syntax (node-cron specific)
// ┌───────────── second (0 - 59)
// │ ┌───────────── minute (0 - 59)
// │ │ ┌───────────── hour (0 - 23)
// │ │ │ ┌───────────── day of month (1 - 31)
// │ │ │ │ ┌───────────── month (1 - 12) (or names, see below)
// │ │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday, 7 is also Sunday on some systems)
// │ │ │ │ │ │
// * * * * * *

// Explanation of Each Field
// second: (0–59)

// Specifies the exact second(s) when the task should run.
// Example: 0 means the task will run at the start of every minute.
// minute: (0–59)

// Specifies the exact minute(s) when the task should run.
// Example: */5 means the task will run every 5 minutes.
// hour: (0–23)

// Specifies the exact hour(s) when the task should run.
// Example: 0 means the task will run at midnight.
// day of month: (1–31)

// Specifies the exact day(s) of the month when the task should run.
// Example: 1 means the task will run on the 1st of the month.
// month: (1–12 or names)

// Specifies the exact month(s) when the task should run.
// Example: 1 means January, 12 means December.
// You can also use names like jan, feb, etc.
// day of week: (0–6)

// Specifies the exact day(s) of the week when the task should run.
// Example: 0 or 7 means Sunday, 1 means Monday.
// You can also use names like sun, mon, etc.


// * * * * * * is a cron expression that means "every second".
// You can adjust the cron expression to schedule the task at different intervals.
// For example:
// - '*/5 * * * *' means "every 5 minutes"
// - '0 0 * * *' means "every day at midnight"
// - '0 0 * * 0' means "every Sunday at midnight"
// - '0 0 1 * *' means "every month on the first day at midnight"
// - '0 0 * * 1' means "every Monday at midnight"
// - '0 0 * * 1-5' means "every weekday at midnight"

//Refer to cronitab.guru for more examples and explanations of cron syntax.


cron.schedule('0 8 * * *', async () => {
    //send emails to all people who got connection requests the previous day
    try {
        const yesterday = subDays(new Date(), 1);// Get the date for yesterday by subtracting 1 day from the current date

        const yesterdayStart = startOfDay(yesterday); // Get the start of yesterday
        const yesterdayEnd = endOfDay(yesterday); // Get the end of yesterday

        // Find all connection requests sent yesterday
        const pendingConnectionRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            },
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingConnectionRequests.map(request => request.toUserId.email))];

        // Send emails to all users who received connection requests yesterday
        for (const email of listOfEmails) {
            try {//make this dynamic for real time production ready
                const res = await sendEmail.run(
                    "New Connection Request for" + email, 
                    "You have received a new connection request. Please check your profile for more details.");
            } catch (error) {
                console.error(`Error sending email to ${email}:`, error);
            }
        }


    } catch (error) {
        console.error('Error sending emails:', error);
    }
});

//when there are thousands of emails, use a queue to send emails in batches
// or send in bulk which you can do with SES
// or use a third party service like sendgrid or mailgun or bee-queue, bullmq, etc.
// because running running a for loop for thousand iterations will take a lot of time
// and will block the event loop and is bad practice
