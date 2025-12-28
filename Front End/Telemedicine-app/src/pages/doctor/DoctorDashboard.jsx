import React, { useState, useEffect } from "react";
import BackButton from "../Components/BackButton";
// Dummy Data
const dummyAppointments = [
  { id: 1, patientName: "John Doe", time: "2025-12-26 10:00", status: "pending" },
  { id: 2, patientName: "Jane Smith", time: "2025-12-26 11:00", status: "approved" },
];

const DoctorDashboard = () => {
  const [doctorProfile, setDoctorProfile] = useState({
    name: "Dr. Ahmed",
    specialty: "Cardiology",
    qualifications: "MBBS, MD",
    experience: 10,
    availability: "Mon-Fri 9am-5pm",
  });

  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch appointments from API
    setAppointments(dummyAppointments);

    // Fetch notifications (new appointment bookings)
    setNotifications([
      "New appointment booked by John Doe",
      "Appointment canceled by Jane Smith",
    ]);
  }, []);

  // Handle appointment status
  const handleAppointmentAction = (id, action) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: action } : a
      )
    );
    setNotifications((prev) => [...prev, `Appointment ${action} for ID ${id}`]);
  };

  // Placeholder for video consultation
  const startConsultation = (patientName) => {
    alert(`Starting video/audio consultation with ${patientName}`);
  };

  // Placeholder for prescription generation
  const generatePrescription = (patientName) => {
    const prescription = prompt(`Enter prescription for ${patientName}`);
    if (prescription) {
      alert(`Prescription for ${patientName}: ${prescription}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>

      {/* Doctor Profile */}
      <section className="mb-6 border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p><strong>Name:</strong> {doctorProfile.name}</p>
        <p><strong>Specialty:</strong> {doctorProfile.specialty}</p>
        <p><strong>Qualifications:</strong> {doctorProfile.qualifications}</p>
        <p><strong>Experience:</strong> {doctorProfile.experience} years</p>
        <p><strong>Availability:</strong> {doctorProfile.availability}</p>
      </section>

      {/* Appointments */}
      <section className="mb-6 border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Appointments</h2>
        {appointments.map((appt) => (
          <div key={appt.id} className="mb-2 p-2 border rounded flex justify-between items-center">
            <div>
              <p><strong>Patient:</strong> {appt.patientName}</p>
              <p><strong>Time:</strong> {appt.time}</p>
              <p><strong>Status:</strong> {appt.status}</p>
            </div>
            <div className="flex gap-2">
              {appt.status === "pending" && (
                <>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => handleAppointmentAction(appt.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleAppointmentAction(appt.id, "canceled")}
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => startConsultation(appt.patientName)}
              >
                Consult
              </button>
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => generatePrescription(appt.patientName)}
              >
                Prescription
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Notifications */}
      <section className="border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <ul>
          {notifications.map((note, index) => (
            <li key={index} className="mb-1">{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DoctorDashboard;