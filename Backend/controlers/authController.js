const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function register(req, res) {
  try {
    const { fullName, email, username, password, role,
      // Patient fields
      age, gender, phone, medicalHistory,
      // Doctor fields
      specialty, qualifications, yearsOfExperience, availability
    } = req.body;
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ message: 'Email or username already in use' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userData = { fullName, email, username, password: hash, role };

    if (role === 'patient') {
      userData.age = age;
      userData.gender = gender;
      userData.phone = phone;
      userData.medicalHistory = medicalHistory;
    }

    if (role === 'doctor') {
      userData.specialty = specialty;
      userData.qualifications = qualifications;
      userData.yearsOfExperience = yearsOfExperience;
      userData.availability = availability;
    }

    const user = new User(userData);
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    if (!identifier || !password) return res.status(400).json({ message: 'Missing credentials' });
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function me(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login, me };
