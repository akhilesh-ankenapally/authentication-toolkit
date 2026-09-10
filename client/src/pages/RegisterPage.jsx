import React, { useState } from 'react';
import { User, Mail, Lock, Key, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import PasswordStrengthMeter, { checkPasswordCriteria } from '../components/PasswordStrengthMeter';

export default function RegisterPage({ onRegistrationSuccess, switchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Autofill for 5-minute evaluator demonstration
  const handleAutofill = () => {
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    setUsername(`student_${randomSuffix}`);
    setEmail(`student_${randomSuffix}@university.edu`);
    setPassword('CyberSec@2026!');
    setConfirmPassword('CyberSec@2026!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Frontend validation
    if (!username.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    const criteria = checkPasswordCriteria(password);
    const allMet = Object.values(criteria).every(Boolean);
    if (!allMet) {
      setError('Password does not satisfy all cybersecurity policy criteria.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (data.errors ? data.errors.join(', ') : 'Registration failed.'));
      }

      setSuccessMsg('Registration successful! Salted bcrypt hash generated in database.');
      setTimeout(() => {
        onRegistrationSuccess(username);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="cyber-card" style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <ShieldCheck size={24} color="var(--accent-cyan)" /> User Registration
            </h2>
            <p className="card-subtitle">Enforcing password complexity & salted bcrypt hashing</p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleAutofill}
            title="Autofill valid student credentials for quick evaluation"
          >
            <Sparkles size={14} color="var(--accent-cyan)" /> Demo Autofill
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg} Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="form-input-wrapper">
              <User size={16} className="form-input-icon" />
              <input
                id="register-username"
                type="text"
                className="form-input"
                placeholder="e.g. cyber_analyst"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrapper">
              <Mail size={16} className="form-input-icon" />
              <input
                id="register-email"
                type="email"
                className="form-input"
                placeholder="analyst@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <Lock size={16} className="form-input-icon" />
              <input
                id="register-password"
                type="password"
                className="form-input mono"
                placeholder="Enter strong password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Live Password Strength Meter */}
            <PasswordStrengthMeter password={password} />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="form-input-wrapper">
              <Key size={16} className="form-input-icon" />
              <input
                id="register-confirm-password"
                type="password"
                className="form-input mono"
                placeholder="Re-enter password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '1.25rem' }}
          >
            {loading ? 'Processing Cryptographic Hash...' : 'Create Secure Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <span
            style={{ color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={switchToLogin}
          >
            Go to Login
          </span>
        </p>
      </div>
    </div>
  );
}
