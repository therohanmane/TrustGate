import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AUTH_LEFT = {
  width: '45%',
  background: 'linear-gradient(160deg,var(--ink2) 0%,var(--ink) 60%)',
  display: 'flex', flexDirection: 'column', justifyContent: 'center',
  padding: '80px 60px',
  borderRight: '1px solid var(--border)',
  position: 'relative', overflow: 'hidden',
};
const AUTH_RIGHT = {
  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '80px 60px', background: 'var(--ink)',
};
const BOX = { width: '100%', maxWidth: 420 };
const INPUT = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '14px 18px 14px 48px', fontSize: 15, color: 'var(--cream)',
  fontFamily: "'DM Sans',sans-serif", outline: 'none', transition: 'all 0.2s',
};
const INPUT_WRAP = { position: 'relative' };
const ICON = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--slate)', pointerEvents: 'none' };
const LABEL = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate2)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 };
const BTN = {
  width: '100%', background: 'linear-gradient(135deg,var(--gold),var(--gold2))',
  color: 'var(--ink)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15,
  padding: 16, borderRadius: 10, border: 'none', cursor: 'pointer', marginTop: 8, letterSpacing: '0.01em', transition: 'all 0.2s',
};
const FEAT_ROW = { display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, color: 'var(--slate2)' };
const FEAT_ICON = {
  width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.1)',
  border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontSize: 16, flexShrink: 0,
};

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [err,   setErr]   = useState('');
  const [loading, setLoading] = useState(false);
  const [focEmail, setFocEmail] = useState(false);
  const [focPass,  setFocPass]  = useState(false);

  const focStyle = { borderColor: 'rgba(201,168,76,0.5)', background: 'rgba(201,168,76,0.04)', boxShadow: '0 0 0 3px rgba(201,168,76,0.08)' };

  const handleLogin = async () => {
    if (!email || !pass) { setErr('Please enter your email and password.'); return; }
    setErr(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password: pass });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      nav('/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', background: 'var(--ink)' }}>
      {/* LEFT PANEL */}
      <div style={AUTH_LEFT}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)', borderRadius: '50%' }} />
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--gold2)', marginBottom: 48, position: 'relative' }}>
          Trust<span style={{ color: 'var(--cream)', opacity: 0.5 }}>Gate</span>
        </div>
        <h2 style={{ fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 800, color: 'var(--cream)', lineHeight: 1.1, letterSpacing: -1, marginBottom: 20, position: 'relative' }}>
          Access your<br />
          <span style={{ background: 'linear-gradient(135deg,var(--gold),var(--gold3))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            secure vault
          </span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--slate2)', lineHeight: 1.7, marginBottom: 48, fontWeight: 300, position: 'relative' }}>
          Your encrypted digital legacy awaits. Everything you've stored for your family — safe, private, and ready when needed.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          {[['🔐','End-to-end AES-256 encrypted'],['👁️','Zero-knowledge architecture'],['⚡','Instant secure access'],['🛡️','Multi-factor protection']].map(([icon, text]) => (
            <div key={text} style={FEAT_ROW}><div style={FEAT_ICON}>{icon}</div>{text}</div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={AUTH_RIGHT}>
        <div style={BOX}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: 'var(--cream)', letterSpacing: '-0.5px' }}>Welcome back</h2>
            <span style={{ fontSize: 13, color: 'var(--slate)', cursor: 'pointer' }} onClick={() => nav('/')}>← Back</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--slate2)', marginBottom: 40 }}>Sign in to access your digital legacy vault</p>

          {err && (
            <div style={{ background: 'rgba(224,90,90,0.1)', border: '1px solid rgba(224,90,90,0.3)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#f08080', marginBottom: 20 }}>
              {err}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={LABEL}>Email Address</label>
            <div style={INPUT_WRAP}>
              <span style={ICON}>✉️</span>
              <input style={{ ...INPUT, ...(focEmail ? focStyle : {}) }} type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey}
                onFocus={() => setFocEmail(true)} onBlur={() => setFocEmail(false)} />
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={LABEL}>Password</label>
            <div style={INPUT_WRAP}>
              <span style={ICON}>🔒</span>
              <input style={{ ...INPUT, ...(focPass ? focStyle : {}) }} type="password" placeholder="Your secure password"
                value={pass} onChange={e => setPass(e.target.value)} onKeyDown={onKey}
                onFocus={() => setFocPass(true)} onBlur={() => setFocPass(false)} />
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: 'var(--slate2)', cursor: 'pointer' }} onClick={() => nav('/forgot-password')}>
              Forgot password?
            </span>
          </div>

          <button style={{ ...BTN, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in…' : 'Access Vault →'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 13, fontSize: 14, color: 'var(--cream)', fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--slate2)' }}>
            New to TrustGate?{' '}
            <span style={{ color: 'var(--gold2)', cursor: 'pointer', fontWeight: 600 }} onClick={() => nav('/signup')}>Create your vault</span>
          </p>
        </div>
      </div>
    </div>
  );
}
