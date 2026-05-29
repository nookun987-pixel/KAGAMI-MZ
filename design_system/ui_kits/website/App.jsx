/* MIKAGE ZENITH website kit — app shell */
const { useState: useStateA } = React;

function CanonPage() {
  const rows = [
    ["VOID","#050508","The canvas is always void black."],
    ["PORCELAIN","#f2eeea","Identity is porcelain white."],
    ["VIOLET","#8F00FF","One signal accent. Never a fill."],
    ["FORBIDDEN","—","No human face. No anime. No neon. No samurai. No HUD."]
  ];
  return (
    <section style={{ padding:"64px 40px 90px", maxWidth:760, margin:"0 auto" }}>
      <Label color="var(--violet-glow)">Canon · protected</Label>
      <h2 style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:48, letterSpacing:"0.08em", color:"var(--porcelain)", margin:"14px 0 8px" }}>The Doctrine</h2>
      <p style={{ fontFamily:"var(--font-serif)", fontSize:16, color:"var(--porcelain-dim)", lineHeight:1.75, maxWidth:520, margin:"0 0 36px" }}>
        Truth &gt; Logic &gt; Aesthetic. A frame that breaks integrity is rejected, not excused.
      </p>
      {rows.map(([k,hex,desc]) => (
        <div key={k} style={{ display:"grid", gridTemplateColumns:"160px 1fr", gap:20, alignItems:"baseline",
          borderTop:"1px solid var(--hairline)", padding:"16px 0" }}>
          <div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:"0.2em", color:"var(--porcelain)" }}>{k}</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.08em", color:"var(--silver-dim)", marginTop:4 }}>{hex}</div>
          </div>
          <div style={{ fontFamily:"var(--font-serif)", fontSize:15, color:"var(--porcelain-dim)", lineHeight:1.6 }}>{desc}</div>
        </div>
      ))}
    </section>
  );
}

function TrackOverlay({ track, onClose }) {
  if (!track) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:80, background:"rgba(5,5,8,0.82)",
      backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e=>e.stopPropagation()} className="mz-frame" style={{ position:"relative", display:"flex", gap:30, alignItems:"center",
        maxWidth:640, width:"100%", border:"1px solid var(--hairline-accent)", background:"var(--void-mid)", padding:"34px", boxShadow:"var(--glow-soft)" }}>
        <Cover track={track} size={200}/>
        <div style={{ flex:1 }}>
          <Label color="var(--violet-glow)">{track.no} / Launch Arc</Label>
          <h2 style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:30, letterSpacing:"0.05em", color:"var(--porcelain)", margin:"12px 0 8px", lineHeight:1.1 }}>{track.title}</h2>
          <Tagline track={track} style={{ margin:"0 0 18px" }}/>
          {(() => { const c = window.MZ_CTA(track); return (
            <Btn as="a" href={track.link} kind={c.primary ? "primary" : "ghost"}>{c.label}{c.arrow ? " →" : ""}</Btn>
          ); })()}
          <div style={{ marginTop:18, fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.12em", color:"var(--silver-dim)", lineHeight:2 }}>
            {track.lang} · {track.genre} / {track.sub}<br/>REL {track.date}
          </div>
        </div>
        <div onClick={onClose} style={{ position:"absolute", top:12, right:14, cursor:"pointer", fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:"0.2em", color:"var(--silver)" }}>CLOSE ✕</div>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useStateA("home");
  const [track, setTrack] = useStateA(null);
  return (
    <div style={{ minHeight:"100vh" }}>
      <Grain/>
      <SiteHeader view={view} setView={(v)=>{setView(v); window.scrollTo({top:0});}}/>
      {view === "home" && <><Hero setView={setView}/><CurrentTransmission track={window.MZ_DATA.tracks.find(t=>t.no===window.MZ_DATA.currentNo)}/></>}
      {view === "transmissions" && <ArchivePage onOpen={setTrack}/>}
      {view === "character" && <CharacterPage/>}
      {view === "visual" && <MusicVisualPage/>}
      {view === "canon" && <CanonPage/>}
      <SiteFooter/>
      <TrackOverlay track={track} onClose={()=>setTrack(null)}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
