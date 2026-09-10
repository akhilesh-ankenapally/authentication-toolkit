import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [activePage, setActivePage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
  const [user, setUser] = useState(null);
  const [initialLoginUsername, setInitialLoginUsername] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Check existing session token on application mount
  useEffect(() => {
    const verifyExistingSession = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        setLoadingInitial(false);
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        const data = await response.json();

        if (response.ok && data.user) {
          setUser(data.user);
          setToken(storedToken);
          setActivePage('dashboard');
        } else {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
          setActivePage('login');
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    verifyExistingSession();
  }, []);

  const handleLoginSuccess = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setActivePage('dashboard');
  };

  const handleRegistrationSuccess = (registeredUsername) => {
    setInitialLoginUsername(registeredUsername);
    setActivePage('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setActivePage('login');
  };

  if (loadingInitial) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        <div>Initializing Security Module...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {activePage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            switchToRegister={() => setActivePage('register')}
            initialUsername={initialLoginUsername}
          />
        )}

        {activePage === 'register' && (
          <RegisterPage
            onRegistrationSuccess={handleRegistrationSuccess}
            switchToLogin={() => setActivePage('login')}
          />
        )}

        {activePage === 'dashboard' && user && (
          <Dashboard
            user={user}
            token={token}
            onLogout={handleLogout}
          />
        )}
      </main>

      <footer className="footer">
        Cybersecurity Authentication Toolkit | College Assignment Prototype | bcrypt • JWT • Rate Limiting • MongoDB
      </footer>
    </div>
  );
}
