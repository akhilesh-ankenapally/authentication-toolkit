import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export const checkPasswordCriteria = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

export default function PasswordStrengthMeter({ password = '' }) {
  const criteria = checkPasswordCriteria(password);
  
  // Calculate score (0-5)
  const score = Object.values(criteria).filter(Boolean).length;

  let strengthLabel = 'Too Short';
  let strengthClass = 'active-weak';
  let activeBars = 1;

  if (password.length === 0) {
    strengthLabel = 'Enter Password';
    strengthClass = '';
    activeBars = 0;
  } else if (score <= 2) {
    strengthLabel = 'Weak (Insecure)';
    strengthClass = 'active-weak';
    activeBars = 1;
  } else if (score === 3 || score === 4) {
    strengthLabel = 'Medium (Acceptable)';
    strengthClass = 'active-medium';
    activeBars = 2;
  } else if (score === 5) {
    strengthLabel = 'Strong (Cyber-Compliant)';
    strengthClass = 'active-strong';
    activeBars = 4;
  }

  return (
    <div className="strength-meter-container">
      <div className="strength-header">
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {score === 5 ? <ShieldCheck size={14} color="#10b981" /> : <ShieldAlert size={14} color="#f59e0b" />}
          Password Strength:
        </span>
        <span style={{ 
          fontWeight: 600, 
          fontFamily: 'var(--font-mono)',
          color: score === 5 ? '#10b981' : score >= 3 ? '#f59e0b' : '#ef4444' 
        }}>
          {strengthLabel}
        </span>
      </div>

      <div className="strength-bars">
        {[1, 2, 3, 4].map((barIndex) => (
          <div
            key={barIndex}
            className={`strength-bar ${barIndex <= activeBars ? strengthClass : ''}`}
          />
        ))}
      </div>

      <ul className="criteria-list">
        <li className={`criteria-item ${criteria.length ? 'met' : ''}`}>
          {criteria.length ? <Check size={12} /> : <X size={12} />} At least 8 characters
        </li>
        <li className={`criteria-item ${criteria.uppercase ? 'met' : ''}`}>
          {criteria.uppercase ? <Check size={12} /> : <X size={12} />} Uppercase letter (A-Z)
        </li>
        <li className={`criteria-item ${criteria.lowercase ? 'met' : ''}`}>
          {criteria.lowercase ? <Check size={12} /> : <X size={12} />} Lowercase letter (a-z)
        </li>
        <li className={`criteria-item ${criteria.number ? 'met' : ''}`}>
          {criteria.number ? <Check size={12} /> : <X size={12} />} Number (0-9)
        </li>
        <li className={`criteria-item ${criteria.special ? 'met' : ''}`}>
          {criteria.special ? <Check size={12} /> : <X size={12} />} Special symbol (!@#$...)
        </li>
      </ul>
    </div>
  );
}
