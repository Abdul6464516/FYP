import React, { useState } from "react";

const Appointments = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Dummy data for doctor search
  const doctors = [
    { id: 1, name: "Dr. Ahmed", specialty: "Cardiology", available: "10:00 AM" },
    { id: 2, name: "Dr. Sarah", specialty: "Dermatology", available: "02:00 PM" },
  ];

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
      
      {/* Search/Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Filter by Specialty:</label>
        <select 
          className="border p-2 rounded w-full"
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option>All</option>
          <option>Cardiology</option>
          <option>Dermatology</option>
        </select>
      </div>

      {/* Doctor List */}
      <div className="space-y-3">
        {doctors
          .filter(d => selectedSpecialty === "All" || d.specialty === selectedSpecialty)
          .map(doc => (
            <div key={doc.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-semibold">{doc.name}</p>
                <p className="text-sm text-gray-600">{doc.specialty}</p>
              </div>
              <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                Book {doc.available}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Appointments;