import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUser,
  FaUserInjured,
  FaUserAlt,
  FaCalendarCheck,
  FaFileMedical,
  FaFileInvoice,
  FaCalendarAlt,
  FaTools,
  FaWrench,
  FaHome,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdministratifDashboard from './components/Dashboard/AdministratifDashboard';
import MedcinDashboard from './components/Dashboard/MedcinDashboard';
import SecretaireDashboard from './components/Dashboard/SecretaireDashboard';


const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialisation du thème
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(savedTheme);
    setDarkMode(savedTheme === 'dark');

    // Vérifier si l'écran est petit au chargement
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    // Chargement des données utilisateur
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        handleLogout();
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userData?.role === 'administratif') {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:8000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    }
  }, [userData]);

  const toggleDarkMode = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    document.documentElement.classList.remove(darkMode ? 'dark' : 'light');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const renderDashboardContent = () => {
    if (!userData) return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
    
    const props = { activeComponent, setActiveComponent, users, handleDeleteUser };

    switch (userData.role) {
      case 'medcin': return <MedcinDashboard {...props} />;
      case 'secretaire': return <SecretaireDashboard {...props} />;
      case 'administratif': return <AdministratifDashboard {...props} />;
    
      default: return (
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400">
          Aucun tableau de bord disponible pour votre rôle
        </div>
      );
    }
  };

  const renderSidebarItems = () => {
    if (!userData) return null;

    const roleConfig = {
     
      administratif: [
        { id: 'dashboard', icon: <FaHome />, label: 'Dashboard' },
        { id: 'utilisateur', icon: <FaUser />, label: 'Utilisateurs' },
       
      ],
      secretaire: [
        { id: 'patient', icon: <FaUserInjured />, label: 'Patients' },
        { id: 'rendez_vous', icon: <FaCalendarAlt />, label: 'Rendez-vous' },
        { id: 'facture', icon: <FaFileInvoice />, label: 'Factures' },
       
      ],
      medcin: [
        { id: 'rendez_vous', icon: <FaCalendarCheck />, label: 'Liste Rendez-vous' },
        { id: 'ordonnance', icon: <FaFileMedical />, label: 'Ordonnances' }
      ],
      
    };

    return roleConfig[userData.role]?.map((item) => (
      <button
        key={item.id}
        onClick={() => {
          setActiveComponent(item.id);
          if (window.innerWidth < 768) {
            setSidebarOpen(false);
          }
        }}
        className={`w-full flex items-center p-3 mb-2 rounded-xl transition-all duration-200
          hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400
          ${activeComponent === item.id 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' 
            : 'text-gray-700 dark:text-gray-300'}`}
      >
        <span className={`mr-3 text-lg ${activeComponent === item.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {item.icon}
        </span>
        <span className="font-medium">{item.label}</span>
      </button>
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors duration-200"
      >
        {sidebarOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
      </button>

      {/* Sidebar */}
      <div 
        className={`bg-white dark:bg-gray-800 shadow-xl fixed h-full z-30 transition-all duration-300 ${
          sidebarOpen ? 'left-0' : '-left-64 md:left-0'
        } w-64 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900`}
      >
        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashbord</h2>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="text-amber-400" />
            ) : (
              <FaMoon className="text-blue-600" />
            )}
          </button>
        </div>

        {userData && (
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold">
                {userData?.name?.charAt(0).toUpperCase() || <FaUserAlt />}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800 dark:text-white">{userData.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">{userData.role}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="p-4 overflow-y-auto h-full">
          {renderSidebarItems()}
          
          <div className="pt-6 mt-6 border-t dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-3" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''} p-4 md:p-8`}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {userData ? `Bienvenue, ${userData.name} !` : 'Chargement...'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          
           
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700 card-hover">
            {renderDashboardContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;