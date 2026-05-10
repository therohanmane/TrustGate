import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * OAuthCallback — catches the redirect from the server after Google OAuth.
 * URL: /oauth/callback?token=<jwt>&_id=<id>&name=<name>&email=<email>
 *
 * Also handles: /oauth/callback?error=oauth_failed
 */
export default function OAuthCallback() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState('Processing…');

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      setStatus('Google sign-in failed. Redirecting…');
      setTimeout(() => nav('/login?error=oauth_failed'), 2000);
      return;
    }

    const _id   = params.get('_id');
    const name  = params.get('name');
    const email = params.get('email');

    // Save to localStorage — same shape as email/password login
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ _id, name, email }));

    setStatus('Signed in! Redirecting to your vault…');
    setTimeout(() => nav('/dashboard'), 800);
  }, [params, nav]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--ink)', fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Spinner */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid rgba(201,168,76,0.15)',
        borderTopColor: '#e8c97a',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 24,
      }}/>
      <p style={{ color: 'var(--slate2)', fontSize: 15 }}>{status}</p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
