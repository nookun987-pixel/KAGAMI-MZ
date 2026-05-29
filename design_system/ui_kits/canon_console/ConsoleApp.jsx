/* MIKAGE ZENITH — Canon Console (internal proof / canon + short-form task control plane) */
const { useState } = React;

const STATE_COLOR = { pass:"#9d7fd0", hold:"#c2a85a", fail:"#c8536b", void:"#6b6b78" };
const STATE_LABEL  = { PASS:"PASS", HOLD:"HOLD", FAIL:"HARD FAIL", VOID:"UNCONFIRMED" };
const stateKey = s => ({PASS:"pass",HOLD:"hold",FAIL:"fail",VOID:"void"}[s]);

function Dot({ k, glow }) {
  return <span style={{ width:7, height:7, borderRadius:"50%", background:STATE_COLOR[k], flex:"none",
    boxShadow: (k==="pass"&&glow) ? "0 0 8px "+STATE_COLOR[k] : "none" }}/>;
}

function Mono({ children, size=11, ls="0.2em", color="var(--silver)", upper=true, style }) {
  return <span style={{ fontFamily:"var(--font-mono)", fontSize:size, letterSpacing:ls,
    textTransform: upper?"uppercase":"none", color, ...style }}>{children}</span>;
}

/* ── Candidate preview — generative void frame keyed by lane ── */
function Candidate({ task }) {
  return (
    <div className="mz-frame" style={{ position:"relative", aspectRatio:"16/10", border:"1px solid var(--hairline)",
      background:"radial-gradient(ellipse at 50% 38%,#15151f,#0d0d14 55%,#050508)", overflow:"hidden",
      display:"flex", alignItems:"center", justifyContent:"center", opacity:0.78 }}>
      <div style={{ position:"absolute", width:420, height:420,
        background:"radial-gradient(circle,rgba(143,0,255,0.16),transparent 64%)" }}/>
      {task.lane === "CHARACTER" || task.lane === "SHORT_FORM"
        ? <svg width="150" height="184" viewBox="0 0 260 320" fill="none" style={{ position:"relative" }}>
            <defs><radialGradient id="cP" cx="42%" cy="30%" r="70%"><stop offset="0%" stopColor="#f6f3ef"/><stop offset="55%" stopColor="#ded9d2"/><stop offset="100%" stopColor="#a7a39c"/></radialGradient></defs>
            <path d="M40 132 Q36 50 130 36 Q224 48 220 132 Q228 196 208 244 Q184 296 130 304 Q76 296 52 244 Q32 196 40 132 Z" fill="url(#cP)" stroke="rgba(160,160,176,0.35)" strokeWidth="1.2"/>
            <path d="M130 36 L130 150" stroke="rgba(160,160,176,0.16)" strokeWidth="1"/>
            <rect x="72" y="150" width="52" height="5" rx="2.5" fill="#050508"/><rect x="136" y="150" width="52" height="5" rx="2.5" fill="#050508"/>
          </svg>
        : <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:18 }}>
            <div style={{ width:3, height:120, background:"linear-gradient(var(--violet-glow),transparent)" }}/>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"var(--porcelain)", boxShadow:"var(--glow-violet)" }}/>
            <div style={{ width:200, height:1, background:"linear-gradient(90deg,transparent,var(--violet-glow),transparent)" }}/>
          </div>}
      {/* diagonal SAMPLE watermark */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:30, letterSpacing:"0.4em", color:"rgba(160,160,176,0.12)", transform:"rotate(-18deg)", textTransform:"uppercase" }}>Sample</span>
      </div>
      <div style={{ position:"absolute", top:10, left:12 }}><Mono size={9} ls="0.24em" color="var(--silver-dim)">{task.id} · {task.lane}</Mono></div>
      <div style={{ position:"absolute", bottom:10, right:12 }}><Mono size={9} ls="0.24em" color="var(--silver-dim)">SEED {task.seed}</Mono></div>
    </div>
  );
}

