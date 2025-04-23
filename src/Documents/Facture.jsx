import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaEdit, 
  FaTrash, 
  FaPlusCircle, 
  FaSearch,
  FaFileInvoiceDollar,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaFilter,
  FaSort,
  FaTimes,
  FaCheck,
  FaClock
} from 'react-icons/fa';

const Facture = () => {
  const [factures, setFactures] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    date_facture: '',
    montant: '',
    status: 'impayée',
    patient_id: ''
  });
  const [sortField, setSortField] = useState('date_facture');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          showAlert('Authentification requise', 'danger');
          return;
        }

        // Récupération des patients
        const patientsRes = await axios.get('http://localhost:8000/api/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPatients(patientsRes.data.data || patientsRes.data);

        // Récupération des factures
        const facturesRes = await axios.get('http://localhost:8000/api/factures', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFactures(facturesRes.data.data || facturesRes.data);
        
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        showAlert(`Erreur: ${errorMsg}`, 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gestion des alertes
  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ ...alert, show: false }), 5000);
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.patient_id || !formData.date_facture || !formData.montant) {
      showAlert('Veuillez remplir tous les champs obligatoires', 'danger');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = formData.id ? 'put' : 'post';
      const url = formData.id 
        ? `http://localhost:8000/api/factures/${formData.id}`
        : 'http://localhost:8000/api/factures';

      const response = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Mise à jour de l'état local
      if (formData.id) {
        setFactures(factures.map(f => f.id === formData.id ? response.data : f));
      } else {
        setFactures([response.data, ...factures]);
      }

      showAlert(`Facture ${formData.id ? 'modifiée' : 'créée'} avec succès`);
      handleCloseModal();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      showAlert(`Erreur: ${errorMsg}`, 'danger');
    }
  };

  // Édition d'une facture
  const handleEdit = (facture) => {
    setFormData({
      ...facture,
      date_facture: facture.date_facture.includes('T') 
        ? facture.date_facture.split('T')[0]
        : facture.date_facture
    });
    setShowModal(true);
  };

  // Suppression d'une facture
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/factures/${deletingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFactures(factures.filter(f => f.id !== deletingId));
      showAlert('Facture supprimée avec succès');
      setShowDeleteModal(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      showAlert(`Erreur: ${errorMsg}`, 'danger');
    }
  };

  // Fermeture modale
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id: null,
      date_facture: '',
      montant: '',
      status: 'impayée',
      patient_id: ''
    });
  };

  // Gestion du tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrage et tri des factures
  const filteredAndSortedFactures = factures
    .filter(facture => {
      const patient = patients.find(p => p.id === facture.patient_id);
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        facture.date_facture.toLowerCase().includes(searchLower) ||
        facture.montant.toString().includes(searchLower) ||
        facture.status.toLowerCase().includes(searchLower) ||
        (patient?.nom && patient.nom.toLowerCase().includes(searchLower)) ||
        (patient?.prenom && patient.prenom.toLowerCase().includes(searchLower));
        
      const matchesStatus = !statusFilter || facture.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'montant') {
        comparison = parseFloat(a.montant) - parseFloat(b.montant);
      } else if (sortField === 'date_facture') {
        comparison = new Date(a.date_facture) - new Date(b.date_facture);
      } else if (sortField === 'patient') {
        const patientA = patients.find(p => p.id === a.patient_id);
        const patientB = patients.find(p => p.id === b.patient_id);
        const nameA = patientA ? `${patientA.nom} ${patientA.prenom}`.toLowerCase() : '';
        const nameB = patientB ? `${patientB.nom} ${patientB.prenom}`.toLowerCase() : '';
        comparison = nameA.localeCompare(nameB);
      } else {
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Badge de statut
  const getStatusBadge = (status) => {
    const variants = {
      'payée': {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        icon: <FaCheck className="mr-1" />
      },
      'impayée': {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <FaTimes className="mr-1" />
      },
      'en attente': {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        icon: <FaClock className="mr-1" />
      }
    };
    
    const { bg, text, icon } = variants[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
    
    return (
      <span className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${bg} ${text}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          
          Gestion des Factures
        </h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          onClick={() => setShowModal(true)}
        >
          <FaPlusCircle className="mr-2" />
          Nouvelle Facture
        </button>
      </div>

      {alert.show && (
        <div className={`mb-6 p-4 rounded-lg shadow-md flex items-center justify-between ${
          alert.variant === 'success' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' :
          alert.variant === 'danger' ? 'bg-red-50 text-red-700 border-l-4 border-red-500' :
          alert.variant === 'warning' ? 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500' :
          'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
        }`}>
          <span className="font-medium">{alert.message}</span>
          <button 
            onClick={() => setAlert({...alert, show: false})}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between gap-4">
          <div className="relative flex-grow max-w-lg">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <FaSearch />
            </span>
            <input
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rechercher une facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="payée">Payée</option>
                <option value="impayée">Impayée</option>
                <option value="en attente">En attente</option>
              </select>
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex items-center">
                     ID
                    {sortField === 'id' && (
                      <FaSort className="ml-1 text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('patient')}>
                  <div className="flex items-center">
                    Patient
                    {sortField === 'patient' && (
                      <FaSort className="ml-1 text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date_facture')}>
                  <div className="flex items-center">
                    Date
                    {sortField === 'date_facture' && (
                      <FaSort className="ml-1 text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('montant')}>
                  <div className="flex items-center">
                    Montant
                    {sortField === 'montant' && (
                      <FaSort className="ml-1 text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Statut
                    {sortField === 'status' && (
                      <FaSort className="ml-1 text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedFactures.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">Aucune facture trouvée</td>
                </tr>
              ) : (
                filteredAndSortedFactures.map(facture => {
                  const patient = patients.find(p => p.id === facture.patient_id);
                  return (
                    <tr key={facture.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{facture.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {patient ? (
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3">
                              <FaUser />
                            </div>
                            <div>
                              <div className="font-medium">{patient.prenom} {patient.nom}</div>
                              <div className="text-xs text-gray-500">Patient {patient.id}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400">Patient inconnu</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3">
                            <FaCalendarAlt />
                          </div>
                          <div>
                            {new Date(facture.date_facture).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3">
                            <FaMoneyBillWave />
                          </div>
                          <div className="font-medium">{parseFloat(facture.montant).toFixed(2)} €</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(facture.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 py-1 px-3 rounded-lg inline-flex items-center transition-colors duration-200"
                          onClick={() => handleEdit(facture)}
                        >
                          <FaEdit className="mr-1" />
                          <span>Modifier</span>
                        </button>
                        <button 
                          className="bg-red-50 hover:bg-red-100 text-red-600 py-1 px-3 rounded-lg inline-flex items-center transition-colors duration-200"
                          onClick={() => {
                            setDeletingId(facture.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash className="mr-1" />
                          <span>Supprimer</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="text-xl font-bold text-gray-800">
                {formData.id ? 'Modifier la facture' : 'Nouvelle facture'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Patient *
                  </label>
                  {patients && patients.length > 0 ? (
                    <select
                      name="patient_id"
                      value={formData.patient_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.prenom} {patient.nom} 
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg border-l-4 border-yellow-400">
                      {loading ? 'Chargement des patients...' : 'Aucun patient disponible'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date de facturation *
                  </label>
                  <input
                    type="date"
                    name="date_facture"
                    value={formData.date_facture}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Montant (€) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="montant"
                      value={formData.montant}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Statut *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div 
                      className={`flex items-center justify-center p-3 rounded-lg cursor-pointer border ${
                        formData.status === 'impayée' 
                          ? 'bg-red-50 border-red-500 text-red-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setFormData({...formData, status: 'impayée'})}
                    >
                      <FaTimes className={`mr-2 ${formData.status === 'impayée' ? 'text-red-500' : 'text-gray-400'}`} />
                      <span>Impayée</span>
                    </div>
                    <div 
                      className={`flex items-center justify-center p-3 rounded-lg cursor-pointer border ${
                        formData.status === 'en attente' 
                          ? 'bg-amber-50 border-amber-500 text-amber-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setFormData({...formData, status: 'en attente'})}
                    >
                      <FaClock className={`mr-2 ${formData.status === 'en attente' ? 'text-amber-500' : 'text-gray-400'}`} />
                      <span>En attente</span>
                    </div>
                    <div 
                      className={`flex items-center justify-center p-3 rounded-lg cursor-pointer border ${
                        formData.status === 'payée' 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setFormData({...formData, status: 'payée'})}
                    >
                      <FaCheck className={`mr-2 ${formData.status === 'payée' ? 'text-emerald-500' : 'text-gray-400'}`} />
                      <span>Payée</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {formData.id ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaTrash className="text-red-500 mr-3" />
                Confirmation de suppression
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible et les données associées seront définitivement perdues.</p>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                Annuler
              </button>
              <button 
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Facture;