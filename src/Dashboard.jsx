import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Nav, Button, Dropdown } from 'react-bootstrap';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdministratifDashboard from './components/Dashboard/AdministratifDashboard';
import MedcinDashboard from './components/Dashboard/MedcinDashboard';
import InfirmierDashboard from './components/Dashboard/InfirmierDashboard';
import SecretaireDashboard from './components/Dashboard/SecretaireDashboard';
import TechnicienDashboard from './components/Dashboard/TechnicienDashboard';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeComponent, setActiveComponent] = useState(null); // State to track active component
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch all users if the user is administratif
  useEffect(() => {
    if (userData?.role === 'administratif') {
      fetchAllUsers();
    }
  }, [userData]);

  // Fetch the logged-in user's data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to fetch user data. Please log in again.');
      navigate('/login');
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again.');
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('User deleted successfully!');
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Render the appropriate dashboard based on the user's role
  const renderDashboardContent = () => {
    switch (userData?.role) {
      case 'medcin':
        return <MedcinDashboard />;
      case 'infirmier':
        return <InfirmierDashboard />;
      case 'secretaire':
        return <SecretaireDashboard />;
      case 'administratif':
        return (
          <>
            {activeComponent === 'utilisateur' && (
              <AdministratifDashboard
                users={users}
                handleDeleteUser={handleDeleteUser}
                fetchAllUsers={fetchAllUsers}
              />
            )}
          </>
        );
      case 'technicien':
        return <TechnicienDashboard />;
      default:
        return <p>No dashboard available for your role.</p>;
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={2} className="sidebar text-white vh-100 p-3 position-fixed shadow" style={{ backgroundColor: '#343a40', width: '250px' }}>
          <h2 className="mb-4">Dashboard</h2>
          <Nav className="flex-column">
  {userData?.role === 'administratif' && (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" className="w-100 text-start p-2 rounded hover-effect">
        Gestion des Participants
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          className="p-1 rounded hover-effect"
          onClick={() => setActiveComponent('utilisateur')} // Set active component to 'utilisateur'
        >
          <FaUser className="me-2" /> Utilisateur
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )}
</Nav>
        </Col>
        <Col xs={10} className="offset-2 p-4 main-content" style={{ marginLeft: '250px', backgroundColor: '#f8f9fa' }}>
          <Row className="mb-4">
            <Col>
              <div className="welcome-header p-4 rounded shadow bg-white d-flex justify-content-between align-items-center">
                {userData && <h5 className="fw-bold text-dark mb-0">Bienvenue, {userData.name}!</h5>}
                <Button onClick={() => navigate('/login')} variant="danger" className="d-flex align-items-center logout-btn hover-effect">
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </div>
            </Col>
          </Row>
          {renderDashboardContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;