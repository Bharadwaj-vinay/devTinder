
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "<h1>This is the email body</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the email body",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL_SUBJECT",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "recipient@example.com",
    "sender@example.com",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};


module.exports = { run };

 

//example usage:

const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const sendEmail = async ({ toAddress, fromAddress, subject, body }) => {
    const sendEmailCommand = new SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: body, // Dynamic email body
                },
                Text: {
                    Charset: "UTF-8",
                    Data: body, // Dynamic email body
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject, // Dynamic subject
            },
        },
        Source: fromAddress, // Dynamic sender
    });

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendEmail };

const { sendEmail } = require("../utils/sendEmail");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Validate the status
        const allowedStatuses = ["ignore", "interested"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }

        // Check if the recipient user exists
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        await connectionRequest.save();

        // Send an email notification to the recipient
        try {
            await sendEmail({
                toAddress: toUser.emailId, // Dynamic recipient
                fromAddress: "no-reply@devtinder.com", // Verified sender
                subject: "New Connection Request",
                body: `<p>You have received a new connection request from ${req.user.firstName}.</p>`,
            });
            console.log("Email sent successfully");
        } catch (emailError) {
            console.error("Failed to send email:", emailError.message);
        }

        res.status(201).json({
            message: "Connection request sent successfully",
            connectionRequest,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});