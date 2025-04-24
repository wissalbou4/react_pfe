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

export default MedcinDashboard;