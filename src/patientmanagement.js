import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash, ArrowLeft, Search, User, Calendar, Phone, Mail, Droplet } from "react-feather";
import "./patient.css";

const PatientManagement = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://zo0of1qvtk.execute-api.us-east-1.amazonaws.com/dev/admin/patients"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data.patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([
          { id: 1, username: "john123", name: "John Doe", phonenumber: "123456789", email: "john@example.com", gender: "Male", dateofbirth: "1990-01-01", bloodtype: "O+", media: "patient1.jpg" },
          { id: 2, username: "jane456", name: "Jane Smith", phonenumber: "987654321", email: "jane@example.com", gender: "Female", dateofbirth: "1992-05-15", bloodtype: "A-", media: "patient2.jpg" },
          { id: 3, username: "samuel789", name: "Samuel Johnson", phonenumber: "555888777", email: "samuel@example.com", gender: "Male", dateofbirth: "1980-03-12", bloodtype: "B+", media: "patient3.jpg" },
          { id: 4, username: "sara321", name: "Sara Lee", phonenumber: "123123123", email: "sara@example.com", gender: "Female", dateofbirth: "1995-07-19", bloodtype: "AB+", media: "patient4.jpg" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    const sortableData = [...patients];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const filteredPatients = getSortedData().filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phonenumber.includes(searchTerm)
  );

  const confirmDelete = (e, patient) => {
    e.stopPropagation();
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const deletePatient = async () => {
    try {
      // In production, you would make an API call to delete the patient
      // await fetch(`your-api-endpoint/${selectedPatient.id}`, { method: 'DELETE' });
      
      // Optimistically update UI
      setPatients(patients.filter((patient) => patient.id !== selectedPatient.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting patient:", error);
      // Handle error - perhaps show an error message
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRowClick = (patient) => {
    navigate(`/admin/patient/view/${patient.id}`);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="admin-patients-wrapper">
      <div className="admin-header">
        <div className="admin-header-top">
          <button className="back-arrow" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Patient Management</h1>
            <div className="admin-date">
              Total Patients: <strong>{patients.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <div className="admin-search">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search patients"
          />
        </div>
        <button className="admin-add-btn" onClick={() => navigate("/admin/patient/new")}>
          Add New Patient
        </button>
      </div>

      <div className="patient-table-wrapper">
        {filteredPatients.length === 0 ? (
          <div className="no-results">
            <p>No patients found matching your search criteria.</p>
          </div>
        ) : (
          <table className="patient-table">
            <thead>
              <tr>
                <th onClick={() => sortData('username')}>
                  Username {sortConfig.key === 'username' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('name')}>
                  Full Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('phonenumber')}>
                  Phone {sortConfig.key === 'phonenumber' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('email')}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('gender')}>
                  Gender {sortConfig.key === 'gender' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('dateofbirth')}>
                  Date of Birth {sortConfig.key === 'dateofbirth' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('bloodtype')}>
                  Blood Type {sortConfig.key === 'bloodtype' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th>Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} onClick={() => handleRowClick(patient)}>
                  <td className="username-cell">
                    <div className="cell-with-icon">
                      <User size={14} className="cell-icon" /> {patient.username}
                    </div>
                  </td>
                  <td>{patient.name}</td>
                  <td>
                    <div className="cell-with-icon">
                      <Phone size={14} className="cell-icon" /> {patient.phonenumber}
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <Mail size={14} className="cell-icon" /> {patient.email}
                    </div>
                  </td>
                  <td>{patient.gender}</td>
                  <td>
                    <div className="cell-with-icon">
                      <Calendar size={14} className="cell-icon" /> {formatDate(patient.dateofbirth)}
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <Droplet size={14} className="cell-icon" /> {patient.bloodtype}
                    </div>
                  </td>
                  <td>
                    {patient.media ? (
                      <img
                        src={`https://your-s3-bucket-url/${patient.media}`}
                        alt={`${patient.name}'s profile`}
                        className="patient-profile-img"
                      />
                    ) : (
                      <div className="no-profile-img">No Image</div>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="patient-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/patient/edit/${patient.id}`);
                      }}
                      aria-label={`Edit ${patient.name}`}
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      className="patient-delete-btn"
                      onClick={(e) => confirmDelete(e, patient)}
                      aria-label={`Delete ${patient.name}`}
                    >
                      <Trash size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedPatient.name}?</p>
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
                onClick={deletePatient}
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

export default PatientManagement;