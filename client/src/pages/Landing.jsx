import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Keyframes injected once ─── */
const STYLE = `
@keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes slideRight { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
@keyframes slideLeft  { from{opacity:0;transform:translateX(40px)}  to{opacity:1;transform:translateX(0)} }
@keyframes scaleIn  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
@keyframes pulse2   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
@keyframes orbit    { from{transform:rotate(0deg) translateX(180px) rotate(0deg)} to{transform:rotate(360deg) translateX(180px) rotate(-360deg)} }
@keyframes drift    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.05)} }
.fu  { animation: fadeUp    .7s cubic-bezier(.22,1,.36,1) both }
.fi  { animation: fadeIn    .6s ease both }
.sr  { animation: slideRight .6s cubic-bezier(.22,1,.36,1) both }
.sl  { animation: slideLeft  .6s cubic-bezier(.22,1,.36,1) both }
.sc  { animation: scaleIn   .6s cubic-bezier(.22,1,.36,1) both }
.d1  { animation-delay:.1s } .d2{animation-delay:.2s} .d3{animation-delay:.35s}
.d4  { animation-delay:.5s } .d5{animation-delay:.65s} .d6{animation-delay:.8s}
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
  const lockRef = useRef(false);

  const goTo = useCallback((idx) => {
    if (lockRef.current || idx === slide || idx < 0 || idx >= SLIDES.length) return;
    lockRef.current = true;
    setSlide(idx);
    setAnimKey(k => k + 1);
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
    window.addEventListener('wheel',   onWheel, { passive: true });
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', onWheel); };
  }, [slide, goTo]);

  /* Touch swipe */
  const touchY = useRef(null);
  const onTouchStart = (e) => { touchY.current = e.touches[0].clientY; };
  const onTouchEnd   = (e) => {
    if (touchY.current === null) return;
    const dy = touchY.current - e.changedTouches[0].clientY;
    if (dy >  40) goTo(slide + 1);
    if (dy < -40) goTo(slide - 1);
    touchY.current = null;
  };

  return (
    <>
      <style>{STYLE}</style>

      {/* ── Fixed Nav ── */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'18px 48px',
        background:'rgba(10,15,30,0.85)',backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(201,168,76,0.15)',
      }}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'#e8c97a',cursor:'pointer'}} onClick={()=>goTo(0)}>
          Trust<span style={{color:'#f8f4eb',opacity:.5}}>Gate</span>
        </div>
        <div style={{display:'flex',gap:32}}>
          {['How It Works','Features','Security'].map((l,i)=>(
            <span key={l} onClick={()=>goTo(i+1)}
              style={{fontSize:14,color: slide===i+1?'#e8c97a':'#b0baca',cursor:'pointer',fontWeight:500,transition:'color .2s'}}>
              {l}
            </span>
          ))}
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <span onClick={()=>nav('/login')} style={{fontSize:14,color:'#b0baca',cursor:'pointer',transition:'color .2s'}}>Sign In</span>
          <button onClick={()=>nav('/signup')} style={{
            background:'linear-gradient(135deg,#c9a84c,#e8c97a)',color:'#0a0f1e',
            fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,padding:'10px 22px',
            borderRadius:8,border:'none',cursor:'pointer',
          }}>Create Vault</button>
        </div>
      </nav>

      {/* ── Slide Dot Nav ── */}
      <div style={{position:'fixed',right:28,top:'50%',transform:'translateY(-50%)',zIndex:200,display:'flex',flexDirection:'column',gap:12}}>
        {SLIDES.map((s,i)=>(
          <button key={s.id} onClick={()=>goTo(i)} title={s.label} style={{
            width: i===slide?10:6, height: i===slide?10:6,
            borderRadius:'50%',border:'none',cursor:'pointer',
            background: i===slide?'#e8c97a':'rgba(201,168,76,0.3)',
            transition:'all .3s',padding:0,
            boxShadow: i===slide?'0 0 8px rgba(232,201,122,0.6)':'none',
          }}/>
        ))}
      </div>

      {/* ── Slide Label ── */}
      <div style={{position:'fixed',right:46,top:'50%',transform:'translateY(-50%)',zIndex:199,writingMode:'vertical-rl',fontSize:11,letterSpacing:'0.12em',color:'rgba(201,168,76,0.4)',fontWeight:500,textTransform:'uppercase',userSelect:'none'}}>
        {SLIDES[slide].label}
      </div>

      {/* ── Slide Progress Bar ── */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200,height:2,background:'rgba(201,168,76,0.1)'}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,#c9a84c,#e8c97a)',width:`${((slide+1)/SLIDES.length)*100}%`,transition:'width .6s cubic-bezier(.22,1,.36,1)'}}/>
      </div>

      {/* ── Arrow Hints ── */}
      {slide < SLIDES.length-1 && (
        <div onClick={()=>goTo(slide+1)} style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:200,cursor:'pointer',opacity:.5,animation:'fadeUp 1s ease infinite alternate',fontSize:22}}>
          ↓
        </div>
      )}

      {/* ── Viewport ── */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{position:'fixed',inset:0,overflow:'hidden'}}>

        {/* BG Orbs */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden'}}>
          <div style={{position:'absolute',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)',top:-200,right:-100,animation:'drift 12s ease-in-out infinite'}}/>
          <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(42,53,96,0.5) 0%,transparent 70%)',bottom:-100,left:-150,animation:'drift 15s ease-in-out infinite reverse'}}/>
        </div>

        {/* ─────── SLIDE 0 : HERO ─────── */}
        {slide===0 && (
          <div key={`hero-${animKey}`} style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 8vw',paddingTop:80}}>
            <div className="fu d1" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:100,padding:'6px 16px',fontSize:12,color:'#e8c97a',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:28,width:'fit-content'}}>
              <span style={{width:6,height:6,background:'#c9a84c',borderRadius:'50%',animation:'pulse2 2s infinite',display:'inline-block'}}/>
              🔒 India's First Digital Legacy Platform
            </div>
            <h1 className="fu d2" style={{fontSize:'clamp(52px,7vw,92px)',fontWeight:800,lineHeight:1.02,letterSpacing:-2,color:'#f8f4eb',marginBottom:24,maxWidth:900}}>
              Your family deserves<br/>
              to know <span style={{background:'linear-gradient(135deg,#c9a84c,#f0dfa0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>everything</span><br/>
              when it matters.
            </h1>
            <p className="fu d3" style={{fontSize:18,color:'#b0baca',maxWidth:520,lineHeight:1.7,marginBottom:40,fontWeight:300}}>
              TrustGate is your digital executor. Upload passwords, insurance docs, crypto keys, and personal messages —{' '}
              <strong style={{color:'#f8f4eb',fontWeight:500}}>encrypted and released automatically</strong>{' '}
              to your loved ones only when you become inactive.
            </p>
            <div className="fu d4" style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:60}}>
              <button
                onMouseEnter={()=>setHovBtn('p')} onMouseLeave={()=>setHovBtn('')}
                onClick={()=>nav('/signup')}
                style={{background:'linear-gradient(135deg,#c9a84c,#e8c97a)',color:'#0a0f1e',fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,padding:'16px 36px',borderRadius:10,border:'none',cursor:'pointer',transition:'all .2s',...(hovBtn==='p'?{transform:'translateY(-2px)',boxShadow:'0 12px 40px rgba(201,168,76,0.35)'}:{})}}>
                Create My Secure Vault →
              </button>
              <button
                onMouseEnter={()=>setHovBtn('g')} onMouseLeave={()=>setHovBtn('')}
                onClick={()=>goTo(1)}
                style={{background: hovBtn==='g'?'rgba(255,255,255,0.06)':'transparent',color:'#f8f4eb',fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:15,padding:'16px 36px',borderRadius:10,border:'1px solid rgba(255,255,255,0.15)',cursor:'pointer',transition:'all .2s'}}>
                See How It Works
              </button>
            </div>
            <div className="fu d5" style={{display:'flex',gap:48,alignItems:'center',paddingTop:24,borderTop:'1px solid rgba(201,168,76,0.15)'}}>
              {[['AES-256','Encryption'],['100%','Private'],['24/7','Monitoring'],['∞','Asset Types']].map(([num,label],i,arr)=>(
                <React.Fragment key={label}>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:'#e8c97a'}}>{num}</div>
                    <div style={{fontSize:10,color:'#8892aa',textTransform:'uppercase',letterSpacing:'0.1em',marginTop:2}}>{label}</div>
                  </div>
                  {i<arr.length-1 && <div style={{width:1,height:36,background:'rgba(201,168,76,0.2)'}}/>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ─────── SLIDE 1 : HOW IT WORKS ─────── */}
        {slide===1 && (
          <div key={`how-${animKey}`} style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 8vw',paddingTop:80,overflowY:'auto'}}>
            <div className="sr d1" style={{fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'#c9a84c',fontWeight:600,marginBottom:12}}>How TrustGate Works</div>
            <h2 className="fu d2" style={{fontSize:'clamp(32px,4vw,56px)',fontWeight:800,color:'#f8f4eb',letterSpacing:-1,marginBottom:48}}>Simple. Automatic.<br/>Life-changing.</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:2,borderRadius:16,overflow:'hidden',border:'1px solid rgba(201,168,76,0.15)'}}>
              {STEPS.map((st,i)=>(
                <StepCard key={i} step={st} delay={i} animKey={animKey}/>
              ))}
            </div>
          </div>
        )}

        {/* ─────── SLIDE 2 : FEATURES ─────── */}
        {slide===2 && (
          <div key={`feats-${animKey}`} style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 8vw',paddingTop:80,overflowY:'auto'}}>
            <div className="sr d1" style={{fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'#c9a84c',fontWeight:600,marginBottom:12}}>Everything You Need</div>
            <h2 className="fu d2" style={{fontSize:'clamp(32px,4vw,56px)',fontWeight:800,color:'#f8f4eb',letterSpacing:-1,marginBottom:40}}>Built for the modern<br/>Indian family.</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
              {FEATS.map((f,i)=><FeatCard key={f.title} feat={f} delay={i} animKey={animKey}/>)}
            </div>
          </div>
        )}

        {/* ─────── SLIDE 3 : SECURITY ─────── */}
        {slide===3 && (
          <div key={`sec-${animKey}`} style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 8vw',paddingTop:80}}>
            <div style={{display:'flex',gap:80,alignItems:'center',maxWidth:1100,width:'100%'}}>
              <div style={{flex:1}}>
                <div className="sr d1" style={{fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'#c9a84c',fontWeight:600,marginBottom:12}}>Security First</div>
                <h2 className="fu d2" style={{fontSize:'clamp(36px,4vw,60px)',fontWeight:800,color:'#f8f4eb',letterSpacing:-1,lineHeight:1.1,marginBottom:24}}>Your data never<br/>leaves your hands.</h2>
                <p className="fu d3" style={{fontSize:16,color:'#b0baca',lineHeight:1.8,maxWidth:440,fontWeight:300}}>
                  We use AES-256 encryption — the same standard used by banks, militaries, and intelligence agencies worldwide. Your files are encrypted before they ever reach our servers.
                </p>
                <div className="fu d4" style={{display:'flex',gap:16,marginTop:32,flexWrap:'wrap'}}>
                  {['TLS 1.3 Transit','Zero-Knowledge','India Compliant','GDPR Ready'].map(t=>(
                    <span key={t} style={{fontSize:12,color:'#e8c97a',background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.2)',padding:'6px 14px',borderRadius:100,fontWeight:500}}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="sc d2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,minWidth:280}}>
                {[['🔐','AES-256','Military Grade'],['🛡️','Zero Trust','Architecture'],['🔒','End-to-End','Encryption'],['✅','India','Compliant']].map(([icon,t,sub])=>(
                  <div key={t} style={{background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:16,padding:24,textAlign:'center'}}>
                    <div style={{fontSize:30,marginBottom:10}}>{icon}</div>
                    <div style={{fontSize:13,color:'#e8c97a',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>{t}</div>
                    <div style={{fontSize:11,color:'#8892aa',marginTop:4}}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─────── SLIDE 4 : CTA ─────── */}
        {slide===4 && (
          <div key={`cta-${animKey}`} style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 8vw',paddingTop:80,textAlign:'center'}}>
            {/* Decorative ring */}
            <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',border:'1px solid rgba(201,168,76,0.08)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',border:'1px solid rgba(201,168,76,0.05)',pointerEvents:'none'}}/>
            <div className="fi d1" style={{fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',color:'#c9a84c',fontWeight:600,marginBottom:20}}>Start Today</div>
            <h2 className="fu d2" style={{fontSize:'clamp(36px,5vw,72px)',fontWeight:800,color:'#f8f4eb',letterSpacing:-2,lineHeight:1.05,marginBottom:24,maxWidth:800}}>
              Secure your family's future<br/><span style={{background:'linear-gradient(135deg,#c9a84c,#f0dfa0)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>before it's too late.</span>
            </h2>
            <p className="fu d3" style={{fontSize:18,color:'#b0baca',maxWidth:500,lineHeight:1.7,marginBottom:48,fontWeight:300}}>
              Join thousands of Indian families who trust TrustGate to protect what matters most.
            </p>
            <div className="fu d4" style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center',marginBottom:48}}>
              <button
                onMouseEnter={()=>setHovBtn('c')} onMouseLeave={()=>setHovBtn('')}
                onClick={()=>nav('/signup')}
                style={{background:'linear-gradient(135deg,#c9a84c,#e8c97a)',color:'#0a0f1e',fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,padding:'18px 48px',borderRadius:12,border:'none',cursor:'pointer',transition:'all .2s',...(hovBtn==='c'?{transform:'translateY(-3px)',boxShadow:'0 16px 48px rgba(201,168,76,0.4)'}:{})}}>
                Create My Free Vault →
              </button>
              <button
                onClick={()=>nav('/login')}
                style={{background:'transparent',color:'#f8f4eb',fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:16,padding:'18px 48px',borderRadius:12,border:'1px solid rgba(255,255,255,0.15)',cursor:'pointer'}}>
                Sign In
              </button>
            </div>
            <div className="fu d5" style={{display:'flex',gap:40,color:'#8892aa',fontSize:13}}>
              {['🔒 AES-256 Encrypted','🇮🇳 Made in India','🆓 Free to Start'].map(t=><span key={t}>{t}</span>)}
            </div>
            <div className="fi d6" style={{position:'absolute',bottom:32,left:0,right:0,display:'flex',justifyContent:'space-between',padding:'0 48px',fontSize:12,color:'#8892aa'}}>
              <span>© 2026 TrustGate — Empowering Indian families.</span>
              <div style={{display:'flex',gap:24}}>
                {['Privacy Policy','Terms of Service','Support'].map(l=><span key={l} style={{cursor:'pointer',transition:'color .2s'}}>{l}</span>)}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

function StepCard({ step, delay, animKey }) {
  const [hov, setHov] = useState(false);
  const cls = `fu d${delay+2}`;
  return (
    <div className={cls} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background: hov?'#1a2240':'#12192e',padding:40,position:'relative',overflow:'hidden',transition:'background .3s',cursor:'default'}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:80,fontWeight:800,color:'rgba(201,168,76,0.06)',position:'absolute',top:12,right:16,lineHeight:1,userSelect:'none'}}>{step.n}</div>
      <div style={{width:52,height:52,borderRadius:14,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,fontSize:24}}>{step.icon}</div>
      <h3 style={{fontSize:20,fontWeight:700,color:'#f8f4eb',marginBottom:10,letterSpacing:'-0.3px'}}>{step.title}</h3>
      <p style={{fontSize:13,color:'#b0baca',lineHeight:1.7}}>{step.text}</p>
    </div>
  );
}

function FeatCard({ feat, delay, animKey }) {
  const [hov, setHov] = useState(false);
  const cls = `sc d${delay+1}`;
  return (
    <div className={cls} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background: hov?'rgba(201,168,76,0.04)':'rgba(255,255,255,0.03)',border:`1px solid ${hov?'rgba(201,168,76,0.3)':'rgba(201,168,76,0.12)'}`,borderRadius:16,padding:28,transition:'all .3s',transform: hov?'translateY(-4px)':'none',cursor:'default'}}>
      <div style={{fontSize:30,marginBottom:16}}>{feat.icon}</div>
      <h3 style={{fontSize:16,fontWeight:700,color:'#f8f4eb',marginBottom:8}}>{feat.title}</h3>
      <p style={{fontSize:13,color:'#b0baca',lineHeight:1.7}}>{feat.text}</p>
    </div>
  );
}
