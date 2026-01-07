// Shared auth utilities
export function clearSession() {
  try {
    // Remove common auth/session keys
    const keys = [
      'token',
      'userName',
      'userEmail',
      'userRole',
      'isLoggedIn',
      // patient-specific
      'patient_age',
      'patient_gender',
      'patient_phone',
      'patient_medicalHistory',
      // doctor-specific
      'doctor_specialty',
      'doctor_qualifications',
      'doctor_yearsOfExperience',
      'doctor_availability',
    ];

    keys.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('clearSession error', err);
  }
}
