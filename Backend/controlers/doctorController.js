const User = require('../models/User');
const Appointment = require('../models/Appointment');

// GET /api/doctor/appointments — fetch all appointments for the logged-in doctor
async function getDoctorAppointments(req, res) {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'fullName email phone age gender city')
      .sort({ createdAt: -1 });

    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/doctor/appointment/:id/approve — approve an appointment
async function approveAppointment(req, res) {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, doctor: req.user.id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.status !== 'pending') {
      return res.status(400).json({ message: `Cannot approve an appointment that is already ${appointment.status}` });
    }

    appointment.status = 'approved';
    appointment.doctorRemarks = req.body.remarks || '';
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'fullName email phone age gender city');

    res.json({ message: 'Appointment approved', appointment: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/doctor/appointment/:id/cancel — cancel/reject an appointment
async function cancelAppointmentByDoctor(req, res) {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, doctor: req.user.id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    appointment.doctorRemarks = req.body.remarks || '';
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'fullName email phone age gender city');

    res.json({ message: 'Appointment cancelled', appointment: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

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
    const { fullName, gender, phone, specialty, qualifications, yearsOfExperience, availability, chargesPerSession, city } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, gender, phone, specialty, qualifications, yearsOfExperience, availability, chargesPerSession, city },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllDoctors, getDoctorProfile, updateDoctorProfile, getDoctorAppointments, approveAppointment, cancelAppointmentByDoctor };
