import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const STYLE = `
@keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes slideRight { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
@keyframes slideLeft  { from{opacity:0;transform:translateX(40px)}  to{opacity:1;transform:translateX(0)} }
@keyframes scaleIn  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
@keyframes pulse2   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
@keyframes drift    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.05)} }
.fu  { animation: fadeUp    .7s cubic-bezier(.22,1,.36,1) both }
.fi  { animation: fadeIn    .6s ease both }
.sr  { animation: slideRight .6s cubic-bezier(.22,1,.36,1) both }
.sl  { animation: slideLeft  .6s cubic-bezier(.22,1,.36,1) both }
.sc  { animation: scaleIn   .6s cubic-bezier(.22,1,.36,1) both }
.d1{animation-delay:.1s} .d2{animation-delay:.2s} .d3{animation-delay:.35s}
.d4{animation-delay:.5s} .d5{animation-delay:.65s} .d6{animation-delay:.8s}
`;

const SLIDES = [
  { id: 'hero',     label: 'Home' },
  { id: 'how',      label: 'How It Works' },
  { id: 'features', label: 'Features' },
  { id: 'security', label: 'Security' },
  { id: 'cta',      label: 'Get Started' },
];

const STEPS = [
  { icon: '🔐', n: '01', title: 'Upload Your Digital Life',   text: 'Store insurance policies, bank credentials, crypto wallets, property documents — any file type, AES-256 encrypted.' },
  { icon: '👨‍👩‍👧', n: '02', title: 'Assign Trusted Contacts',   text: 'Designate family members or legal guardians. Control granular permissions — who sees what, and when.' },
  { icon: '⏱️', n: '03', title: 'Set Inactivity Rules',       text: "Define your check-in period (30–90 days). If you don't respond to pings, safety checks trigger before release." },
  { icon: '💌', n: '04', title: 'Your Legacy Is Delivered',   text: 'After all verifications, trusted contacts receive secure access — documents, passwords, voice notes, videos.' },
];

const FEATS = [
  { icon: '🏦', title: 'Financial Documents', text: 'Bank accounts, FDs, insurance, PF, investments — organized and secured.' },
  { icon: '🔑', title: 'Digital Credentials', text: 'Email, social media, crypto seed phrases — no valuable identity lost.' },
  { icon: '📄', title: 'Legal Documents',      text: 'Wills, property papers, Aadhaar, PAN, vehicle RCs — safely vaulted.' },
  { icon: '🎥', title: 'Personal Messages',    text: 'Video letters, voice notes, written messages — your final words preserved.' },
  { icon: '🛡️', title: "Dead Man's Switch",    text: 'Intelligent inactivity monitor with multiple safety checks — no accidental release.' },
  { icon: '📱', title: 'Multi-Channel Alerts', text: 'Check-in reminders via email, SMS, and app — simple for everyone.' },
];

