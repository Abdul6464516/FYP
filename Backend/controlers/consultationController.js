const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');

// Doctor starts a consultation for an approved appointment
async function startConsultation(req, res) {
  try {
    const { appointmentId } = req.body;
    const doctorId = req.user.id;

    const appointment = await Appointment.findById(appointmentId).populate('patient', 'fullName email');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (String(appointment.doctor) !== doctorId) return res.status(403).json({ message: 'Not your appointment' });
    if (appointment.status !== 'approved') return res.status(400).json({ message: 'Appointment must be approved first' });

    // Check if consultation already exists
    let consultation = await Consultation.findOne({ appointment: appointmentId, status: { $in: ['waiting', 'active'] } });
    if (consultation) {
      return res.json({ consultation, message: 'Consultation already in progress' });
    }

    consultation = await Consultation.create({
      appointment: appointmentId,
      patient: appointment.patient._id || appointment.patient,
      doctor: doctorId,
      status: 'waiting',
      startedAt: new Date(),
    });

    // Update appointment status
    appointment.status = 'completed';
    await appointment.save();

    const populated = await Consultation.findById(consultation._id)
      .populate('patient', 'fullName email')
      .populate('doctor', 'fullName email specialty')
      .populate('appointment', 'date time reason type');

    res.status(201).json({ consultation: populated });
  } catch (err) {
    console.error('startConsultation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get active/waiting consultations for current user (doctor or patient)
async function getMyConsultations(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const filter = role === 'doctor' ? { doctor: userId } : { patient: userId };
    filter.status = { $in: ['waiting', 'active'] };

    const consultations = await Consultation.find(filter)
      .populate('patient', 'fullName email')
      .populate('doctor', 'fullName email specialty')
      .populate('appointment', 'date time reason type')
      .sort({ createdAt: -1 });

    res.json({ consultations });
  } catch (err) {
    console.error('getMyConsultations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// End a consultation
async function endConsultation(req, res) {
  try {
    const { consultationId } = req.params;
    const userId = req.user.id;

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    // Only doctor or patient in this consultation can end it
    if (String(consultation.doctor) !== userId && String(consultation.patient) !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    consultation.status = 'completed';
    consultation.endedAt = new Date();
    if (consultation.startedAt) {
      consultation.duration = Math.round((consultation.endedAt - consultation.startedAt) / 1000);
    }
    await consultation.save();

    res.json({ consultation, message: 'Consultation ended' });
  } catch (err) {
    console.error('endConsultation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Save consultation notes (doctor only)
async function saveNotes(req, res) {
  try {
    const { consultationId } = req.params;
    const { notes, prescription } = req.body;
    const doctorId = req.user.id;

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
    if (String(consultation.doctor) !== doctorId) return res.status(403).json({ message: 'Not authorized' });

    if (notes !== undefined) consultation.notes = notes;
    if (prescription !== undefined) consultation.prescription = prescription;
    await consultation.save();

    res.json({ consultation, message: 'Notes saved' });
  } catch (err) {
    console.error('saveNotes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { startConsultation, getMyConsultations, endConsultation, saveNotes };
