const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        console.log("ENV MONGOURI:", process.env.MONGOURI);
        await mongoose.connect(process.env.MONGOURI);
        console.log("db connected successfully!")
    } catch (err) {
        console.log("Error during mongodb connection", err);
    }
}

module.exports = connectDb;