/* ── Pipeline stepper ── */
function Pipeline({ current }) {
  const stages = window.MZ_CONSOLE.stages;
  const idx = stages.indexOf(current);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, flexWrap:"wrap" }}>
      {stages.map((s,i) => (
        <React.Fragment key={s}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0" }}>
            <span style={{ width:8, height:8, borderRadius:"50%", flex:"none",
              background: i<=idx ? "var(--violet-glow)":"var(--void-line)",
              boxShadow: i===idx ? "0 0 8px var(--violet-glow)":"none" }}/>
            <Mono size={9} ls="0.18em" color={i===idx?"var(--porcelain)":i<idx?"var(--silver)":"var(--silver-dim)"}>{s}</Mono>
          </div>
          {i < stages.length-1 && <div style={{ width:22, height:1, background: i<idx?"var(--violet-dim)":"var(--hairline)", margin:"0 8px" }}/>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Gate verdict row — results are always UNCONFIRMED for sample tasks ── */
function GateRow({ code }) {
  const full = window.MZ_CONSOLE.gateLibrary[code] || "—";
  const name = full.split(" — ")[0];
  const desc = full.split(" — ")[1] || "";
  const k = "void"; // never assert pass without source/operator verification
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:14, alignItems:"center",
      background:"var(--void-mid)", border:"1px solid var(--hairline)", borderLeft:`2px solid ${STATE_COLOR[k]}`, padding:"13px 16px" }}>
      <div>
        <Mono size={11} ls="0.14em" color="var(--porcelain)">{code} · {name}</Mono>
        <div style={{ marginTop:4 }}><Mono size={9} ls="0.06em" upper={false} color="var(--silver-dim)">{desc}</Mono></div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <Dot k={k}/><Mono size={10} ls="0.2em" color={STATE_COLOR[k]}>UNCONFIRMED</Mono>
      </div>
    </div>
  );
}

/* ── Left rail task ── */
function QueueItem({ task, active, onClick }) {
  const k = stateKey(task.state);
  return (
    <div onClick={onClick} style={{ padding:"14px 16px", cursor:"pointer", borderLeft:`2px solid ${active?STATE_COLOR[k]:"transparent"}`,
      background: active ? "var(--void-mid)" : "transparent", transition:"background .2s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
        <Mono size={10} ls="0.18em" color={active?"var(--porcelain)":"var(--silver)"}>{task.id}</Mono>
        <Dot k={k} glow/>
      </div>
      <div style={{ marginTop:6, fontFamily:"var(--font-serif)", fontSize:14, color: active?"var(--porcelain)":"var(--porcelain-dim)", lineHeight:1.3 }}>{task.title}</div>
      <div style={{ marginTop:5 }}><Mono size={8.5} ls="0.16em" color="var(--silver-dim)">{task.lane} · {task.stage}</Mono></div>
    </div>
  );
}

function ConsoleApp() {
  const data = window.MZ_CONSOLE;
  const [sel, setSel] = useState(0);
  const task = data.tasks[sel];
  const k = stateKey(task.state);
  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateRows:"auto 1fr" }}>
      {/* top bar */}
      <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 26px", borderBottom:"1px solid var(--hairline)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontFamily:"var(--font-wordmark)", fontWeight:600, fontSize:14, letterSpacing:"0.3em", color:"var(--porcelain)" }}>MIKAGE ZENITH</span>
          <span style={{ width:1, height:16, background:"var(--hairline)" }}/>
          <Mono size={10} ls="0.3em" color="var(--violet-glow)">CANON CONSOLE</Mono>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <Dot k="void"/><Mono size={8.5} ls="0.16em" color="var(--silver-dim)">ALL STATES UNCONFIRMED</Mono>
        </div>
      </header>

      {/* SAMPLE / MOCK banner */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 26px", background:"rgba(194,168,90,0.07)", borderBottom:"1px solid rgba(194,168,90,0.25)" }}>
        <span style={{ flex:"none", fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"var(--signal-pending)", border:"1px solid rgba(194,168,90,0.4)", padding:"2px 8px" }}>Sample · Mock</span>
        <Mono size={9.5} ls="0.06em" upper={false} color="var(--silver)">{data.banner}</Mono>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr" }}>
        {/* left rail */}
        <aside style={{ borderRight:"1px solid var(--hairline)" }}>
          <div style={{ padding:"16px 16px 10px" }}><Mono size={9} ls="0.3em" color="var(--silver-dim)">Task Queue · {data.tasks.length} · SAMPLE</Mono></div>
          {data.tasks.map((t,i)=><QueueItem key={t.id} task={t} active={i===sel} onClick={()=>setSel(i)}/>)}
          <div style={{ padding:"16px", borderTop:"1px solid var(--hairline)", marginTop:8 }}>
            <Mono size={8.5} ls="0.14em" upper={false} color="var(--silver-dim)" style={{lineHeight:1.8}}>Truth &gt; Logic &gt; Aesthetic. A frame that breaks integrity is rejected, not excused.</Mono>
          </div>
        </aside>

        {/* main */}
        <main style={{ padding:"26px 30px 40px", display:"flex", flexDirection:"column", gap:24, maxWidth:920 }}>
          <div>
            <Mono size={9} ls="0.3em" color="var(--silver-dim)">{task.lane} · CREATED {task.created}</Mono>
            <h1 style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:30, letterSpacing:"0.04em", color:"var(--porcelain)", margin:"10px 0 16px" }}>{task.title}</h1>
            <Pipeline current={task.stage}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:24, alignItems:"start" }}>
            <Candidate task={task}/>
            <div>
              <Mono size={9} ls="0.3em" color="var(--silver-dim)">Prompt spec</Mono>
              <div style={{ marginTop:10, background:"var(--void-mid)", border:"1px solid var(--hairline)", padding:"14px 16px" }}>
                <Mono size={11} ls="0.02em" upper={false} color="var(--porcelain-dim)" style={{lineHeight:1.7}}>{task.prompt}</Mono>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <Mono size={9} ls="0.3em" color="var(--silver-dim)">Canon proof gates · {task.gates.length}</Mono>
              <Mono size={9} ls="0.2em" color="var(--silver-dim)">ALL UNCONFIRMED</Mono>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {task.gates.map(code=><GateRow key={code} code={code}/>)}
            </div>
          </div>

          {/* verdict bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid var(--hairline)", paddingTop:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Dot k={k} glow/><Mono size={13} ls="0.24em" color={STATE_COLOR[k]}>{STATE_LABEL[task.state]}</Mono>
              <Mono size={10} ls="0.16em" color="var(--silver-dim)">· STAGE {task.stage}</Mono>
            </div>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              <Mono size={9} ls="0.16em" color="var(--silver-dim)">Approve · lock — disabled until verified</Mono>
              <button style={{ fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", padding:"11px 22px", border:"1px solid var(--hairline)", background:"transparent", color:"var(--silver)", cursor:"pointer" }}>Reject</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ConsoleApp/>);
