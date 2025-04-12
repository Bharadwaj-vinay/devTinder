const mongoose = require('mongoose');

const connectToDB = async () => {
    await mongoose.connect(
        "mongodb+srv://bharadwaj:6xDSrd2VPWoXZhB9@cluster0.1abterw.mongodb.net/devTinder"
    );
};

module.exports = connectToDB;