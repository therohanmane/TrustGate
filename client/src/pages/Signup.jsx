import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

/* ── Shared tokens ─────────────────────────────────────────────── */
const INPUT_BASE = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '14px 18px', fontSize: 15, color: 'var(--cream)',
  fontFamily: "'DM Sans',sans-serif", outline: 'none', transition: 'all 0.2s',
};
const INPUT_ICON = { ...INPUT_BASE, paddingLeft: 48 };
const INPUT_FOC  = { borderColor: 'rgba(201,168,76,0.5)', background: 'rgba(201,168,76,0.04)', boxShadow: '0 0 0 3px rgba(201,168,76,0.08)' };
const ICON_WRAP  = { position: 'relative' };
const ICON_POS   = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--slate)', pointerEvents: 'none' };
const LABEL      = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate2)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 };
const BTN_PRIMARY = {
  width: '100%', background: 'linear-gradient(135deg,var(--gold),var(--gold2))',
  color: 'var(--ink)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15,
  padding: 16, borderRadius: 10, border: 'none', cursor: 'pointer', marginTop: 8, letterSpacing: '0.01em', transition: 'all 0.2s',
};
const BTN_GHOST = { ...BTN_PRIMARY, background: 'rgba(255,255,255,0.06)', color: 'var(--cream)' };
const SELECT_S = {
  ...INPUT_BASE, appearance: 'none', cursor: 'pointer',
};

/* ── SmartInput ────────────────────────────────────────────────── */
function SmartInput({ icon, type = 'text', value, onChange, placeholder, maxLength, onInput }) {
  const [foc, setFoc] = useState(false);
  return (
    <div style={ICON_WRAP}>
      <span style={ICON_POS}>{icon}</span>
      <input
        style={{ ...INPUT_ICON, ...(foc ? INPUT_FOC : {}) }}
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        maxLength={maxLength} onInput={onInput}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
      />
    </div>
  );
}

function PlainInput({ type = 'text', value, onChange, placeholder, style: sx }) {
  const [foc, setFoc] = useState(false);
  return (
    <input
      style={{ ...INPUT_BASE, ...(foc ? INPUT_FOC : {}), ...sx }}
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
    />
  );
}