export default function Landing() {
  const nav = useNavigate();
  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [hovBtn, setHovBtn] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const lockRef = useRef(false);

  const goTo = useCallback((idx) => {
    if (lockRef.current || idx === slide || idx < 0 || idx >= SLIDES.length) return;
    lockRef.current = true;
    setSlide(idx);
    setAnimKey(k => k + 1);
    setMenuOpen(false);
    setTimeout(() => { lockRef.current = false; }, 900);
  }, [slide]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(slide + 1);
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goTo(slide - 1);
    };
    const onWheel = (e) => {
      if (e.deltaY > 30)  goTo(slide + 1);
      if (e.deltaY < -30) goTo(slide - 1);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', onWheel); };
  }, [slide, goTo]);

  const touchY = useRef(null);
  const onTouchStart = (e) => { touchY.current = e.touches[0].clientY; };
  const onTouchEnd   = (e) => {
    if (touchY.current === null) return;
    const dy = touchY.current - e.changedTouches[0].clientY;
    if (dy > 50)  goTo(slide + 1);
    if (dy < -50) goTo(slide - 1);
    touchY.current = null;
  };

  const accent = { background: 'linear-gradient(135deg,#c9a84c,#f0dfa0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

  return (
    <>
      <style>{STYLE}</style>

      {/* ── Fixed Nav ── */}
      <nav className="tg-nav">
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize: 20, fontWeight: 800, color:'#e8c97a', cursor:'pointer', flexShrink: 0 }} onClick={() => goTo(0)}>
          Trust<span style={{ color:'#f8f4eb', opacity:.5 }}>Gate</span>
        </div>

        {/* Desktop links */}
        <div className="tg-nav-links">
          {['How It Works','Features','Security'].map((l,i) => (
            <span key={l} onClick={() => goTo(i+1)}
              style={{ fontSize:14, color: slide===i+1?'#e8c97a':'#b0baca', cursor:'pointer', fontWeight:500, transition:'color .2s', whiteSpace:'nowrap' }}>
              {l}
            </span>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(m => !m)}
          style={{ display:'flex', flexDirection:'column', gap:5, background:'none', border:'none', cursor:'pointer', padding:'4px 0', minHeight:44, justifyContent:'center' }}
          aria-label="Menu"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{ width:22, height:2, background:'#b0baca', borderRadius:2, display:'block',
              transform: menuOpen && i===0 ? 'rotate(45deg) translate(5px,5px)' : menuOpen && i===2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
              opacity: menuOpen && i===1 ? 0 : 1, transition:'all .3s' }} />
          ))}
        </button>

        <div className="tg-nav-actions">
          <span onClick={() => nav('/login')} style={{ fontSize:13, color:'#b0baca', cursor:'pointer', whiteSpace:'nowrap' }}>Sign In</span>
          <button onClick={() => nav('/signup')} style={{ background:'linear-gradient(135deg,#c9a84c,#e8c97a)', color:'#0a0f1e', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, padding:'9px 16px', borderRadius:8, border:'none', cursor:'pointer', whiteSpace:'nowrap', minHeight:38 }}>
            Create Vault
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{ position:'fixed', top:60, left:0, right:0, background:'rgba(10,15,30,0.97)', backdropFilter:'blur(20px)', zIndex:99, padding:'20px var(--px-mobile)', borderBottom:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:16 }}>
          {['How It Works','Features','Security'].map((l,i) => (
            <span key={l} onClick={() => goTo(i+1)} style={{ fontSize:16, color:'#b0baca', cursor:'pointer', fontWeight:500, padding:'8px 0', borderBottom:'1px solid rgba(201,168,76,0.08)' }}>
              {l}
            </span>
          ))}
          <button onClick={() => nav('/login')} style={{ background:'transparent', color:'#cream', border:'1px solid var(--border)', borderRadius:10, padding:'12px', fontFamily:"'DM Sans',sans-serif", cursor:'pointer', marginTop:4 }}>Sign In</button>
          <button onClick={() => nav('/signup')} style={{ background:'linear-gradient(135deg,#c9a84c,#e8c97a)', color:'#0a0f1e', fontFamily:"'Syne',sans-serif", fontWeight:700, borderRadius:10, padding:'12px', border:'none', cursor:'pointer' }}>Create Vault</button>
        </div>
      )}

      {/* ── Slide Dot Nav (tablet+) ── */}
      <div className="tg-slide-dots" style={{ position:'fixed', right:24, top:'50%', transform:'translateY(-50%)', zIndex:200, flexDirection:'column', gap:12 }}>
        {SLIDES.map((s,i) => (
          <button key={s.id} onClick={() => goTo(i)} title={s.label} style={{ width:i===slide?10:6, height:i===slide?10:6, borderRadius:'50%', border:'none', cursor:'pointer', background:i===slide?'#e8c97a':'rgba(201,168,76,0.3)', transition:'all .3s', padding:0, boxShadow:i===slide?'0 0 8px rgba(232,201,122,0.6)':'none' }}/>
        ))}
      </div>

      {/* ── Slide Label (tablet+) ── */}
      <div className="tg-slide-label" style={{ position:'fixed', right:42, top:'50%', transform:'translateY(-50%)', zIndex:199, writingMode:'vertical-rl', fontSize:10, letterSpacing:'0.12em', color:'rgba(201,168,76,0.4)', fontWeight:500, textTransform:'uppercase', userSelect:'none' }}>
        {SLIDES[slide].label}
      </div>

      {/* ── Progress Bar ── */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, height:2, background:'rgba(201,168,76,0.1)' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#c9a84c,#e8c97a)', width:`${((slide+1)/SLIDES.length)*100}%`, transition:'width .6s cubic-bezier(.22,1,.36,1)' }}/>
      </div>

      {/* ── Down Arrow ── */}
      {slide < SLIDES.length-1 && (
        <div onClick={() => goTo(slide+1)} style={{ position:'fixed', bottom:20, left:'50%', transform:'translateX(-50%)', zIndex:200, cursor:'pointer', opacity:.45, fontSize:20, color:'#e8c97a', userSelect:'none' }}>↓</div>
      )}

      {/* ── Viewport ── */}
      <div className="tg-slide-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* BG Orbs */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
          <div style={{ position:'absolute', width:'min(700px,100vw)', height:'min(700px,100vw)', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)', top:-150, right:-100, animation:'drift 12s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', width:'min(500px,80vw)', height:'min(500px,80vw)', borderRadius:'50%', background:'radial-gradient(circle,rgba(42,53,96,0.5) 0%,transparent 70%)', bottom:-80, left:-100, animation:'drift 15s ease-in-out infinite reverse' }}/>
        </div>

        {/* ─── SLIDE 0 : HERO ─── */}
        {slide===0 && (
          <div key={`hero-${animKey}`} className="tg-slide-content">
            <div className="fu d1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:100, padding:'6px 14px', fontSize:11, color:'#e8c97a', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24, width:'fit-content', flexShrink:0 }}>
              <span style={{ width:6, height:6, background:'#c9a84c', borderRadius:'50%', animation:'pulse2 2s infinite', display:'inline-block' }}/>
              🔒 India's First Digital Legacy Platform
            </div>
            <h1 className="fu d2" style={{ fontSize:'clamp(36px,7vw,88px)', fontWeight:800, lineHeight:1.02, letterSpacing:-2, color:'#f8f4eb', marginBottom:20, maxWidth:900 }}>
              Your family deserves<br/>
              to know <span style={accent}>everything</span><br/>
              when it matters.
            </h1>
            <p className="fu d3" style={{ fontSize:'clamp(14px,2vw,18px)', color:'#b0baca', maxWidth:520, lineHeight:1.7, marginBottom:32, fontWeight:300 }}>
              TrustGate is your digital executor. Upload passwords, insurance docs, crypto keys, and personal messages —{' '}
              <strong style={{ color:'#f8f4eb', fontWeight:500 }}>encrypted and released automatically</strong>{' '}
              to your loved ones only when you become inactive.
            </p>
            <div className="fu d4 tg-hero-actions" style={{ marginBottom:40 }}>
              <button
                onMouseEnter={() => setHovBtn('p')} onMouseLeave={() => setHovBtn('')}
                onClick={() => nav('/signup')}
                style={{ background:'linear-gradient(135deg,#c9a84c,#e8c97a)', color:'#0a0f1e', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'clamp(13px,1.5vw,15px)', padding:'14px 28px', borderRadius:10, border:'none', cursor:'pointer', transition:'all .2s', ...(hovBtn==='p'?{transform:'translateY(-2px)',boxShadow:'0 12px 40px rgba(201,168,76,0.35)'}:{}) }}>
                Create My Secure Vault →
              </button>
              <button
                onMouseEnter={() => setHovBtn('g')} onMouseLeave={() => setHovBtn('')}
                onClick={() => goTo(1)}
                style={{ background:hovBtn==='g'?'rgba(255,255,255,0.06)':'transparent', color:'#f8f4eb', fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:'clamp(13px,1.5vw,15px)', padding:'14px 28px', borderRadius:10, border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer', transition:'all .2s' }}>
                See How It Works
              </button>
            </div>
            <div className="fu d5 tg-trust-strip">
              {[['AES-256','Encryption'],['100%','Private'],['24/7','Monitoring'],['∞','Asset Types']].map(([num,label],i,arr) => (
                <React.Fragment key={label}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(18px,2.5vw,26px)', fontWeight:800, color:'#e8c97a' }}>{num}</div>
                    <div style={{ fontSize:10, color:'#8892aa', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:2 }}>{label}</div>
                  </div>
                  {i<arr.length-1 && <div className="trust-divider" style={{ width:1, height:32, background:'rgba(201,168,76,0.2)' }}/>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ─── SLIDE 1 : HOW IT WORKS ─── */}
        {slide===1 && (
          <div key={`how-${animKey}`} className="tg-slide-content">
            <div className="sr d1" style={{ fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'#c9a84c', fontWeight:600, marginBottom:10 }}>How TrustGate Works</div>
            <h2 className="fu d2" style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, color:'#f8f4eb', letterSpacing:-1, marginBottom:32 }}>Simple. Automatic.<br/>Life-changing.</h2>
            <div className="tg-steps-grid">
              {STEPS.map((st,i) => <StepCard key={i} step={st} delay={i} />)}
            </div>
          </div>
        )}

        {/* ─── SLIDE 2 : FEATURES ─── */}
        {slide===2 && (
          <div key={`feats-${animKey}`} className="tg-slide-content">
            <div className="sr d1" style={{ fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'#c9a84c', fontWeight:600, marginBottom:10 }}>Everything You Need</div>
            <h2 className="fu d2" style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, color:'#f8f4eb', letterSpacing:-1, marginBottom:28 }}>Built for the modern<br/>Indian family.</h2>
            <div className="tg-feat-grid">
              {FEATS.map((f,i) => <FeatCard key={f.title} feat={f} delay={i} />)}
            </div>
          </div>
        )}

        {/* ─── SLIDE 3 : SECURITY ─── */}
        {slide===3 && (
          <div key={`sec-${animKey}`} className="tg-slide-content" style={{ justifyContent:'center' }}>
            <div className="tg-sec-box">
              <div style={{ flex:1 }}>
                <div className="sr d1" style={{ fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'#c9a84c', fontWeight:600, marginBottom:10 }}>Security First</div>
                <h2 className="fu d2" style={{ fontSize:'clamp(28px,4vw,56px)', fontWeight:800, color:'#f8f4eb', letterSpacing:-1, lineHeight:1.1, marginBottom:20 }}>Your data never<br/>leaves your hands.</h2>
                <p className="fu d3" style={{ fontSize:'clamp(14px,1.5vw,16px)', color:'#b0baca', lineHeight:1.8, maxWidth:440, fontWeight:300 }}>
                  We use AES-256 encryption — the same standard used by banks, militaries, and intelligence agencies worldwide.
                </p>
                <div className="fu d4" style={{ display:'flex', gap:10, marginTop:24, flexWrap:'wrap' }}>
                  {['TLS 1.3 Transit','Zero-Knowledge','India Compliant','GDPR Ready'].map(t => (
                    <span key={t} style={{ fontSize:11, color:'#e8c97a', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', padding:'6px 12px', borderRadius:100, fontWeight:500 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="sc d2 tg-sec-badge-grid">
                {[['🔐','AES-256','Military Grade'],['🛡️','Zero Trust','Architecture'],['🔒','End-to-End','Encryption'],['✅','India','Compliant']].map(([icon,t,sub]) => (
                  <div key={t} style={{ background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:14, padding:'18px 12px', textAlign:'center' }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
                    <div style={{ fontSize:12, color:'#e8c97a', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t}</div>
                    <div style={{ fontSize:10, color:'#8892aa', marginTop:4 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SLIDE 4 : CTA ─── */}
        {slide===4 && (
          <div key={`cta-${animKey}`} className="tg-slide-content" style={{ alignItems:'center', textAlign:'center' }}>
            <div style={{ position:'absolute', width:'min(400px,80vw)', height:'min(400px,80vw)', borderRadius:'50%', border:'1px solid rgba(201,168,76,0.07)', pointerEvents:'none', left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}/>
            <div style={{ position:'absolute', width:'min(600px,95vw)', height:'min(600px,95vw)', borderRadius:'50%', border:'1px solid rgba(201,168,76,0.04)', pointerEvents:'none', left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}/>
            <div className="fi d1" style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'#c9a84c', fontWeight:600, marginBottom:16 }}>Start Today</div>
            <h2 className="fu d2" style={{ fontSize:'clamp(28px,5vw,68px)', fontWeight:800, color:'#f8f4eb', letterSpacing:-2, lineHeight:1.05, marginBottom:20, maxWidth:800 }}>
              Secure your family's future<br/><span style={accent}>before it's too late.</span>
            </h2>
            <p className="fu d3" style={{ fontSize:'clamp(14px,1.8vw,18px)', color:'#b0baca', maxWidth:480, lineHeight:1.7, marginBottom:40, fontWeight:300 }}>
              Join thousands of Indian families who trust TrustGate to protect what matters most.
            </p>
            <div className="fu d4 tg-hero-actions" style={{ justifyContent:'center', marginBottom:32 }}>
              <button
                onMouseEnter={() => setHovBtn('c')} onMouseLeave={() => setHovBtn('')}
                onClick={() => nav('/signup')}
                style={{ background:'linear-gradient(135deg,#c9a84c,#e8c97a)', color:'#0a0f1e', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'clamp(14px,1.5vw,16px)', padding:'16px 40px', borderRadius:12, border:'none', cursor:'pointer', transition:'all .2s', ...(hovBtn==='c'?{transform:'translateY(-3px)',boxShadow:'0 16px 48px rgba(201,168,76,0.4)'}:{}) }}>
                Create My Free Vault →
              </button>
              <button onClick={() => nav('/login')} style={{ background:'transparent', color:'#f8f4eb', fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:'clamp(14px,1.5vw,16px)', padding:'16px 40px', borderRadius:12, border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer' }}>
                Sign In
              </button>
            </div>
            <div className="fu d5" style={{ display:'flex', gap:24, color:'#8892aa', fontSize:'clamp(11px,1.2vw,13px)', flexWrap:'wrap', justifyContent:'center' }}>
              {['🔒 AES-256 Encrypted','🇮🇳 Made in India','🆓 Free to Start'].map(t => <span key={t}>{t}</span>)}
            </div>
            <div className="fi d6 tg-footer" style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 var(--px-mobile) 24px' }}>
              <span style={{ fontSize:11, color:'#8892aa' }}>© 2026 TrustGate — Empowering Indian families.</span>
              <div className="tg-footer-links">
                {['Privacy Policy','Terms of Service','Support'].map(l => <span key={l} style={{ fontSize:12, color:'#8892aa', cursor:'pointer' }}>{l}</span>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function StepCard({ step, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div className={`fu d${delay+2}`} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?'#1a2240':'#12192e', padding:'clamp(24px,4vw,44px)', position:'relative', overflow:'hidden', transition:'background .3s', cursor:'default', minHeight:160 }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(48px,6vw,80px)', fontWeight:800, color:'rgba(201,168,76,0.06)', position:'absolute', top:8, right:12, lineHeight:1, userSelect:'none' }}>{step.n}</div>
      <div style={{ width:44, height:44, borderRadius:12, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, fontSize:22, flexShrink:0 }}>{step.icon}</div>
      <h3 style={{ fontSize:'clamp(16px,1.8vw,20px)', fontWeight:700, color:'#f8f4eb', marginBottom:8 }}>{step.title}</h3>
      <p style={{ fontSize:'clamp(12px,1.2vw,13px)', color:'#b0baca', lineHeight:1.7 }}>{step.text}</p>
    </div>
  );
}

function FeatCard({ feat, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div className={`sc d${delay+1}`} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?'rgba(201,168,76,0.04)':'rgba(255,255,255,0.03)', border:`1px solid ${hov?'rgba(201,168,76,0.3)':'rgba(201,168,76,0.12)'}`, borderRadius:14, padding:'clamp(20px,3vw,28px)', transition:'all .3s', transform:hov?'translateY(-4px)':'none', cursor:'default' }}>
      <div style={{ fontSize:28, marginBottom:14 }}>{feat.icon}</div>
      <h3 style={{ fontSize:'clamp(14px,1.5vw,16px)', fontWeight:700, color:'#f8f4eb', marginBottom:8 }}>{feat.title}</h3>
      <p style={{ fontSize:'clamp(11px,1.1vw,13px)', color:'#b0baca', lineHeight:1.7 }}>{feat.text}</p>
    </div>
  );
}
