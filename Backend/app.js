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
app.use(express.json());
// mount auth routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
connectDb();

app.listen(PORT, () => {
  console.log(`The server is running on the port ${PORT}`);
});