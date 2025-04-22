import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import axios from 'axios'; // Ensure axios is imported

const AdministratifDashboard = ({ users, handleDeleteUser, fetchAllUsers }) => {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'medcin',
  });
  const [editUser, setEditUser] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'medcin',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    console.log('Creating user:', newUser); // Debugging log

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/users', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('User created successfully:', response.data); // Debugging log
      alert('User created successfully!');
      setShowCreateUserModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'medcin' });
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
      alert('Failed to create user. Please try again.');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8000/api/users/${editUser.id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('User updated successfully!');
      setShowEditUserModal(false);
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      alert('Failed to update user. Please try again.');
    }
  };

  return (
    <div>
      <h3>Administratif Dashboard</h3>

      <Button
        variant="success"
        className="mb-3 d-flex align-items-center"
        onClick={() => setShowCreateUserModal(true)}
      >
        <FaUserPlus className="me-2" /> Ajouter Utilisateur
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th className="text-center">Name</th>
            <th className="text-center">Email</th>
            <th className="text-center">Role</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="text-center">{user.id}</td>
              <td className="text-center">{user.name}</td>
              <td className="text-center">{user.email}</td>
              <td className="text-center">{user.role}</td>
              <td className="text-center">
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setEditUser(user);
                    setShowEditUserModal(true);
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showCreateUserModal} onHide={() => setShowCreateUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Créer un Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUser}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="medcin">Médecin</option>
                <option value="infirmier">Infirmier</option>
                <option value="secretaire">Secrétaire</option>
                <option value="administratif">Administratif</option>
                <option value="technicien">Technicien</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary">
              Créer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditUserModal} onHide={() => setShowEditUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateUser}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editUser.name}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={editUser.password}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                name="role"
                value={editUser.role}
                onChange={handleEditInputChange}
                required
              >
                <option value="medcin">Médecin</option>
                <option value="infirmier">Infirmier</option>
                <option value="secretaire">Secrétaire</option>
                <option value="administratif">Administratif</option>
                <option value="technicien">Technicien</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary">
              Modifier
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdministratifDashboard;