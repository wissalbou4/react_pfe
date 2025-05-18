import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token); // Store the token
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(135deg, #2b5876, #4e4376)' }}>
      <div className="card border-0 shadow-lg" style={{ width: '24rem', borderRadius: '15px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <div className="card-body p-5">
          <h3 className="card-title text-center mb-4 fw-bold" style={{ color: '#2b5876' }}>Sign In</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-4 position-relative">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Mail size={18} color="#4e4376" />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4 position-relative">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Lock size={18} color="#4e4376" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control border-start-0 border-end-0 ps-0"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <span 
                  className="input-group-text bg-light border-start-0 cursor-pointer" 
                  onClick={togglePasswordVisibility} 
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} color="#4e4376" /> : <Eye size={18} color="#4e4376" />}
                </span>
              </div>
            </div>
            
            
            
            <button 
              type="submit" 
              className="btn w-100 py-2" 
              style={{ 
                background: 'linear-gradient(135deg, #2b5876, #4e4376)',
                color: 'white',
                borderRadius: '8px'
              }}
            >
              <div className="d-flex align-items-center justify-content-center">
                <LogIn size={18} className="me-2" />
                <span>Login</span>
              </div>
            </button>
          </form>
          
          {message && <div className="mt-3 alert alert-danger">{message}</div>}
          
          
        </div>
      </div>
    </div>
  );
}

export default Login;