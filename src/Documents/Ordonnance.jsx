import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Alert, Badge, Spinner } from 'react-bootstrap';
import { 
  FaEdit, FaTrash, FaPlusCircle, FaCheckCircle, 
  FaSearch, FaUserCircle, FaFilePrescription 
} from 'react-icons/fa';

const API_URL = 'http://localhost:8000/api';

const Ordonnances = () => {
  const [ordonnances, setOrdonnances] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    patient_id: '',
    date: new Date().toISOString().split('T')[0],
    traitement: '',
    dosage: '',
    duree: '',
    note: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }
      
      const [ordonnancesRes, patientsRes] = await Promise.all([
        axios.get(`${API_URL}/ordonnances`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
  
      setOrdonnances(ordonnancesRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error('Erreur de chargement des données:', error);
      setMessage(`Erreur: ${error.response?.data?.message || error.message}`);
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.patient_id) errors.patient_id = 'Patient requis';
    if (!formData.traitement) errors.traitement = 'Traitement requis';
    if (!formData.date) errors.date = 'Date requise';
    if (!formData.dosage) errors.dosage = 'Dosage requis';
    if (!formData.duree) errors.duree = 'Durée requise';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const method = editMode ? 'put' : 'post';
      const url = editMode 
        ? `${API_URL}/ordonnances/${formData.id}`
        : `${API_URL}/ordonnances`;

      // Format data before sending
      const payload = {
        ...formData,
       date: formData.date
 // Ensure proper date format
      };

      console.log('Sending payload:', payload); // Debug log

      const response = await axios[method](url, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage(`Ordonnance ${editMode ? 'modifiée' : 'ajoutée'} avec succès !`);
      setShowSuccessModal(true);
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Full error response:', error.response);
      
      if (error.response?.status === 422) {
        // Handle Laravel-style validation errors
        if (error.response.data.errors) {
          const formattedErrors = {};
          Object.entries(error.response.data.errors).forEach(([key, value]) => {
            formattedErrors[key] = Array.isArray(value) ? value.join(' ') : value;
          });
          setFormErrors(formattedErrors);
          setMessage('Veuillez corriger les erreurs dans le formulaire');
        } else {
          setMessage(error.response.data.message || 'Erreur de validation');
        }
      } else {
        setMessage(`Erreur: ${error.response?.data?.message || error.message}`);
      }
      
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (ordonnance) => {
    setFormData({
      id: ordonnance.id,
      patient_id: ordonnance.patient_id,
      date: ordonnance.date ? ordonnance.date.split('T')[0] : new Date().toISOString().split('T')[0],
      traitement: ordonnance.traitement,
      dosage: ordonnance.dosage,
      duree: ordonnance.duree,
      note: ordonnance.note || ''
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/ordonnances/${deletingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Ordonnance supprimée avec succès !');
      setShowSuccessModal(true);
      fetchData();
    } catch (error) {
      console.error('Erreur de suppression:', error);
      setMessage(`Erreur: ${error.response?.data?.message || error.message}`);
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  };
  

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setFormData({
      id: null,
      patient_id: '',
      date: new Date().toISOString().split('T')[0],
      traitement: '',
      dosage: '',
      duree: '',
      note: ''
    });
    setFormErrors({});
  };

  // Filter ordonnances
  const filteredOrdonnances = ordonnances.filter(ord => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const patient = patients.find(p => p.id === ord.patient_id);
    const patientName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : '';
    
    return (
      patientName.includes(searchLower) ||
      ord.date?.toLowerCase().includes(searchLower) ||
      ord.traitement?.toLowerCase().includes(searchLower) ||
      ord.dosage?.toLowerCase().includes(searchLower) ||
      ord.duree?.toLowerCase().includes(searchLower)
    );
  });

  // Format date
  const FormattedDate = ({ date }) => (
    <div className="d-flex align-items-center gap-2">
      <FaFilePrescription className="text-gray-400" />
      <span className="font-medium">
        {new Date(date).toLocaleDateString('fr-FR')}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Ordonnances</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaPlusCircle /> Nouvelle Ordonnance
        </Button>
      </div>

      {/* Search bar */}
      <div className="position-relative mb-4">
        <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
          <FaSearch className="text-gray-400" />
        </div>
        <Form.Control
          type="text"
          placeholder="Rechercher..."
          className="ps-5"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main table */}
      <div className="rounded border overflow-hidden shadow-sm">
        {loading && ordonnances.length === 0 ? (
          <div className="d-flex justify-content-center p-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Traitement</th>
                    <th>Dosage</th>
                    <th>Durée</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                
                <tbody>
                  {filteredOrdonnances.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        {ordonnances.length === 0 
                          ? 'Aucune ordonnance disponible' 
                          : 'Aucun résultat trouvé'}
                      </td>
                    </tr>
                  ) : (
                    filteredOrdonnances.map(ord => {
                      const patient = patients.find(p => p.id === ord.patient_id);
                      return (
                        <tr key={ord.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <FaUserCircle className="text-gray-400 fs-4" />
                              <div>
                                <div className="fw-medium">{patient?.prenom} {patient?.nom}</div>
                                <div className="text-muted small">{patient?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <FormattedDate date={ord.date} />
                          </td>
                          <td className="fw-medium">
                            {ord.traitement}
                          </td>
                          <td>
                            <Badge bg="info">{ord.dosage}</Badge>
                          </td>
                          <td>
                            <Badge bg="warning" text="dark">{ord.duree}</Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleEdit(ord)}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(ord.id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Form modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? 'Modifier Ordonnance' : 'Nouvelle Ordonnance'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && (
            <Alert variant="danger" onClose={() => setMessage('')} dismissible>
              {message}
            </Alert>
          )}
          <Form onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Patient <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.patient_id}
                  >
                    <option value="">Sélectionner un patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.nom} {patient.prenom}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.patient_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.date}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Traitement <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="traitement"
                    value={formData.traitement}
                    onChange={handleInputChange}
                    placeholder="Détails du traitement"
                    isInvalid={!!formErrors.traitement}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.traitement}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Dosage <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="Ex: 500mg, 1 comprimé"
                    isInvalid={!!formErrors.dosage}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.dosage}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Durée <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="duree"
                    value={formData.duree}
                    onChange={handleInputChange}
                    placeholder="Ex: 7 jours, 1 mois"
                    isInvalid={!!formErrors.duree}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.duree}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Notes supplémentaires"
                isInvalid={!!formErrors.note}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.note}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" />
                    <span className="ms-2">Enregistrement...</span>
                  </>
                ) : editMode ? (
                  'Mettre à jour'
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant={message.includes('Erreur') ? 'danger' : 'success'}>
            {message}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            Êtes-vous sûr de vouloir supprimer cette ordonnance ? Cette action est irréversible.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" />
                <span className="ms-2">Suppression...</span>
              </>
            ) : (
              'Confirmer la suppression'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ordonnances;