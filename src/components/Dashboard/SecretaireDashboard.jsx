// SecretaireDashboard.js
import React, { useEffect } from 'react';
import Patient from '../../Documents/Patient'; // Correct relative path
import RendezVous from '../../Documents/Rendezvous';
import Facture from '../../Documents/Facture'; // Import the Facture component // Import the CongesSecretaire component
import Statistique from '../../Documents/statistique'; 
const SecretaireDashboard = ({ activeComponent,setActiveComponent }) => {
    useEffect(() => {
      setActiveComponent('dashboard');
    }, [setActiveComponent]);
  return (
    <div>
      
    <div>
       {activeComponent === 'dashboard' && <Statistique />}

    </div>

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
         {/* Render Statistique component when activeComponent is 'dashboard' */}
        
      {activeComponent === 'patient' && <Patient />}
      {activeComponent === 'rendez_vous' && <RendezVous />}

      {activeComponent === 'facture' && <Facture />} {/* Render Facture */}
    </div>
    </div>
  );
};

export default SecretaireDashboard;