const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');

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

// GET /api/doctor/completed-patients — patients whose consultation/appointment is completed
async function getCompletedPatients(req, res) {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
      status: 'completed',
    })
      .populate('patient', 'fullName email phone age gender city')
      .sort({ updatedAt: -1 });

    // Deduplicate patients (a patient may have multiple completed appointments)
    const seen = new Set();
    const patients = [];
    for (const appt of appointments) {
      if (appt.patient && !seen.has(appt.patient._id.toString())) {
        seen.add(appt.patient._id.toString());
        patients.push({
          _id: appt.patient._id,
          fullName: appt.patient.fullName,
          email: appt.patient.email,
          phone: appt.patient.phone,
          age: appt.patient.age,
          gender: appt.patient.gender,
          city: appt.patient.city,
          lastAppointmentId: appt._id,
          lastAppointmentDate: appt.date,
        });
      }
    }

    res.json({ patients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/doctor/prescription — create a new prescription
async function createPrescription(req, res) {
  try {
    const { patient, appointment, consultation, medications, instructions, diagnosis } = req.body;

    if (!patient || !medications || medications.length === 0) {
      return res.status(400).json({ message: 'Patient and at least one medication are required' });
    }

    // Verify this patient had a completed appointment with this doctor
    const completedAppt = await Appointment.findOne({
      doctor: req.user.id,
      patient,
      status: 'completed',
    });
    if (!completedAppt) {
      return res.status(400).json({ message: 'No completed consultation found for this patient' });
    }

    const prescription = await Prescription.create({
      doctor: req.user.id,
      patient,
      appointment: appointment || completedAppt._id,
      consultation: consultation || undefined,
      medications,
      instructions: instructions || '',
      diagnosis: diagnosis || '',
      status: 'sent',
    });

    const populated = await Prescription.findById(prescription._id)
      .populate('doctor', 'fullName specialty qualifications')
      .populate('patient', 'fullName email phone age gender');

    res.status(201).json({ message: 'Prescription created successfully', prescription: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/doctor/prescriptions — get all prescriptions created by the doctor
async function getDoctorPrescriptions(req, res) {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user.id })
      .populate('doctor', 'fullName specialty')
      .populate('patient', 'fullName email phone age gender')
      .sort({ createdAt: -1 });

    res.json({ prescriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/doctor/prescription/:id — get single prescription
async function getPrescriptionById(req, res) {
  try {
    const prescription = await Prescription.findOne({ _id: req.params.id, doctor: req.user.id })
      .populate('doctor', 'fullName specialty qualifications')
      .populate('patient', 'fullName email phone age gender city');

    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json({ prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAllDoctors, getDoctorProfile, updateDoctorProfile,
  getDoctorAppointments, approveAppointment, cancelAppointmentByDoctor,
  getCompletedPatients, createPrescription, getDoctorPrescriptions, getPrescriptionById,
};
