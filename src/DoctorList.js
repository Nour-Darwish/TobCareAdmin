import React, { useState, useEffect } from "react";
import DoctorCard from "./DoctorCard";
import "./Admin.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors from the backend
    fetch("https://your-api.com/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  const handleRemoveDoctor = (id) => {
    fetch(`https://your-api.com/doctors/${id}`, {
      method: "DELETE",
    })
      .then(() => setDoctors(doctors.filter((doctor) => doctor.id !== id)))
      .catch((err) => console.error("Error removing doctor:", err));
  };

  return (
    <div className="doctor-list">
      <h2>Doctors</h2>
      <div className="doctor-container">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onRemove={handleRemoveDoctor}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
