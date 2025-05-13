 HEAD

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

import React from 'react';
import ConsulteRendezVous from '../../Documents/ListeRendezvous';

const MedcinDashboard = ({ activeComponent }) => {
 
return (
  <div>
    
  <div
  className=" min-h-screen p-6"
  style={{
    backgroundImage:` url('bg-banner.jpg'`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  }}
>
      {activeComponent ==='rendez_vous' && <ConsulteRendezVous />}    
  </div>
  </div>
);
}

d6e5dc975004c6f78915482fe6f26f0b7b1af0d6
export default MedcinDashboard;