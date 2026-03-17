import React, { useState } from 'react';
import { ClipboardList, Upload, Eye, Download, Search, FilePlus, Filter } from 'lucide-react';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data for Medical Records
  const records = [
    { 
      id: "REC-001", 
      type: "Lab Report", 
      doctor: "Dr. Sarah Smith", 
      date: "Dec 15, 2025", 
      summary: "Full Blood Count - Normal",
      fileSize: "1.2 MB"
    },
    { 
      id: "REC-002", 
      type: "Radiology", 
      doctor: "Dr. James Wilson", 
      date: "Nov 20, 2025", 
      summary: "Chest X-Ray - Clear",
      fileSize: "4.5 MB"
    },
    { 
      id: "REC-003", 
      type: "Consultation Summary", 
      doctor: "Dr. Maria Garcia", 
      date: "Oct 05, 2025", 
      summary: "Annual Health Checkup",
      fileSize: "0.8 MB"
    }
  ];

  const filteredRecords = records.filter(rec => 
    rec.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mr-container">
      {/* Header Actions */}
      <div className="mr-header">
        <h3 className="mr-title">Medical Records & History</h3>
        <button className="mr-upload-btn">
          <Upload size={18} /> Upload New Report
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mr-filter-row">
        <div className="mr-search-box">
          <Search size={18} color="#888" />
          <input 
            type="text" 
            placeholder="Search by report type or doctor..." 
            className="mr-search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="mr-icon-btn"><Filter size={18} /></button>
      </div>

      {/* Records Table/List */}
      <div className="mr-table-container">
        <table className="mr-table">
          <thead>
            <tr className="mr-table-header">
              <th className="mr-th">Report Type</th>
              <th className="mr-th">Assigned Doctor</th>
              <th className="mr-th">Date</th>
              <th className="mr-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => (
              <tr key={rec.id} className="mr-tr">
                <td className="mr-td">
                  <div className="mr-type-col">
                    <ClipboardList size={18} color="#28a745" />
                    <div>
                      <div className="mr-primary-text">{rec.type}</div>
                      <div className="mr-secondary-text">{rec.summary}</div>
                    </div>
                  </div>
                </td>
                <td className="mr-td">{rec.doctor}</td>
                <td className="mr-td">{rec.date}</td>
                <td className="mr-td">
                  <div className="mr-action-group">
                    <button className="mr-action-btn" title="View"><Eye size={16} /></button>
                    <button className="mr-action-btn" title="Download"><Download size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalRecords;