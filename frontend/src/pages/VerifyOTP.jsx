import React, { useEffect, useState } from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import { apiRequest } from '../lib/api.js';
import './VerifyOTP.css';

function VerifyOTP({ email, onBack, onVerified }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds === 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  async function handleVerify(event) {
    event.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code from your email.');
      return;
    }

    setVerifying(true);
    try {
      const data = await apiRequest('/auth/verify-otp', {
        body: { email, otp },
      });
      onVerified(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setError('');
    setResending(true);

    try {
      await apiRequest('/auth/send-otp', { body: { email } });
      setOtp('');
      setSeconds(30);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout
      step="02"
      eyebrow="ONE LAST STEP"
      headline={<>A little code.<br />A lot of peace.</>}
      description="We use a short-lived verification code to make sure it’s really you. Your account stays protected, without the password hassle."
    >
      <div className="verify-card">
        <button className="back-link" type="button" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5m7 7-7-7 7-7" />
          </svg>
          Change email
        </button>

        <h2>Check your inbox</h2>
        <p className="verify-intro">
          We sent a 6-digit sign-in code to<br />
          <strong>{email}</strong>
        </p>

        <form className="verify-form" onSubmit={handleVerify} noValidate>
          <label className="field-label" htmlFor="otp">Verification code</label>
          <input
            className="text-input otp-input"
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="000000"
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
              setError('');
            }}
            aria-describedby={error ? 'otp-error' : 'otp-hint'}
            required
          />
          <span className="otp-hint" id="otp-hint">Enter the code exactly as it appears in the email.</span>

          {error && <p className="form-error" id="otp-error" role="alert">{error}</p>}

          <button className="button button--primary submit-button" type="submit" disabled={verifying}>
            {verifying ? (
              <>
                <span className="button-spinner" aria-hidden="true" />
                Verifying…
              </>
            ) : (
              <>
                Verify and continue
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="resend-row">
          <span>Didn’t receive the email?</span>
          <button type="button" onClick={handleResend} disabled={seconds > 0 || resending}>
            {resending ? 'Sending…' : seconds > 0 ? `Resend in 0:${String(seconds).padStart(2, '0')}` : 'Resend code'}
          </button>
        </div>

        <div className="secure-note">
          <span className="secure-note-icon" aria-hidden="true">✦</span>
          For your security, this code expires after a short time.
        </div>
      </div>
    </AuthLayout>
  );
}

export default VerifyOTP;