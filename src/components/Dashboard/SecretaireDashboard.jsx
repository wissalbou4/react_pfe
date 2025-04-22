import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';

const SecretaireDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nom: '',
        prenom: '',
        date_naissance: '',
        telephone: '',
        email: '',
        adresse: '',
        antecedents_medicaux: '',
        hospitalise: false,
    });

    // Fetch all patients
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/patients', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle form submission for adding a patient
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/patients', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchPatients(); // Refresh the patient list
            setShowAddModal(false); // Close the modal
            resetFormData(); // Reset form data
        } catch (error) {
            console.error('Error creating patient:', error);
        }
    };

    // Handle form submission for updating a patient
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/patients/${formData.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchPatients(); // Refresh the patient list
            setShowEditModal(false); // Close the modal
            resetFormData(); // Reset form data
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    // Handle deleting a patient
    const handleDeletePatient = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchPatients(); // Refresh the patient list
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    // Handle opening the edit modal and setting the form data
    const handleEditPatient = (patient) => {
        setFormData({
            id: patient.id,
            nom: patient.nom,
            prenom: patient.prenom,
            date_naissance: patient.date_naissance,
            telephone: patient.telephone,
            email: patient.email,
            adresse: patient.adresse,
            antecedents_medicaux: patient.antecedents_medicaux,
            hospitalise: patient.hospitalise,
        });
        setShowEditModal(true);
    };

    // Reset form data
    const resetFormData = () => {
        setFormData({
            id: null,
            nom: '',
            prenom: '',
            date_naissance: '',
            telephone: '',
            email: '',
            adresse: '',
            antecedents_medicaux: '',
            hospitalise: false,
        });
    };

    return (
        <div>
            <h2>Gestion des Patients</h2>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
                Ajouter un Patient
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Date de Naissance</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Adresse</th>
                        <th>Antécédents Médicaux</th>
                        <th>Hospitalisé</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.nom}</td>
                            <td>{patient.prenom}</td>
                            <td>{patient.date_naissance}</td>
                            <td>{patient.telephone}</td>
                            <td>{patient.email}</td>
                            <td>{patient.adresse}</td>
                            <td>{patient.antecedents_medicaux}</td>
                            <td>{patient.hospitalise ? 'Oui' : 'Non'}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditPatient(patient)}>
                                    Modifier
                                </Button>{' '}
                                <Button variant="danger" onClick={() => handleDeletePatient(patient.id)}>
                                    Supprimer
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add Patient Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date de Naissance</Form.Label>
                            <Form.Control
                                type="date"
                                name="date_naissance"
                                value={formData.date_naissance}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control
                                type="text"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control
                                type="text"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Antécédents Médicaux</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="antecedents_medicaux"
                                value={formData.antecedents_medicaux}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="hospitalise"
                                label="Hospitalisé"
                                checked={formData.hospitalise}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Enregistrer
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Patient Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier un Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date de Naissance</Form.Label>
                            <Form.Control
                                type="date"
                                name="date_naissance"
                                value={formData.date_naissance}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control
                                type="text"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control
                                type="text"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Antécédents Médicaux</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="antecedents_medicaux"
                                value={formData.antecedents_medicaux}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="hospitalise"
                                label="Hospitalisé"
                                checked={formData.hospitalise}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Enregistrer les modifications
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default SecretaireDashboard;