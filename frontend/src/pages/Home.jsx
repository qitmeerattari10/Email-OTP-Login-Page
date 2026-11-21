import React from 'react';
import './Home.css';

function Home({ user, onLogout }) {
  return (
    <main className="welcome-page">
      <section className="welcome-card" aria-live="polite">
        <div className="welcome-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m6 12.5 4 4L18.5 8" />
          </svg>
        </div>
        <p className="welcome-label">EMAIL VERIFIED</p>
        <h1>Welcome!</h1>
        <p className="welcome-message">Your email has been verified successfully.</p>
        {user?.email && <p className="welcome-email">{user.email}</p>}
        <button className="welcome-signout" type="button" onClick={onLogout}>
          Sign out
        </button>
      </section>
    </main>
  );
}

export default Home;
