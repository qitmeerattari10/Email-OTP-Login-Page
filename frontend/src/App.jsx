import React, { useEffect, useState } from 'react';
import { apiRequest } from './lib/api.js';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';

const TOKEN_KEY = 'emailOtpToken';
const EMAIL_KEY = 'emailOtpAddress';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState(() => sessionStorage.getItem(EMAIL_KEY) || '');
  const [screen, setScreen] = useState(() => {
    if (localStorage.getItem(TOKEN_KEY)) return 'loading';
    return sessionStorage.getItem(EMAIL_KEY) ? 'verify' : 'login';
  });
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');
  const [sessionError, setSessionError] = useState('');
  const [profileAttempt, setProfileAttempt] = useState(0);

  useEffect(() => {
    if (!token) return undefined;

    let active = true;
    setScreen('loading');
    setSessionError('');

    apiRequest('/user/profile', { token })
      .then(({ user: profile }) => {
        if (!active) return;
        setUser(profile);
        setScreen('home');
      })
      .catch((error) => {
        if (!active) return;

        if (error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setScreen('login');
          setNotice('Your session expired. Please sign in again.');
          return;
        }

        setSessionError(error.message);
        setScreen('session-error');
      });

    return () => {
      active = false;
    };
  }, [token, profileAttempt]);

  function handleEmailSent(nextEmail) {
    setEmail(nextEmail);
    sessionStorage.setItem(EMAIL_KEY, nextEmail);
    setNotice('');
    setScreen('verify');
  }

  function handleVerified({ token: verifiedToken, email: verifiedEmail }) {
    localStorage.setItem(TOKEN_KEY, verifiedToken);
    sessionStorage.removeItem(EMAIL_KEY);
    setEmail(verifiedEmail);
    setToken(verifiedToken);
    setUser({ email: verifiedEmail, isVerified: true });
    setScreen('home');
  }

  function handleBackToLogin() {
    sessionStorage.removeItem(EMAIL_KEY);
    setEmail('');
    setNotice('');
    setScreen('login');
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail('');
    setUser(null);
    setSessionError('');
    setNotice('You have been signed out securely.');
    setScreen('login');
  }

  if (screen === 'loading') {
    return (
      <main className="app-status">
        <span className="loading-mark" aria-hidden="true" />
        <p>Securing your session…</p>
      </main>
    );
  }

  if (screen === 'session-error') {
    return (
      <main className="app-status">
        <div className="status-icon status-icon--error" aria-hidden="true">!</div>
        <p className="status-title">We couldn’t load your profile</p>
        <p className="status-copy">{sessionError}</p>
        <div className="status-actions">
          <button
            className="button button--primary"
            type="button"
            onClick={() => setProfileAttempt((attempt) => attempt + 1)}
          >
            Try again
          </button>
          <button className="button button--quiet" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </main>
    );
  }

  if (screen === 'home') {
    return <Home user={user} onLogout={handleLogout} />;
  }

  if (screen === 'verify') {
    return (
      <VerifyOTP
        email={email}
        onBack={handleBackToLogin}
        onVerified={handleVerified}
      />
    );
  }

  return <Login onEmailSent={handleEmailSent} notice={notice} />;
}

export default App;