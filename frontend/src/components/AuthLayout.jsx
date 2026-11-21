import React from 'react';
import './AuthLayout.css';

function Brand({ light = false }) {
  return (
    <a className={`brand${light ? ' brand--light' : ''}`} href="/" aria-label="Mailflow home">
      <span className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4.5 7.5 12 13l7.5-5.5" />
          <path d="M5.5 5.5h13A1.5 1.5 0 0 1 20 7v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17V7a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
      </span>
      <span>mailflow</span>
    </a>
  );
}

function AuthLayout({ children, step, eyebrow, headline, description }) {
  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-label="Welcome to Mailflow">
        <div className="visual-glow visual-glow--one" />
        <div className="visual-glow visual-glow--two" />
        <div className="visual-grid" />
        <div className="visual-top">
          <Brand light />
          <span className="visual-tag">SIMPLE. SAFE. YOURS.</span>
        </div>

        <div className="visual-content">
          <div className="visual-overline">
            <span className="online-dot" />
            A better way to sign in
          </div>
          <h1>{headline}</h1>
          <p>{description}</p>

          <div className="visual-card">
            <div className="visual-card-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 10V7a5 5 0 0 1 10 0v3M5.5 10h13v10h-13z" />
                <path d="m10 15 1.4 1.4L14.5 13" />
              </svg>
            </div>
            <div>
              <strong>Your inbox is your key</strong>
              <span>No passwords to remember or reset</span>
            </div>
            <span className="secure-check" aria-label="Secure">✓</span>
          </div>
        </div>

        <div className="visual-footer">
          <span>Thoughtful security, built in.</span>
          <span className="visual-step">{step} <i /> 02</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-top">
          <Brand />
          <span className="auth-help">Need help? Check with your administrator</span>
        </div>

        <div className="auth-content">
          <div className="auth-eyebrow">{eyebrow}</div>
          {children}
        </div>

        <footer className="auth-panel-footer">
          <span>© {new Date().getFullYear()} Mailflow</span>
          <span className="privacy-note"><span className="tiny-lock">⌑</span> Your data stays yours</span>
        </footer>
      </section>
    </main>
  );
}

export default AuthLayout;
