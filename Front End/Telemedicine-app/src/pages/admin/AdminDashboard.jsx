import React, { useState, useEffect } from "react";

// Dummy Data
const dummyDoctors = [
  { id: 1, name: "Dr. Ahmed", specialty: "Cardiology", status: "pending" },
  { id: 2, name: "Dr. Sara", specialty: "Dermatology", status: "approved" },
];

const dummyPatients = [
  { id: 1, name: "John Doe", status: "active" },
  { id: 2, name: "Jane Smith", status: "active" },
];

const dummyAppointments = [
  { id: 1, doctor: "Dr. Ahmed", patient: "John Doe", status: "approved" },
  { id: 2, doctor: "Dr. Sara", patient: "Jane Smith", status: "completed" },
];

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch data from backend API
    setDoctors(dummyDoctors);
    setPatients(dummyPatients);
    setAppointments(dummyAppointments);
  }, []);

  // Approve or reject doctor accounts
  const handleDoctorAction = (id, action) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: action } : doc
      )
    );
    alert(`Doctor ID ${id} ${action}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* User Management */}
      <section className="mb-6 border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">User Management</h2>
        <h3 className="font-semibold">Doctors</h3>
        {doctors.map((doc) => (
          <div key={doc.id} className="mb-2 p-2 border rounded flex justify-between items-center">
            <div>
              <p><strong>Name:</strong> {doc.name}</p>
              <p><strong>Specialty:</strong> {doc.specialty}</p>
              <p><strong>Status:</strong> {doc.status}</p>
            </div>
            {doc.status === "pending" && (
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDoctorAction(doc.id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDoctorAction(doc.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        <h3 className="font-semibold mt-4">Patients</h3>
        {patients.map((pat) => (
          <div key={pat.id} className="mb-2 p-2 border rounded">
            <p><strong>Name:</strong> {pat.name}</p>
            <p><strong>Status:</strong> {pat.status}</p>
          </div>
        ))}
      </section>

      {/* System Monitoring */}
      <section className="mb-6 border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">System Monitoring</h2>
        <p>Total Doctors: {doctors.length}</p>
        <p>Total Patients: {patients.length}</p>
        <p>Total Appointments: {appointments.length}</p>
      </section>

      {/* Data Security & Privacy */}
      <section className="mb-6 border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Data Security & Privacy</h2>
        <p>All patient records and consultations are confidential.</p>
        <p>Access control and encryption are handled on the backend.</p>
      </section>

      {/* Reports & Analytics */}
      <section className="border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Reports & Analytics</h2>
        <p>Most Consulted Doctors:</p>
        <ul>
          {["Dr. Ahmed", "Dr. Sara"].map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
        <p>Total Appointments: {appointments.length}</p>
        <p>Active Patients: {patients.filter(p => p.status === "active").length}</p>
      </section>
    </div>
  );
};

export default AdminDashboard;

