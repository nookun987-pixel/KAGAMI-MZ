/* MIKAGE ZENITH website kit — visual primitives */
const { useState, useEffect, useRef } = React;

/* Film-grain overlay (fixed). */
function Grain() {
  return <div style={{
    position:"fixed", inset:0, pointerEvents:"none", zIndex:60, opacity:0.5, mixBlendMode:"overlay",
    backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"
  }}/>;
}

/* Sigil star — thin cross flare with violet core. */
function Sigil({ size = 10 }) {
  return (
    <div style={{ position:"relative", width:size, height:size, margin:"0 auto" }}>
      <div style={{ position:"absolute", left:"50%", top:"50%", width:size, height:size, transform:"translate(-50%,-50%)",
        borderRadius:"50%", background:"var(--porcelain)", boxShadow:"var(--glow-violet)" }}/>
      <div style={{ position:"absolute", left:"50%", top:"50%", width:1, height:size*9, transform:"translate(-50%,-50%)",
        background:"linear-gradient(var(--violet-glow),transparent,var(--violet-glow))" }}/>
      <div style={{ position:"absolute", left:"50%", top:"50%", width:size*16, height:1, transform:"translate(-50%,-50%)",
        background:"linear-gradient(90deg,transparent,var(--violet-glow),transparent)" }}/>
    </div>
  );
}

/* Thin animated signal / waveform line. */
function SignalLine({ height = 90, animate = true }) {
  return (
    <svg viewBox="0 0 900 120" style={{ width:"100%", height, display:"block", overflow:"visible" }}>
      <defs>
        <linearGradient id="mzSigA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9d7fd0" stopOpacity="0"/>
          <stop offset="14%" stopColor="#9d7fd0" stopOpacity="0.7"/>
          <stop offset="50%" stopColor="#f2eeea" stopOpacity="0.95"/>
          <stop offset="86%" stopColor="#9d7fd0" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#9d7fd0" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="60" r="9" fill="none" stroke="#9d7fd0" strokeWidth="1"/>
      <circle cx="40" cy="60" r="2.5" fill="#f2eeea"/>
      <circle cx="860" cy="60" r="9" fill="none" stroke="#9d7fd0" strokeWidth="1"/>
      <circle cx="860" cy="60" r="2.5" fill="#f2eeea"/>
      <line x1="58" y1="60" x2="842" y2="60" stroke="url(#mzSigA)" strokeWidth="1" opacity="0.35"/>
      <path d="M58 60 Q150 60 230 52 Q255 38 270 60 Q285 84 300 60 Q318 30 332 60 T 380 60 Q450 60 450 36 Q462 18 474 60 Q486 100 498 60 Q512 30 524 60 T 600 60 Q690 60 760 56 Q800 60 842 60"
        stroke="url(#mzSigA)" strokeWidth="1.4" fill="none" strokeLinecap="round"
        className={animate ? "mz-trace" : ""}/>
      <circle cx="450" cy="60" r="26" fill="none" stroke="#8f00ff" strokeWidth="0.8" opacity="0.45"/>
      <circle cx="450" cy="60" r="16" fill="none" stroke="#9d7fd0" strokeWidth="0.8" opacity="0.6"/>
      <circle cx="450" cy="60" r="3" fill="#f2eeea">
        {animate && <animate attributeName="opacity" values="1;0.4;1" dur="2.6s" repeatCount="indefinite"/>}
      </circle>
      <g stroke="#f2eeea" strokeWidth="1.4" opacity="0.85">
        <line x1="250" y1="48" x2="250" y2="72"/><line x1="258" y1="40" x2="258" y2="80"/><line x1="266" y1="52" x2="266" y2="68"/>
        <line x1="634" y1="52" x2="634" y2="68"/><line x1="642" y1="40" x2="642" y2="80"/><line x1="650" y1="48" x2="650" y2="72"/>
      </g>
    </svg>
  );
}

/* Faceless porcelain helmet — canon-locked (two sensor slits). */
function Helmet({ size = 220 }) {
  return (
    <svg width={size} height={size*1.23} viewBox="0 0 260 320" fill="none">
      <defs>
        <radialGradient id="mzPorcA" cx="42%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f6f3ef"/><stop offset="52%" stopColor="#ded9d2"/><stop offset="100%" stopColor="#a7a39c"/>
        </radialGradient>
        <radialGradient id="mzHaloA" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8f00ff" stopOpacity="0.32"/><stop offset="55%" stopColor="#9d7fd0" stopOpacity="0.08"/><stop offset="100%" stopColor="#8f00ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="130" cy="150" rx="124" ry="156" fill="url(#mzHaloA)"/>
      <path d="M104 250 L100 300 L160 300 L156 250 Z" fill="#0d0d14"/>
      <path d="M110 252 L108 298 M150 252 L152 298" stroke="#9d7fd0" strokeWidth="1.2" opacity="0.4"/>
      <path d="M40 132 Q36 50 130 36 Q224 48 220 132 Q228 196 208 244 Q184 296 130 304 Q76 296 52 244 Q32 196 40 132 Z"
        fill="url(#mzPorcA)" stroke="rgba(160,160,176,0.35)" strokeWidth="1.2"/>
      <path d="M80 44 Q130 26 180 44" stroke="rgba(246,243,239,0.7)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M130 36 L130 150" stroke="rgba(160,160,176,0.16)" strokeWidth="1" fill="none"/>
      <path d="M54 96 Q66 80 84 88" stroke="rgba(246,243,239,0.55)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="72" y="150" width="52" height="5" rx="2.5" fill="#050508"/>
      <rect x="136" y="150" width="52" height="5" rx="2.5" fill="#050508"/>
      <rect x="72" y="150" width="52" height="5" rx="2.5" fill="#8f00ff" opacity="0.10"/>
      <rect x="136" y="150" width="52" height="5" rx="2.5" fill="#8f00ff" opacity="0.10"/>
    </svg>
  );
}

/* Buttons. */
function Btn({ children, kind = "primary", onClick, as = "button", href }) {
  const base = {
    fontFamily:"var(--font-mono)", fontSize:12, letterSpacing:"0.22em", textTransform:"uppercase",
    padding:"13px 26px", cursor:"pointer", transition:"all .25s var(--ease)", border:"1px solid",
    background:"transparent", textDecoration:"none", display:"inline-block"
  };
  const kinds = {
    primary: { background:"var(--porcelain)", color:"var(--void)", borderColor:"var(--porcelain)" },
    ghost:   { color:"var(--silver)", borderColor:"var(--hairline)" }
  };
  const [h, setH] = useState(false);
  const hov = kind === "primary"
    ? { background:"var(--violet)", color:"var(--porcelain)", borderColor:"var(--violet)", boxShadow:"var(--glow-violet)" }
    : { color:"var(--porcelain)", borderColor:"var(--violet-glow)" };
  const style = { ...base, ...kinds[kind], ...(h ? hov : {}) };
  const props = { style, onMouseEnter:()=>setH(true), onMouseLeave:()=>setH(false), onClick };
  return as === "a" ? <a href={href} {...props}>{children}</a> : <button {...props}>{children}</button>;
}

function Label({ children, color = "var(--silver-dim)", style }) {
  return <div style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.34em", textTransform:"uppercase", color, ...style }}>{children}</div>;
}

/* Generative release cover — void tile w/ number, grain & halo. */
function Cover({ track, size = 220 }) {
  return (
    <div style={{ width:size, height:size, position:"relative", background:"linear-gradient(150deg,#0d0d14,#050508)",
      border:"1px solid var(--hairline)", overflow:"hidden", flex:"none" }}>
      <div style={{ position:"absolute", width:size*1.2, height:size*1.2, right:-size*0.45, top:-size*0.5,
        background:"radial-gradient(circle,rgba(143,0,255,0.22),transparent 68%)" }}/>
      <div style={{ position:"absolute", inset:0, opacity:0.5, mixBlendMode:"overlay",
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }}/>
      <div style={{ position:"absolute", top:12, left:12, fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.3em", color:"var(--silver-dim)" }}>{track.no} / MZ</div>
      <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:2, height:"46%",
        background:"linear-gradient(var(--violet-glow),transparent)" }}/>
      <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:8, height:8, borderRadius:"50%", background:"var(--porcelain)", boxShadow:"var(--glow-violet)" }}/>
      <div style={{ position:"absolute", bottom:12, left:12, right:12, fontFamily:"var(--font-serif)", fontSize:13, letterSpacing:"0.06em", color:"var(--porcelain)", lineHeight:1.3 }}>{track.title}</div>
    </div>
  );
}

Object.assign(window, { Grain, Sigil, SignalLine, Helmet, Btn, Label, Cover });
