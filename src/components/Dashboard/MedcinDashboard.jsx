
import React from 'react';
import Ordonnance from '../../Documents/Ordonnance'; 


const MedcinDashboard = ({ activeComponent ,users,handleDeleteUser,fetchAllUsers}) => {
  return (
    
    <div className="container-fluid p-0">
      <div className="min-vh-100 p-4">
        {activeComponent === 'dashboard' && <Ordonnance />}
       
      </div>
    </div>
  );
};
export default MedcinDashboard;