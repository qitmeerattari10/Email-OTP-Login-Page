import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import { apiRequest } from '../lib/api.js';
import './Login.css';

function Login({ onEmailSent, notice }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address to continue.');
      return;
    }

    setSending(true);
    try {
      const data = await apiRequest('/auth/send-otp', {
        body: { email: normalizedEmail },
      });
      onEmailSent(data.email || normalizedEmail);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthLayout
      step="01"
      eyebrow="WELCOME BACK"
      headline={<>Your inbox.<br />Your way in.</>}
      description="Sign in securely with a one-time code sent straight to your email. No password, no fuss."
    >
      <div className="login-card">
        <h2>Sign in to Mailflow</h2>
        <p className="auth-intro">Enter your email and we’ll send you a secure sign-in code.</p>

        {notice && <p className="form-notice" role="status">{notice}</p>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="email">Email address</label>
          <div className="email-field-wrap">
            <span className="input-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="5" width="17" height="14" rx="2" />
                <path d="m4.5 7 7.5 5.5L19.5 7" />
              </svg>
            </span>
            <input
              className="text-input email-input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              aria-describedby={error ? 'login-error' : undefined}
              required
            />
          </div>

          {error && <p className="form-error" id="login-error" role="alert">{error}</p>}

          <button className="button button--primary submit-button" type="submit" disabled={sending}>
            {sending ? (
              <>
                <span className="button-spinner" aria-hidden="true" />
                Sending code…
              </>
            ) : (
              <>
                Send sign-in code
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-assurance">
          <span className="assurance-icon" aria-hidden="true">✓</span>
          <span>We’ll never share your email or send unwanted messages.</span>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;