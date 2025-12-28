<div className="w-64 bg-white shadow-lg p-6">

  {/* Back / Logout Button */}
  <BackButton />

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
