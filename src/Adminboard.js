import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Import proper icons - replace these with your actual icon imports
import { Users, UserPlus, DollarSign, Calendar, ArrowLeft } from "react-feather";
import { Line, Bar } from "react-chartjs-2"; // Import chart library
import Chart from "chart.js/auto"; // Import chart.js
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalAppointments: 0,
  });
  const [topDoctors, setTopDoctors] = useState([]);
  const [retentionData, setRetentionData] = useState({
    returningPatients: 0,
    retentionRate: 0,
  });
  const [activePatients, setActivePatients] = useState([]);
  const [activeUsersToday, setActiveUsersToday] = useState(0);
  const [appointmentTrends, setAppointmentTrends] = useState([]);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoints
        const statsResponse = await fetch(
          "https://zo0of1qvtk.execute-api.us-east-1.amazonaws.com/dev/admin/stats"
        );
        const topDoctorsResponse = await fetch(
          "https://zo0of1qvtk.execute-api.us-east-1.amazonaws.com/dev/admin/top_doctors"
        );
        const retentionResponse = await fetch(
          "https://zo0of1qvtk.execute-api.us-east-1.amazonaws.com/dev/admin/patient_retention"
        );

        if (!statsResponse.ok || !topDoctorsResponse.ok || !retentionResponse.ok) {
          throw new Error("Failed to fetch admin dashboard data");
        }

        const statsData = await statsResponse.json();
        const topDoctorsData = await topDoctorsResponse.json();
        const retentionData = await retentionResponse.json();

        setTopDoctors(topDoctorsData.topDoctors);
        setRetentionData(retentionData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
        
        // Set mock data for development
        setStats({
          totalDoctors: 42,
          totalUsers: 1587,
          totalRevenue: 78450,
          totalAppointments: 2340,
        });
        setTopDoctors([
          { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", bookings: 145, revenue: 14500, image: "doctor1.jpg" },
          { id: 2, name: "Dr. Michael Chen", specialty: "Dermatology", bookings: 132, revenue: 13200, image: "doctor2.jpg" },
          { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrics", bookings: 128, revenue: 12800, image: "doctor3.jpg" },
        ]);
        setRetentionData({
          returningPatients: 876,
          retentionRate: 68.5,
        });
        setActivePatients([{ name: "John Doe", appointments: 20 }, { name: "Jane Smith", appointments: 18 }]);
        setActiveUsersToday(45);
        setAppointmentTrends([50, 75, 60, 80, 100]); // Mock data
        setRevenueTrends([2000, 2200, 2100, 2500, 2300]); // Mock data
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
        <small>Please wait while we fetch the latest information</small>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      {error && (
        <div className="admin-error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      <div className="admin-header">
        <div className="admin-header-top">
          <button 
            className="back-arrow" 
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1>Admin Dashboard</h1>
            <div className="admin-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" onClick={() => navigateTo("/admin/doctors")}>
          <div className="admin-stat-icon doctor-icon">
            <Users size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>Total Doctors</h3>
            <div className="admin-stat-value">{stats.totalDoctors}</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => navigateTo("/admin/users")}>
          <div className="admin-stat-icon user-icon">
            <UserPlus size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>Total Patients</h3>
            <div className="admin-stat-value">{stats.totalUsers.toLocaleString()}</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => navigateTo("/admin/revenue")}>
          <div className="admin-stat-icon revenue-icon">
            <DollarSign size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>Total Revenue</h3>
            <div className="admin-stat-value">{formatCurrency(stats.totalRevenue)}</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => navigateTo("/admin/appointments")}>
          <div className="admin-stat-icon appointment-icon">
            <Calendar size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>Total Appointments</h3>
            <div className="admin-stat-value">{stats.totalAppointments.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-dashboard-content">
        {/* Top Doctors Section */}
        <div className="admin-dashboard-section">
          <div className="admin-section-header">
            <h2>Most Frequently Booked Doctors</h2>
            <button className="admin-view-all-btn" onClick={() => navigateTo("/admin/doctors")}>
              View All
            </button>
          </div>

          <div className="admin-top-doctors-grid">
            {topDoctors.map((doctor) => (
              <div className="admin-doctor-card" key={doctor.id}>
                <img
                  src={`https://tobcare-bucket.s3.us-east-1.amazonaws.com/${doctor.image}`}
                  alt={doctor.name}
                  className="admin-doctor-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(doctor.name) + "&background=0197a5&color=fff";
                  }}
                />
                <div className="admin-doctor-info">
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialty}</p>
                  <div className="admin-doctor-stats">
                    <div className="admin-doctor-stat">
                      <span className="admin-stat-label">Bookings</span>
                      <span className="admin-stat-number">{doctor.bookings}</span>
                    </div>
                    <div className="admin-doctor-stat">
                      <span className="admin-stat-label">Revenue</span>
                      <span className="admin-stat-number">{formatCurrency(doctor.revenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Retention Section */}
        <div className="admin-dashboard-section">
          <div className="admin-section-header">
            <h2>Patient Retention</h2>
            <button className="admin-view-all-btn" onClick={() => navigateTo("/admin/retention")}>
              Full Report
            </button>
          </div>

          <div className="admin-retention-stats">
            <div className="admin-retention-card">
              <div className="admin-retention-value">{retentionData.returningPatients.toLocaleString()}</div>
              <div className="admin-retention-label">Returning Patients</div>
              <div className="admin-retention-progress">
                <div 
                  className="admin-retention-bar" 
                  style={{ width: `${(retentionData.returningPatients / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="admin-retention-card">
              <div className="admin-retention-value">{retentionData.retentionRate}%</div>
              <div className="admin-retention-label">Retention Rate</div>
              <div className="admin-retention-progress">
                <div 
                  className="admin-retention-bar" 
                  style={{ width: `${retentionData.retentionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  {/* New Analytics and Trends Section */}
  <div className="admin-dashboard-content">
        <div className="admin-dashboard-section">
          <div className="admin-section-header">
            <h2>Appointment Trends</h2>
          </div>
          <Line 
            data={{
              labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
              datasets: [{
                label: 'Appointments',
                data: appointmentTrends,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              }],
            }}
            options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
          />
        </div>

        <div className="admin-dashboard-section">
          <div className="admin-section-header">
            <h2>Revenue Trends</h2>
          </div>
          <Bar 
            data={{
              labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'],
              datasets: [{
                label: 'Revenue',
                data: revenueTrends,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              }],
            }}
            options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
          />
        </div>

<div className="admin-dashboard-section">
  <div className="admin-section-header">
    <h2>Active Users Today</h2>
  </div>
  <div className="admin-active-users-today-card">
    <div className="admin-active-users-card-content">
      <h3>{activeUsersToday}</h3>
      <p>Users logged in today</p>
    </div>
    <div className="admin-active-users-progress">
      <div 
        className="admin-active-users-bar" 
        style={{ width: `${(activeUsersToday / stats.totalUsers) * 100}%` }}
      ></div>
    </div>
  </div>
</div>

<div className="admin-dashboard-section">
  <div className="admin-section-header">
    <h2>Most Active Patients</h2>
  </div>
  <div className="admin-active-patients-list">
    {activePatients.map((patient, index) => (
      <div key={patient.name} className="admin-patient-card">
        <div className="admin-patient-card-header">
          <h4>{patient.name}</h4>
        </div>
        <div className="admin-patient-card-body">
          <p><strong>Appointments:</strong> {patient.appointments}</p>
          <p><strong>Activity Level:</strong> <span>{(patient.appointments / 20) * 100}%</span></p>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>

  
    </div>
  );
};

export default AdminDashboard;