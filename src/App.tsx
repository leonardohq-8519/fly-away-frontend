import React, { useEffect, useState } from 'react'
import api from './api'
import Register from './components/Register';
import Login from './components/Login';
import Search from './components/Search';
import MyBookings from './components/MyBookings';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import './App.css'

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState<{username : string} | null>(null);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try{
      const response = await api.get('/users/current');
      setUser(response.data);
    } catch (error){
      console.error("Error al obtener usuario. El token podría estar expirado.", error);
      handleLogout();
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }

  return (
    <div>
      <nav style={{ width: '100%', padding: '1rem', background: '#1c1919', marginBottom: '1rem' }}>
        <h2>Fly Away</h2>
        <div style={{ marginLeft: 'auto' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/my-bookings" style={{ marginRight: '1rem' }}>Mis Reservas</Link>
              <span>¡Bienvenido/a, <strong>{user.username}</strong>!</span>
              <button onClick={handleLogout} style={{ padding: '0.3rem 0.6rem', cursor: 'pointer' }}>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login">Iniciar Sesión</Link>
              <Link to="/register">Registrarse</Link>
            </div>
          )}
        </div>
      </nav>

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLoginSuccess={fetchCurrentUser}/>} />
          <Route path="/search" element={<Search />} />
          <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