/* ── Left panel (same across all steps) ──────────────────────── */
function AuthLeft({ nav }) {
  return (
    <div style={{
      width: '45%', background: 'linear-gradient(160deg,var(--ink2) 0%,var(--ink) 60%)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '80px 60px', borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle,rgba(201,168,76,0.06)0%,transparent 70%)', borderRadius: '50%' }} />
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--gold2)', marginBottom: 48, position: 'relative' }}>
        Trust<span style={{ color: 'var(--cream)', opacity: 0.5 }}>Gate</span>
      </div>
      <h2 style={{ fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 800, color: 'var(--cream)', lineHeight: 1.1, letterSpacing: -1, marginBottom: 20, position: 'relative' }}>
        Secure your<br />
        <span style={{ background: 'linear-gradient(135deg,var(--gold),var(--gold3))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          family's digital future
        </span>
      </h2>
      <p style={{ fontSize: 15, color: 'var(--slate2)', lineHeight: 1.7, marginBottom: 48, fontWeight: 300, position: 'relative' }}>
        Join thousands of Indian families who have already protected their most critical information with TrustGate's encrypted vault.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
        {[['📁','Store any file type — no limits'],['👨‍👩‍👧','Designate trusted family contacts'],['⚙️','Customizable inactivity rules'],['🇮🇳','Aadhaar-verified identity protection']].map(([icon, text]) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, color: 'var(--slate2)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step indicator ───────────────────────────────────────────── */
function StepsBar({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
      {[0,1,2,3].map((i) => (
        <React.Fragment key={i}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, fontFamily: "'Syne',sans-serif", flexShrink: 0, transition: 'all 0.3s',
            border: i < current ? '2px solid var(--gold)' : i === current ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.1)',
            background: i < current ? 'var(--gold)' : i === current ? 'rgba(201,168,76,0.15)' : 'transparent',
            color: i < current ? 'var(--ink)' : i === current ? 'var(--gold2)' : 'var(--slate)',
          }}>{i < current ? '✓' : i + 1}</div>
          {i < 3 && <div style={{ flex: 1, height: 1, background: i < current ? 'var(--gold)' : 'rgba(255,255,255,0.08)', margin: '0 8px', transition: 'background 0.3s' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Step header ──────────────────────────────────────────────── */
function StepHead({ n, title }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Step {n} of 4</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--cream)', fontFamily: "'Syne',sans-serif" }}>{title}</div>
    </div>
  );
}

/* ── Password strength ───────────────────────────────────────── */
function PasswordStrength({ val }) {
  const checks = [val.length >= 8, /[A-Z]/.test(val), /[0-9]/.test(val), /[^A-Za-z0-9]/.test(val)];
  const score  = checks.filter(Boolean).length;
  const configs = [
    { w: '0%',   c: 'transparent', t: '' },
    { w: '25%',  c: '#e05a5a',     t: 'Weak — add uppercase letters & numbers' },
    { w: '50%',  c: '#f0a040',     t: 'Fair — add a special character' },
    { w: '75%',  c: 'var(--gold)', t: 'Good — almost there!' },
    { w: '100%', c: '#4caf82',     t: 'Strong ✓ Your vault is well protected' },
  ];
  const cfg = configs[score];
  return (
    <>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 2, width: cfg.w, background: cfg.c, transition: 'width 0.3s,background 0.3s' }} />
      </div>
      {cfg.t && <div style={{ fontSize: 11, marginTop: 6, fontWeight: 500, color: cfg.c }}>{cfg.t}</div>}
    </>
  );
}

/* ── Error box ────────────────────────────────────────────────── */
function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ background: 'rgba(224,90,90,0.1)', border: '1px solid rgba(224,90,90,0.3)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#f08080', marginBottom: 20 }}>
      {msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function Signup() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [err,  setErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent,  setOtpSent]  = useState(false);

  /* Step 1 */
  const [fname,  setFname]  = useState('');
  const [lname,  setLname]  = useState('');
  const [email,  setEmail]  = useState('');
  const [phone,  setPhone]  = useState('');
  const [dob,    setDob]    = useState('');

  /* Step 2 */
  const [aadhaar, setAadhaar] = useState('');
  const [pan,     setPan]     = useState('');
  const [otp,     setOtp]     = useState('');

  /* Step 3 */
  const [cname,    setCname]    = useState('');
  const [cemail,   setCemail]   = useState('');
  const [rel,      setRel]      = useState('');
  const [inactive, setInactive] = useState('30');

  /* Step 4 */
  const [pass,   setPass]   = useState('');
  const [pass2,  setPass2]  = useState('');
  const [terms,  setTerms]  = useState(false);

  const goStep = (n) => {
    setErr('');
    if (n > step) {
      if (step === 0) {
        if (!fname || !email || !phone) { setErr('Please fill in your name, email, and mobile number.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Please enter a valid email address.'); return; }
      }
      if (step === 1) {
        const clean = aadhaar.replace(/\s/g, '');
        if (clean.length !== 12) { setErr('Please enter a valid 12-digit Aadhaar number.'); return; }
      }
      if (step === 2) {
        if (!cname || !cemail || !rel) { setErr('Please fill in all trusted contact details.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cemail)) { setErr('Please enter a valid contact email.'); return; }
      }
    }
    setStep(n);
  };

  const formatAadhaar = (val) => {
    const digits = val.replace(/\D/g, '').substring(0, 12);
    const parts  = digits.match(/.{1,4}/g);
    setAadhaar(parts ? parts.join(' ') : digits);
  };

  const sendOTP = async () => {
    if (!email) { setErr('Please enter your email first (Step 1).'); return; }
    setErr('');
    try {
      await api.post('/auth/send-otp', { email });
      setOtpSent(true);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleSignup = async () => {
    if (pass.length < 8)  { setErr('Password must be at least 8 characters.'); return; }
    if (pass !== pass2)   { setErr('Passwords do not match.'); return; }
    if (!terms)           { setErr('Please accept the Terms of Service.'); return; }
    setErr(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: `${fname} ${lname}`.trim(),
        email, password: pass, phone,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      nav('/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PAIR = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', background: 'var(--ink)' }}>
      <AuthLeft nav={nav} />

      {/* RIGHT */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 60px', background: 'var(--ink)', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: 'var(--cream)', letterSpacing: '-0.5px' }}>Create your vault</h2>
            <span style={{ fontSize: 13, color: 'var(--slate)', cursor: 'pointer' }} onClick={() => nav('/')}>← Back</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--slate2)', marginBottom: 32 }}>Secure your digital legacy in 4 simple steps</p>

          <StepsBar current={step} />
          <ErrBox msg={err} />

          {/* ── STEP 0: Personal Info ── */}
          {step === 0 && (
            <>
              <StepHead n={1} title="Personal Information" />
              <div style={{ ...PAIR, marginBottom: 20 }}>
                <div>
                  <label style={LABEL}>First Name</label>
                  <PlainInput value={fname} onChange={e => setFname(e.target.value)} placeholder="Rohan" />
                </div>
                <div>
                  <label style={LABEL}>Last Name</label>
                  <PlainInput value={lname} onChange={e => setLname(e.target.value)} placeholder="Mane" />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Email Address</label>
                <SmartInput icon="✉️" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Mobile Number</label>
                <SmartInput icon="📱" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Date of Birth</label>
                <PlainInput type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ colorScheme: 'dark' }} />
              </div>
              <button style={BTN_PRIMARY} onClick={() => goStep(1)}>Continue →</button>
            </>
          )}

          {/* ── STEP 1: Identity ── */}
          {step === 1 && (
            <>
              <StepHead n={2} title="Identity Verification" />
              <p style={{ fontSize: 13, color: 'var(--slate2)', marginBottom: 24, lineHeight: 1.6 }}>
                We verify your identity to ensure only you can access and configure your vault. Your Aadhaar data is never stored — only used for verification.
              </p>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Aadhaar Number</label>
                <SmartInput icon="🪪" value={aadhaar} onChange={e => formatAadhaar(e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={14} />
                <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 6 }}>Your 12-digit Aadhaar number</div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>PAN Card Number</label>
                <SmartInput icon="💳" value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>OTP Verification</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <PlainInput value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6} style={{ flex: 1 }} />
                  <button
                    onClick={sendOTP}
                    style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', color: 'var(--gold2)', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                {otpSent && <div style={{ fontSize: 12, color: '#4caf82', marginTop: 6 }}>✓ OTP sent to {email}</div>}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ ...BTN_GHOST, flex: 0.4 }} onClick={() => goStep(0)}>← Back</button>
                <button style={{ ...BTN_PRIMARY, flex: 1 }} onClick={() => goStep(2)}>Verify & Continue →</button>
              </div>
            </>
          )}

          {/* ── STEP 2: Contacts ── */}
          {step === 2 && (
            <>
              <StepHead n={3} title="Add Trusted Contact" />
              <p style={{ fontSize: 13, color: 'var(--slate2)', marginBottom: 24, lineHeight: 1.6 }}>
                This person will receive access to your vault after all safety verifications pass. Choose wisely — this is your digital executor.
              </p>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Contact's Full Name</label>
                <SmartInput icon="👤" value={cname} onChange={e => setCname(e.target.value)} placeholder="Spouse, parent, or child" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Their Email Address</label>
                <SmartInput icon="✉️" type="email" value={cemail} onChange={e => setCemail(e.target.value)} placeholder="trusted@example.com" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Relationship</label>
                <select style={SELECT_S} value={rel} onChange={e => setRel(e.target.value)}>
                  <option value="">Select relationship...</option>
                  {['Spouse / Partner','Son','Daughter','Father','Mother','Sibling','Legal Guardian','Trusted Friend'].map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Inactivity Period</label>
                <select style={SELECT_S} value={inactive} onChange={e => setInactive(e.target.value)}>
                  <option value="30">30 days (Recommended)</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                </select>
                <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 6 }}>How long before your vault release process begins</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ ...BTN_GHOST, flex: 0.4 }} onClick={() => goStep(1)}>← Back</button>
                <button style={{ ...BTN_PRIMARY, flex: 1 }} onClick={() => goStep(3)}>Continue →</button>
              </div>
            </>
          )}

          {/* ── STEP 3: Password ── */}
          {step === 3 && (
            <>
              <StepHead n={4} title="Secure Your Vault" />
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Create Password</label>
                <SmartInput icon="🔑" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Min. 8 characters" />
                <PasswordStrength val={pass} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Confirm Password</label>
                <SmartInput icon="🔒" type="password" value={pass2} onChange={e => setPass2(e.target.value)} placeholder="Repeat your password" />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
                <input type="checkbox" id="terms" style={{ width: 18, height: 18, accentColor: 'var(--gold)', flexShrink: 0, marginTop: 2, cursor: 'pointer' }} checked={terms} onChange={e => setTerms(e.target.checked)} />
                <label htmlFor="terms" style={{ fontSize: 13, color: 'var(--slate2)', lineHeight: 1.5, cursor: 'pointer' }}>
                  I agree to TrustGate's <span style={{ color: 'var(--gold2)' }}>Terms of Service</span> and <span style={{ color: 'var(--gold2)' }}>Privacy Policy</span>. I understand this platform stores sensitive data and I take full responsibility for my trusted contacts.
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ ...BTN_GHOST, flex: 0.4 }} onClick={() => goStep(2)}>← Back</button>
                <button style={{ ...BTN_PRIMARY, flex: 1, opacity: loading ? 0.7 : 1 }} onClick={handleSignup} disabled={loading}>
                  {loading ? 'Creating vault…' : '🔐 Create My Vault'}
                </button>
              </div>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--slate2)' }}>
            Already have a vault?{' '}
            <span style={{ color: 'var(--gold2)', cursor: 'pointer', fontWeight: 600 }} onClick={() => nav('/login')}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
