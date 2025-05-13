import React , { useEffect } from 'react';
import ConsulteRendezVous from '../../Documents/ListeRendezvous';

const MedcinDashboard = ({ activeComponent,setActiveComponent  }) => {
  useEffect(() => {
    setActiveComponent('rendez_vous');
  }, [setActiveComponent]);
return (
  <div>
    
  <div
  className=" min-h-screen p-6"
  style={{
  
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