const { SESClient } = require("@aws-sdk/client-ses");

// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesClient = new SESClient({ region: REGION, credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY, // AWS access key ID FROM .env file
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // AWS secret access key FROM .env file
    },
 }); //this is for js v3, for v2 use SES({region: REGION, accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY})

module.exports = { sesClient };