import React, { useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    age: 28,
    gender: "Male",
    contact: "+123456789",
    history: "No known allergies. Previous surgery: Appendectomy (2020)."
  });

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Contact:</strong> {profile.contact}</p>
        <div className="md:col-span-2">
          <strong>Medical History:</strong>
          <p className="mt-1 p-2 bg-gray-50 border rounded text-sm">{profile.history}</p>
        </div>
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Update Details
      </button>
    </div>
  );
};

export default Profile;