import React, { useEffect, useState } from "react";
import "./Admin.css";

const Metrics = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("https://your-api.com/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="metrics">
      <div className="metric-card">
        <h3>Total Users</h3>
        <p>{stats.users || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Total Doctors</h3>
        <p>{stats.doctors || 0}</p>
      </div>
      <div className="metric-card">
        <h3>Most Booked Doctor</h3>
        <p>{stats.topDoctor || "N/A"}</p>
      </div>
      <div className="metric-card">
        <h3>Patient Retention</h3>
        <p>{stats.retention ? `${stats.retention}%` : "N/A"}</p>
      </div>
    </div>
  );
};

export default Metrics;
