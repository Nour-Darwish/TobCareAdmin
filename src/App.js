import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AdminDashboard from "./Adminboard"; // Import your Admin Dashboard component
import HomePage from "./DoctorCard"; // Your homepage component or other routes
import Patient from "./patientmanagement"; // Your homepage component or other routes

const App = () => {
  return (
    <Router>
    <Routes>
      {/* Define the route for the Admin Dashboard */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Add other routes as needed */}
      <Route path="/" element={<HomePage />} />
      <Route path="/patient" element={<Patient />} />

    </Routes>
  </Router>
);
};

export default App;