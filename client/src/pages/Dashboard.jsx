import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Key, Clock, Database, LogOut, CheckCircle, RefreshCw, Lock, Terminal } from 'lucide-react';

export default function Dashboard({ user, token, onLogout }) {
  const [copied, setCopied] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifySession = async () => {
    setVerifying(true);
    setVerifyStatus(null);
    try {
      const response = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setVerifyStatus({
          valid: true,
          message: 'JWT Token verified by server. Session is active.',
          session: data.session
        });
      } else {
        setVerifyStatus({
          valid: false,
          message: data.message || 'Session verification failed.'
        });
      }
    } catch (err) {
      setVerifyStatus({ valid: false, message: 'Server communication error.' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="main-container">
      {/* Welcome Banner */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
            Welcome, <span style={{ color: 'var(--accent-cyan)' }}>{user?.username || 'Student'}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Authenticated Session Active | Cybersecurity Assignment Prototype
          </p>
        </div>
        <button id="dashboard-logout-btn" className="btn-danger" onClick={onLogout}>
          <LogOut size={16} /> Terminate Session (Logout)
        </button>
      </div>

      <div className="dashboard-grid">
        {/* User Identity & Profile Card */}
        <div className="cyber-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <User size={20} color="var(--accent-cyan)" /> User Profile
              </h3>
              <p className="card-subtitle">Stored in MongoDB Single User Collection</p>
            </div>
            <span className="status-pill" style={{ borderColor: 'var(--accent-green)' }}>
              <span className="status-dot"></span>
              AUTHENTICATED
            </span>
          </div>

          <div className="info-badge">
            <span className="info-label">Username:</span>
            <span className="info-value">{user?.username}</span>
          </div>

          <div className="info-badge">
            <span className="info-label">Email Address:</span>
            <span className="info-value">{user?.email}</span>
          </div>

          <div className="info-badge">
            <span className="info-label">Account ID:</span>
            <span className="info-value">{user?.id || user?._id || 'USR-2026-X'}</span>
          </div>

          <div className="info-badge">
            <span className="info-label">Created At:</span>
            <span className="info-value">
              {user?.createdAt ? new Date(user.createdAt).toLocaleString() : new Date().toLocaleString()}
            </span>
          </div>
        </div>

        {/* Session Management & JWT Inspector Card */}
        <div className="cyber-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Key size={20} color="var(--accent-cyan)" /> Session Management
              </h3>
              <p className="card-subtitle">JSON Web Token (JWT) Bearer Authentication</p>
            </div>
            <button
              className="btn-secondary"
              onClick={handleVerifySession}
              disabled={verifying}
              title="Test JWT verification on protected server endpoint"
            >
              <RefreshCw size={13} className={verifying ? 'spin' : ''} /> {verifying ? 'Verifying...' : 'Verify Token'}
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>ACTIVE JWT SESSION TOKEN:</span>
              <span
                style={{ color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={handleCopyToken}
              >
                {copied ? 'Copied!' : 'Copy Token'}
              </span>
            </div>
            <div className="token-preview">
              {token || 'No token found in active session'}
            </div>
          </div>

          {verifyStatus && (
            <div className={`alert ${verifyStatus.valid ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '0.75rem' }}>
              {verifyStatus.valid ? <CheckCircle size={16} /> : <Lock size={16} />}
              <div>
                <div>{verifyStatus.message}</div>
                {verifyStatus.session && (
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                    Expires: {new Date(verifyStatus.session.expiresAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span className="security-tag">Header: Bearer Token</span>
            <span className="security-tag">Storage: localStorage</span>
            <span className="security-tag">Validity: 1 Hour</span>
          </div>
        </div>
      </div>

      {/* Security Controls & Implementation Highlights Card */}
      <div className="cyber-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ShieldCheck size={20} color="var(--accent-green)" /> Implemented Security Controls
            </h3>
            <p className="card-subtitle">Overview of cybersecurity mechanisms implemented for this assignment</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              1. Password Validation
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Enforces 8+ characters, uppercase, lowercase, numbers, and symbols checked both on client and server.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              2. Bcrypt Hashing & Salt
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Passwords are never stored in plaintext. Hashed using salted bcrypt with 10 cost rounds to resist rainbow tables.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              3. Rate Limiting Control
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Throttles repeated authentication requests (5 attempts per IP window) to mitigate brute-force and dictionary attacks.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              4. JWT Session State
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              Stateless cryptographically signed tokens transmitted via Authorization header protecting private endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
