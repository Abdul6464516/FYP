const User = require('../models/User');

// GET /api/doctor/list — fetch all doctors (public, for patient search)
async function getAllDoctors(req, res) {
  try {
    const { specialty, availability, city, search } = req.query;

    const filter = { role: 'doctor' };

    if (specialty && specialty !== 'All') {
      filter.specialty = { $regex: specialty, $options: 'i' };
    }

    if (availability && availability !== 'All') {
      filter.availability = { $regex: availability, $options: 'i' };
    }

    if (city && city !== 'All') {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await User.find(filter).select(
      'fullName specialty gender qualifications yearsOfExperience availability chargesPerSession city'
    );

    res.json({ doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/doctor/profile — fetch logged-in doctor's own profile
async function getDoctorProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/doctor/profile — update logged-in doctor's profile
async function updateDoctorProfile(req, res) {
  try {
    const { fullName, gender, specialty, qualifications, yearsOfExperience, availability, chargesPerSession, city } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, gender, specialty, qualifications, yearsOfExperience, availability, chargesPerSession, city },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllDoctors, getDoctorProfile, updateDoctorProfile };
