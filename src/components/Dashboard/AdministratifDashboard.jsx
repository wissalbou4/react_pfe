import React from 'react';
import Statistique from '../../Documents/statistique'; 
import Utilisateurs from '../../Documents/Utilisateurs';

const AdministratifDashboard = ({ activeComponent ,users,handleDeleteUser,fetchAllUsers}) => {
  return (
    <div className="container-fluid p-0">
      <div className="min-vh-100 p-4">
        {activeComponent === 'dashboard' && <Statistique />}
        {activeComponent ==='utilisateur'&& <Utilisateurs users={users} handleDeleteUser={handleDeleteUser} 
        fetchAllUsers={fetchAllUsers}/>}
      </div>
    </div>
  );
};

export default AdministratifDashboard;