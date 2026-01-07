const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/dbconfig");
const Patient = require("./models/Patient");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 5000 ;
const app = express();
app.use(cors());
connectDb();
app.get("/test",async (req,res)=>{
    console.log(" hey ther i am testing")
console.log("Hey there we are welcoming ab by ghwarth level ")
const newPateint = new Patient({
     name: "Abdul Javid",
  gender: "male",
  age: 24,
  email: "abdul@example.com",
  phone: "1234567890",
});
await newPateint.save();
res.json({message:" Hey welcome to the telemedicine ",body:[3,4,2]})
} )
app.listen(PORT,()=>{
    console.log(`The server is running on the port ${PORT}`)
})