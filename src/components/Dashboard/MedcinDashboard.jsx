// import React from 'react';
// import Ordonnance from '../../Documents/Ordonnance'; 
// import ListeRendezvous from '../../Documents/ListeRendezvous';

// const MedcinDashboard = ({ activeComponent ,users,handleDeleteUser,fetchAllUsers}) => {
//   return (
//     <div className="container-fluid p-0">
//       <div className="min-vh-100 p-4">
//         {activeComponent === 'dashboard' && <Ordonnance />}
//         {activeComponent ==='utilisateur'&& <ListeRendezvous users={users} handleDeleteUser={handleDeleteUser} 
//         fetchAllUsers={fetchAllUsers}/>}
//       </div>
//     </div>
//   );
// };

// export default MedcinDashboard;
import React from 'react';
import ConsulteRendezVous from '../../Documents/ListeRendezvous';
import  Ordonnances from '../../Documents/Ordonnance'; 
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
       {activeComponent === 'ordonnance' && <Ordonnances />}  
  </div>
  </div>
);
}

export default MedcinDashboard;