import React from 'react';
import { Shield, Lock, UserPlus, LogIn, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, user, onLogout }) {
  return (
    <header className="cyber-header">
      <div className="brand">
        <div className="brand-icon">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="brand-title">CYBERSECURITY AUTH TOOLKIT</h1>
          <div className="brand-subtitle">COLLEGE ASSIGNMENT PROTOTYPE</div>
        </div>
      </div>

      <div className="system-status">
        <div className="status-pill">
          <span className="status-dot"></span>
          <span>API: ONLINE</span>
        </div>
        <div className="status-pill" style={{ display: 'none' }}>
          <span>BCRYPT: 10 ROUNDS</span>
        </div>

        <nav className="nav-links">
          {!user ? (
            <>
              <button
                id="nav-login-btn"
                className={`nav-btn ${activePage === 'login' ? 'active' : ''}`}
                onClick={() => setActivePage('login')}
              >
                <LogIn size={15} /> Login
              </button>
              <button
                id="nav-register-btn"
                className={`nav-btn ${activePage === 'register' ? 'active' : ''}`}
                onClick={() => setActivePage('register')}
              >
                <UserPlus size={15} /> Register
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-dashboard-btn"
                className={`nav-btn ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActivePage('dashboard')}
              >
                <LayoutDashboard size={15} /> Dashboard
              </button>
              <button
                id="nav-logout-btn"
                className="btn-danger"
                onClick={onLogout}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
