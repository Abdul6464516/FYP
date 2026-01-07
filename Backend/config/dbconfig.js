const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log("db connected successfully!")
    } catch (err) {
        console.log("Error during mongodb connection", err);
    }
}

module.exports = connectDb;
