import React, { useState } from 'react';
import { LogIn, User, Lock, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage({ onLoginSuccess, switchToRegister, initialUsername = '' }) {
  const [identifier, setIdentifier] = useState(initialUsername || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Quick Autofill for fast demonstration
  const handleAutofill = () => {
    if (!identifier) setIdentifier('student_demo');
    setPassword('CyberSec@2026!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRateLimited(false);

    if (!identifier.trim() || !password) {
      setError('Please enter your username/email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (response.status === 429) {
        setRateLimited(true);
        throw new Error(data.message || 'Security Control Triggered: Too many failed login attempts. IP temporarily restricted.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials.');
      }

      // Save token in localStorage (Basic Session Management)
      localStorage.setItem('auth_token', data.token);
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="cyber-card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <LogIn size={24} color="var(--accent-cyan)" /> User Login
            </h2>
            <p className="card-subtitle">Authenticate identity & initiate JWT session</p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleAutofill}
            title="Autofill standard demo credentials"
          >
            <Sparkles size={14} color="var(--accent-cyan)" /> Autofill
          </button>
        </div>

        {error && (
          <div className={`alert ${rateLimited ? 'alert-warning' : 'alert-error'}`}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div className="form-input-wrapper">
              <User size={16} className="form-input-icon" />
              <input
                id="login-identifier"
                type="text"
                className="form-input"
                placeholder="Username or registered email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <Lock size={16} className="form-input-icon" />
              <input
                id="login-password"
                type="password"
                className="form-input mono"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '1.25rem' }}
          >
            {loading ? 'Verifying Cryptographic Hash...' : 'Authenticate & Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Need an account?</span>
            <span
              style={{ color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
              onClick={switchToRegister}
            >
              Register Here
            </span>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span className="security-tag">Rate Limit: 5 attempts/15m</span>
            <span className="security-tag">Auth: JWT HS256</span>
          </div>
        </div>
      </div>
    </div>
  );
}
