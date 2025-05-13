import React, { useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiUserPlus, FiX, FiCheck, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Utilisateurs = ({ users, handleDeleteUser, fetchAllUsers }) => {
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/users', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setSuccess('Utilisateur créé avec succès!');
      setShowCreateUserModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'medcin' });
      fetchAllUsers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Échec de la création de l\'utilisateur';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/users/${editUser.id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setSuccess('Utilisateur mis à jour avec succès!');
      setShowEditUserModal(false);
      fetchAllUsers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Échec de la mise à jour de l\'utilisateur';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (userId, userName) => {
    Swal.fire({
      title: `Supprimer ${userName} ?`,
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      background: '#ffffff',
      backdrop: `
        rgba(0,0,0,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await handleDeleteUser(userId);
          setSuccess(`Utilisateur ${userName} supprimé avec succès !`);
          setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
          setError(`Échec de la suppression de ${userName}`);
        }
      }
    });
  };

  const roles = {
    'medcin': 'Médecin',
    'infirmier': 'Infirmier',
    'secretaire': 'Secrétaire',
    'administratif': 'Administratif',
    'technicien': 'Technicien'
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      'medcin': 'bg-blue-100 text-blue-800',
      'infirmier': 'bg-blue-50 text-blue-600',
      'secretaire': 'bg-indigo-100 text-indigo-800',
      'administratif': 'bg-cyan-100 text-cyan-800',
      'technicien': 'bg-sky-100 text-sky-800',
    };
    return classes[role] || 'bg-blue-50 text-blue-600';
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roles[user.role].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      {/* Notification Alerts */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <span className="text-green-700">{success}</span>
          </div>
          <button
            onClick={() => setSuccess('')}
            className="text-green-500 hover:text-green-700"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white shadow-md rounded-lg mb-6 p-6">
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-2xl font-semibold text-blue-900">Gestion des Utilisateurs</h2>
          <button
            onClick={() => setShowCreateUserModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <FiUserPlus className="text-lg" />
            <span>Ajouter Utilisateur</span>
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Rechercher par nom, email ou rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Nom</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Rôle</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                    {roles[user.role] || user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditUser(user);
                        setShowEditUserModal(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Modifier"
                    >
                      <FiEdit2 className="text-lg" />
                    </button>
                    <button
                      onClick={() => confirmDelete(user.id, user.name)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Supprimer"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                  {searchTerm ? 'Aucun résultat trouvé pour votre recherche' : 'Aucun utilisateur trouvé'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => !loading && setShowCreateUserModal(false)}></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full z-20">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-blue-900">
                    Créer un Utilisateur
                  </h3>
                  <button
                    onClick={() => !loading && setShowCreateUserModal(false)}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-blue-700 mb-1">
                      Nom
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={newUser.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={newUser.email}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-1">
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength="6"
                      value={newUser.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-blue-700 mb-1">
                      Rôle
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={newUser.role}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="medcin">Médecin</option>
                      <option value="secretaire">Secrétaire</option>
                      <option value="administratif">Administratif</option>
                    
                    </select>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateUserModal(false)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none disabled:opacity-70"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-70 flex items-center space-x-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <span>Création...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        <span>Créer</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => !loading && setShowEditUserModal(false)}></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full z-20">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-blue-900">
                    Modifier l'Utilisateur
                  </h3>
                  <button
                    onClick={() => !loading && setShowEditUserModal(false)}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-blue-700 mb-1">
                      Nom
                    </label>
                    <input
                      id="edit-name"
                      name="name"
                      type="text"
                      required
                      value={editUser.name}
                      onChange={handleEditInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-blue-700 mb-1">
                      Email
                    </label>
                    <input
                      id="edit-email"
                      name="email"
                      type="email"
                      required
                      value={editUser.email}
                      onChange={handleEditInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-password" className="block text-sm font-medium text-blue-700 mb-1">
                      Mot de passe (laisser vide pour ne pas changer)
                    </label>
                    <input
                      id="edit-password"
                      name="password"
                      type="password"
                      value={editUser.password}
                      onChange={handleEditInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      placeholder="Nouveau mot de passe"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-role" className="block text-sm font-medium text-blue-700 mb-1">
                      Rôle
                    </label>
                    <select
                      id="edit-role"
                      name="role"
                      required
                      value={editUser.role}
                      onChange={handleEditInputChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="medcin">Médecin</option>
                      <option value="infirmier">Infirmier</option>
                      <option value="secretaire">Secrétaire</option>
                      <option value="administratif">Administratif</option>
                      <option value="technicien">Technicien</option>
                    </select>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditUserModal(false)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none disabled:opacity-70"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-70 flex items-center space-x-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <span>Mise à jour...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        <span>Enregistrer</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Utilisateurs;