import api from './apiClient';

// Doctor starts a consultation from an approved appointment
export async function startConsultation(appointmentId) {
  try {
    const res = await api.post('/consultation/start', { appointmentId });
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Failed to start consultation';
    throw new Error(msg);
  }
}

// Get active/waiting consultations for current user
export async function getActiveConsultations() {
  try {
    const res = await api.get('/consultation/active');
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Failed to fetch consultations';
    throw new Error(msg);
  }
}

// End a consultation
export async function endConsultation(consultationId) {
  try {
    const res = await api.put(`/consultation/${consultationId}/end`);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Failed to end consultation';
    throw new Error(msg);
  }
}

// Save consultation notes (doctor only)
export async function saveConsultationNotes(consultationId, notes, prescription) {
  try {
    const res = await api.put(`/consultation/${consultationId}/notes`, { notes, prescription });
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Failed to save notes';
    throw new Error(msg);
  }
}
