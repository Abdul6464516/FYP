const User = require('../models/User');
const Feedback = require('../models/Feedback');

// GET /api/patient/profile — fetch logged-in patient's profile
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/patient/profile — update logged-in patient's profile
async function updateProfile(req, res) {
  try {
    const { fullName, age, gender, phone, medicalHistory } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, age, gender, phone, medicalHistory },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/patient/feedback — submit a feedback/review for a doctor
async function submitFeedback(req, res) {
  try {
    const { rating, message, reviewOn } = req.body;

    if (!rating || !reviewOn) {
      return res.status(400).json({ message: 'Rating and doctor are required' });
    }

    // Verify the doctor exists
    const doctor = await User.findOne({ _id: reviewOn, role: 'doctor' });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const feedback = new Feedback({
      rating,
      totalRating: 5,
      message: message || '',
      reviewBy: req.user.id,
      reviewOn,
    });

    await feedback.save();

    // Populate the saved feedback before returning
    const populated = await Feedback.findById(feedback._id)
      .populate('reviewBy', 'fullName')
      .populate('reviewOn', 'fullName specialty');

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/patient/feedback — get all feedback submitted by the logged-in patient
async function getMyFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.find({ reviewBy: req.user.id })
      .populate('reviewOn', 'fullName specialty')
      .sort({ createdAt: -1 });

    res.json({ feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProfile, updateProfile, submitFeedback, getMyFeedbacks };
