import React, { useState, useEffect } from "react";

// Components placeholders
import Profile from "./Profile";
import Appointments from "./Appointments";
import VideoConsultation from "./VideoConsultation";
import Prescriptions from "./Prescriptions";
import MedicalRecords from "./MedicalRecords";
import Feedback from "./Feedback";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Example: fetch user data
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO: replace with API call to fetch patient profile
    setUser({
      name: "John Doe",
      age: 30,
      gender: "Male",
      contact: "1234567890",
      medicalHistory: "No chronic illness",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-8">Patient Dashboard</h1>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer ${
              activeTab === "profile" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "appointments" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            Book Appointment
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "video" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("video")}
          >
            Video Consultation
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "prescriptions" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("prescriptions")}
          >
            Prescriptions
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "records" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("records")}
          >
            Medical Records
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "feedback" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("feedback")}
          >
            Feedback
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "profile" && <Profile user={user} />}
        {activeTab === "appointments" && <Appointments />}
        {activeTab === "video" && <VideoConsultation />}
        {activeTab === "prescriptions" && <Prescriptions />}
        {activeTab === "records" && <MedicalRecords />}
        {activeTab === "feedback" && <Feedback />}
      </div>
    </div>
  );
};

export default PatientDashboard;