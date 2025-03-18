import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Edit, Trash, ArrowLeft } from "react-feather";
import "./Doctor.css";

const DoctorManagement = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          "https://zo0of1qvtk.execute-api.us-east-1.amazonaws.com/dev/admin/doctors"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        // Mock data for development
        setDoctors([
          { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", patients: 145, rating: 4.8, status: "Active", image: "doctor1.jpg" },
          { id: 2, name: "Dr. Michael Chen", specialty: "Dermatology", patients: 132, rating: 4.7, status: "Active", image: "doctor2.jpg" },
          { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrics", patients: 128, rating: 4.9, status: "Active", image: "doctor3.jpg" },
          { id: 4, name: "Dr. James Wilson", specialty: "Orthopedics", patients: 118, rating: 4.6, status: "Inactive", image: "doctor4.jpg" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const deleteDoctor = async () => {
    // Implement actual deletion logic
    setDoctors(doctors.filter(doctor => doctor.id !== selectedDoctor.id));
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="admin-doctors-wrapperr">
      <div className="admin-header">
        <div className="admin-header-top">
          <button className="back-arrow" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1>Doctor Management</h1>
            <div className="admin-date">Total Doctors: {doctors.length}</div>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <div className="doctor-search">
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="search-icon" size={18} />
        </div>
        <button className="admin-doctor-add-btn" onClick={() => navigate("/admin/doctor/new")}>
          <Plus size={18} /> Add New Doctor
        </button>
      </div>

      <div className="doctor-grid">
        {filteredDoctors.map((doctor) => (
          <div className="doctor-card" key={doctor.id}>
            <div className="doctor-card-header">
              <img
                src={`https://tobcare-bucket.s3.us-east-1.amazonaws.com/${doctor.image}`}
                alt={doctor.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0197a5&color=fff`;
                }}
              />
              <div className={`doctor-status ${doctor.status.toLowerCase()}`}>
                {doctor.status}
              </div>
            </div>
            <div className="doctor-card-body">
              <h3>{doctor.name}</h3>
              <p className="specialty">{doctor.specialty}</p>
              <div className="doctor-stats">
                <div className="doctor-stat">
                  <span className="stat-label">Patients</span>
                  <span className="stat-value">{doctor.patients}</span>
                </div>
                <div className="doctor-stat">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">{doctor.rating}/5</span>
                </div>
              </div>
            </div>
            <div className="doctor-card-actions">
              <button 
                className="doctor-edit-btn"
                onClick={() => navigate(`/admin/doctor/edit/${doctor.id}`)}
              >
                <Edit size={16} /> Edit
              </button>
              <button 
                className="doctor-delete-btn"
                onClick={() => confirmDelete(doctor)}
              >
                <Trash size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete Dr. {selectedDoctor.name}?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="modal-cancel" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-confirm" 
                onClick={deleteDoctor}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;