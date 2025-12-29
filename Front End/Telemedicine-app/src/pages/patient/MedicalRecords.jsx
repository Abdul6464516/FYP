import React from "react";

const MedicalRecords = () => {
  const records = [
    { id: 1, type: "Lab Report", date: "2025-10-12", doctor: "Dr. Ahmed", file: "BloodTest.pdf" },
    { id: 2, type: "Consultation Note", date: "2025-11-05", doctor: "Dr. Sarah", file: "SkinCheck.pdf" },
  ];

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Medical Records</h2>
      <div className="space-y-3">
        {records.map(record => (
          <div key={record.id} className="flex justify-between items-center p-3 border-b">
            <div>
              <p className="font-semibold">{record.type}</p>
              <p className="text-xs text-gray-500">{record.date} - Assigned by {record.doctor}</p>
            </div>
            <button className="text-blue-500 text-sm hover:underline">View File</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecords;