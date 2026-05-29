/* MIKAGE ZENITH website kit — sections & screens */
const { useState: useStateC, useEffect: useEffectC } = React;

/* Renders a canon-confirmed tagline, or an explicit UNCONFIRMED marker (never invented). */
function Tagline({ track, style }) {
  if (track.line) return <p style={{ fontFamily:"var(--font-serif)", fontSize:15, color:"var(--porcelain-dim)", lineHeight:1.6, ...style }}>{track.line}</p>;
  return <p style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--silver-dim)", ...style }}>Tagline — UNCONFIRMED</p>;
}

function SiteHeader({ view, setView }) {
  const nav = [["transmissions","Transmissions"],["character","Character"],["visual","Music Visual"],["canon","Canon"]];
  return (
    <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"22px 40px", borderBottom:"1px solid var(--hairline)", position:"sticky", top:0,
      background:"rgba(5,5,8,0.82)", backdropFilter:"blur(8px)", zIndex:40 }}>
      <div onClick={()=>setView("home")} style={{ cursor:"pointer", fontFamily:"var(--font-wordmark)",
        fontWeight:600, fontSize:16, letterSpacing:"0.34em", textIndent:"0.34em", color:"var(--porcelain)" }}>
        MIKAGE ZENITH
      </div>
      <nav style={{ display:"flex", gap:30 }}>
        {nav.map(([k,label]) => (
          <a key={k} onClick={()=>setView(k)} style={{ cursor:"pointer", fontFamily:"var(--font-mono)",
            fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none",
            color: view===k ? "var(--violet-glow)" : "var(--silver)", transition:"color .25s" }}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

function Hero({ setView }) {
  const d = window.MZ_DATA;
  const cur = d.tracks.find(t => t.no === d.currentNo);
  return (
    <section style={{ position:"relative", padding:"96px 40px 64px", textAlign:"center", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:760, height:420, left:"50%", top:120, transform:"translateX(-50%)",
        background:"radial-gradient(circle,rgba(143,0,255,0.13),transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", maxWidth:780, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:30 }}>
        <Sigil size={9}/>
        <Label color="var(--violet-glow)">Fifth transmission is live now</Label>
        <h1 style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:"clamp(44px,8vw,84px)",
          letterSpacing:"0.1em", lineHeight:1.0, color:"var(--porcelain)", margin:0, textShadow:"0 0 50px rgba(143,0,255,0.18)" }}>
          MIKAGE<br/>ZENITH
        </h1>
        <p style={{ fontFamily:"var(--font-serif)", fontSize:18, lineHeight:1.7, color:"var(--porcelain-dim)", maxWidth:560, margin:0 }}>
          Listen to <span style={{color:"var(--porcelain)"}}>PORCELAIN ASCENSION</span> now. SINGULAR HEART,
          THE BREACH, DIGITAL ASH, and THE LANDAUER PARADOX remain in the archive.
        </p>
        <div style={{ width:"100%", maxWidth:620, margin:"6px 0" }}><SignalLine height={84}/></div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
          <Btn as="a" href={cur.link} kind="primary">Listen now →</Btn>
          <Btn kind="ghost" onClick={()=>setView("transmissions")}>Enter the archive</Btn>
        </div>
        <Label style={{ marginTop:2 }} color="var(--silver-dim)">Wordmark — draft direction · logo UNCONFIRMED</Label>
      </div>
    </section>
  );
}

function CurrentTransmission({ track }) {
  return (
    <section style={{ padding:"24px 40px 80px", display:"flex", justifyContent:"center" }}>
      <div className="mz-frame" style={{ position:"relative", display:"flex", gap:34, alignItems:"center",
        maxWidth:760, width:"100%", border:"1px solid var(--hairline)", background:"var(--void-mid)", padding:"30px 34px", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:300, height:300, right:-90, top:-110,
          background:"radial-gradient(circle,rgba(143,0,255,0.16),transparent 70%)", pointerEvents:"none" }}/>
        <Cover track={track} size={180}/>
        <div style={{ position:"relative", flex:1 }}>
          <Label color="var(--violet-glow)">Current Transmission</Label>
          <h2 style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:34, letterSpacing:"0.06em",
            color:"var(--porcelain)", margin:"14px 0 8px", lineHeight:1.05 }}>{track.title}</h2>
          <Tagline track={track} style={{ margin:"0 0 20px" }}/>
          {(() => { const c = window.MZ_CTA(track); return (
            <Btn as="a" href={track.link} kind={c.primary ? "primary" : "ghost"}>{c.label}{c.arrow ? " →" : ""}</Btn>
          ); })()}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:20, fontFamily:"var(--font-mono)",
            fontSize:10, letterSpacing:"0.1em", color:"var(--silver-dim)" }}>
            <span>{track.no} / LAUNCH ARC</span><span>REL {track.date}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchiveRow({ track, onOpen }) {
  const [h, setH] = useStateC(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={()=>onOpen(track)}
      style={{ display:"grid", gridTemplateColumns:"54px 1fr auto", alignItems:"center", gap:20, padding:"18px 14px",
        borderTop:"1px solid var(--hairline)", cursor:"pointer", background: h ? "var(--void-mid)" : "transparent", transition:"background .25s" }}>
      <span style={{ fontFamily:"var(--font-mono)", fontSize:13, color: h ? "var(--violet-glow)" : "var(--silver-dim)", transition:"color .25s" }}>{track.no}</span>
      <div>
        <div style={{ fontFamily:"var(--font-serif)", fontSize:20, letterSpacing:"0.05em", color:"var(--porcelain)" }}>{track.title}</div>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--silver-dim)", marginTop:4 }}>
          {track.lang} · {track.genre} · REL {track.date}
        </div>
      </div>
      {(() => { const c = window.MZ_CTA(track); return (
        <span style={{ fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color: c.primary ? "var(--porcelain)" : "var(--silver-dim)", display:"flex", alignItems:"center", gap:8 }}>
          {c.dot && <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--violet-glow)", boxShadow:"0 0 8px var(--violet-glow)" }}/>}{c.label}</span>
      ); })()}
    </div>
  );
}

function ArchivePage({ onOpen }) {
  const d = window.MZ_DATA;
  return (
    <section style={{ padding:"64px 40px 90px", maxWidth:900, margin:"0 auto" }}>
      <Label>The Launch Arc · {d.tracks.length} of 30 transmissions</Label>
      <h2 style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:48, letterSpacing:"0.08em", color:"var(--porcelain)", margin:"16px 0 6px" }}>Transmissions</h2>
      <p style={{ fontFamily:"var(--font-serif)", fontSize:16, color:"var(--porcelain-dim)", maxWidth:520, margin:"0 0 36px", lineHeight:1.7 }}>
        Live transmissions, and those still inbound. The signal does not stop.
      </p>
      <div style={{ borderBottom:"1px solid var(--hairline)" }}>
        {d.tracks.map(t => <ArchiveRow key={t.no} track={t} onOpen={onOpen}/>)}
      </div>
    </section>
  );
}

function CharacterPage() {
  const traits = [
    ["Helmet","Faceless white porcelain"],
    ["Sensor","Two ultra-thin black slits"],
    ["Underlayer","Matte black graphene"],
    ["Accent","Electric violet — signal only"],
    ["Axis","Sacred-tech · cold · severe"],
    ["Status","Canon-locked"]
  ];
  return (
    <section style={{ padding:"64px 40px 90px", maxWidth:980, margin:"0 auto", display:"grid", gridTemplateColumns:"320px 1fr", gap:60, alignItems:"center" }}>
      <div style={{ display:"flex", justifyContent:"center" }}><Helmet size={250}/></div>
      <div>
        <Label color="var(--violet-glow)">Character · Canon</Label>
        <h2 style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:52, letterSpacing:"0.1em", color:"var(--porcelain)", margin:"14px 0 4px" }}>MIKAGE 鏡</h2>
        <p style={{ fontFamily:"var(--font-serif)", fontSize:17, color:"var(--porcelain-dim)", lineHeight:1.75, maxWidth:440, margin:"0 0 28px" }}>
          The sealed one. A faceless porcelain executor — no eyes, no mouth, no skin. Only
          the helmet, the two slits, and a single thread of violet light.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px 30px" }}>
          {traits.map(([k,v]) => (
            <div key={k} style={{ borderTop:"1px solid var(--hairline)", paddingTop:10 }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"var(--silver-dim)" }}>{k}</div>
              <div style={{ fontFamily:"var(--font-serif)", fontSize:15, color:"var(--porcelain)", marginTop:5 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Music-visual page — a looping per-track visual field (Spotify-canvas style). */
function MusicVisualPage() {
  const d = window.MZ_DATA;
  const cur = d.tracks.find(t => t.no === d.currentNo);
  return (
    <section style={{ padding:"56px 40px 90px", maxWidth:900, margin:"0 auto" }}>
      <Label color="var(--violet-glow)">Music Visual · {cur.no}</Label>
      <h2 style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:42, letterSpacing:"0.07em", color:"var(--porcelain)", margin:"14px 0 30px" }}>{cur.title}</h2>
      <div className="mz-frame" style={{ position:"relative", aspectRatio:"16/7", border:"1px solid var(--hairline)",
        background:"radial-gradient(ellipse at 50% 40%,#1a1a28,#0d0d14 50%,#050508)", overflow:"hidden",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:26 }}>
        <div style={{ position:"absolute", width:520, height:520, background:"radial-gradient(circle,rgba(143,0,255,0.16),transparent 65%)" }}/>
        <div className="mz-float" style={{ position:"relative" }}><Helmet size={150}/></div>
        <div style={{ width:"70%" }}><SignalLine height={64}/></div>
        <div style={{ position:"absolute", bottom:16, left:18, fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.24em", color:"var(--silver-dim)" }}>LOOP · 00:08 · SILENT</div>
        <div style={{ position:"absolute", bottom:16, right:18, fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.24em", color:"var(--silver-dim)" }}>9:16 · 16:9 · 1:1</div>
      </div>
      <p style={{ fontFamily:"var(--font-serif)", fontSize:15, color:"var(--porcelain-dim)", lineHeight:1.7, maxWidth:560, marginTop:24 }}>
        {cur.line ? cur.line + " " : ""}Each transmission ships with a silent looping visual field — void, helmet, one
        violet signal — sized for streaming canvas and short-form.
      </p>
    </section>
  );
}

function SiteFooter() {
  const d = window.MZ_DATA;
  return (
    <footer style={{ borderTop:"1px solid var(--hairline)", padding:"40px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
      <div style={{ fontFamily:"var(--font-wordmark)", fontWeight:600, fontSize:13, letterSpacing:"0.34em", color:"var(--silver)" }}>MIKAGE ZENITH</div>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--silver-dim)" }}>{d.site} · © 2026 {d.studio}</div>
    </footer>
  );
}

Object.assign(window, { SiteHeader, Hero, CurrentTransmission, ArchivePage, CharacterPage, MusicVisualPage, SiteFooter, Tagline });
