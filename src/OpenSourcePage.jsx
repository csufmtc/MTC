import { useState, useEffect } from "react";

export default function OpenSourcePage() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "stats" | "contribute" | "license"

  // Always open at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goHome = () => {
    window.location.hash = "";
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "stats", label: "Repo Details" },
    { id: "contribute", label: "How to Contribute" },
    { id: "license", label: "License" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#050A14", color: "#F5F0E8", fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #050A14; --navy2: #0B1628; --navy3: #0F1E35;
          --gold: #C9A84C; --gold2: #E8C96A; --gold3: #F5E098;
          --white: #F5F0E8; --muted: #8A95A3; --border: rgba(201,168,76,0.18);
        }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono  { font-family: 'DM Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--navy); }
        ::-webkit-scrollbar-thumb { background: var(--gold); }

        .os-back { font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:0.18em; border:1px solid var(--gold); color:var(--gold); padding:0.45rem 1.1rem; background:none; cursor:pointer; text-transform:uppercase; transition:background .2s,color .2s; }
        .os-back:hover { background:var(--gold); color:var(--navy); }

        .os-wrap { max-width:880px; margin:0 auto; padding:0 1.5rem; }
        .os-section-label { font-family:'DM Mono',monospace; font-size:0.65rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold); }
        .gold-bar { width:2.5rem; height:2px; background:var(--gold); margin:1.25rem auto 0; }

        .os-card { background:var(--navy2); border:1px solid var(--border); border-radius:4px; padding:2.5rem; margin-top:2.5rem; display:flex; flex-direction:column; min-height:380px; transition:border-color .3s; }
        .os-card:hover { border-color:var(--gold); }

        /* Bottom Tab Container */
        .os-tab-bar { display:flex; gap:0.5rem; justify-content:center; border-top:1px solid var(--border); padding-top:1.5rem; margin-top:auto; flex-wrap:wrap; }
        .os-tab-btn { font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:0.12em; background:none; border:1px solid transparent; color:var(--muted); padding:0.5rem 1.25rem; text-transform:uppercase; cursor:pointer; transition:all 0.2s; }
        .os-tab-btn:hover { color:var(--white); border-color:rgba(255,255,255,0.1); }
        .os-tab-btn.active { color:var(--navy); background:var(--gold); border-color:var(--gold); font-weight:500; }

        .os-code-block { background:var(--navy3); border:1px solid rgba(201,168,76,0.1); padding:1rem; border-radius:4px; margin:1rem 0; overflow-x:auto; font-size:0.8rem; }
        .os-stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1.25rem; margin-top:1.5rem; }
        .os-stat-box { background:var(--navy3); border:1px solid var(--border); padding:1.25rem; text-align:center; }
        .os-stat-val { font-size:1.8rem; color:var(--gold2); font-weight:700; }
        .os-stat-lbl { font-size:0.7rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); margin-top:0.25rem; }
      `}</style>

      {/* HEADER */}
      <header style={{ position:"sticky", top:0, zIndex:100, borderBottom:"1px solid rgba(201,168,76,0.12)", background:"rgba(5,10,20,0.92)", backdropFilter:"blur(16px)" }}>
        <div style={{ maxWidth:880, margin:"0 auto", padding:"0 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>
          <span className="mono" style={{ fontSize:"0.75rem", letterSpacing:"0.35em", color:"var(--gold)", fontWeight:500, cursor:"pointer" }} onClick={goHome}>MTC</span>
          <button onClick={goHome} className="os-back">← Back to Site</button>
        </div>
      </header>

      <main style={{ paddingTop:"4rem", paddingBottom:"6rem" }}>
        <div className="os-wrap" style={{ textAlign:"center" }}>
          <span className="os-section-label">GitHub Repository</span>
          <h1 className="serif" style={{ fontSize:"clamp(2.2rem,6vw,4rem)", fontWeight:700, color:"var(--white)", marginTop:"0.75rem", lineHeight:1.1 }}>
            Open Source Initiative
          </h1>
          <div className="gold-bar" />
        </div>

        <div className="os-wrap">
          <div className="os-card">
            
            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === "overview" && (
              <div style={{ animation: "fadeIn 0.25s ease-in-out" }}>
                <h2 className="serif" style={{ fontSize:"1.6rem", color:"var(--gold2)", marginBottom:"1rem" }}>Building for Titans, Collaborating Globally</h2>
                <p style={{ fontSize:"0.95rem", lineHeight:1.8, color:"var(--white)", opacity:0.95, marginBottom:"1rem" }}>
                  The Muslim Tech Collaborative at CSUF believes in transparency, knowledge-sharing, and community growth. That is why our official website codebase is fully open source. 
                </p>
                <p style={{ fontSize:"0.95rem", lineHeight:1.8, color:"var(--muted)", marginBottom:"1rem" }}>
                  By keeping the site open-source, members can practice their front-end development, submit features, learn Git workflows, and build portfolio-worthy components.
                </p>
                <div style={{ marginTop:"1.5rem" }}>
                  <a href="https://github.com/csufmtc/MTC" target="_blank" rel="noreferrer" className="mono" style={{ display:"inline-block", background:"var(--gold)", color:"var(--navy)", textDecoration:"none", padding:"0.65rem 1.25rem", fontSize:"0.75rem", letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:600 }}>
                    View on GitHub ↗
                  </a>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STATS */}
            {activeTab === "stats" && (
              <div style={{ animation: "fadeIn 0.25s ease-in-out" }}>
                <h2 className="serif" style={{ fontSize:"1.6rem", color:"var(--gold2)", marginBottom:"0.5rem" }}>Repository Information</h2>
                <p className="mono" style={{ fontSize:"0.75rem", color: "var(--muted)" }}>Owner / Repository: csufmtc / MTC</p>
                
                <div className="os-stats-grid">
                  <div className="os-stat-box">
                    <div className="mono os-stat-val">React + Vite</div>
                    <div className="mono os-stat-lbl">Tech Stack</div>
                  </div>
                  <div className="os-stat-box">
                    <div className="mono os-stat-val">MIT</div>
                    <div className="mono os-stat-lbl">License</div>
                  </div>
                  <div className="os-stat-box">
                    <div className="mono os-stat-val">100%</div>
                    <div className="mono os-stat-lbl">Open Source</div>
                  </div>
                </div>

                <p style={{ fontSize:"0.9rem", lineHeight:1.7, color:"var(--muted)", marginTop:"1.5rem" }}>
                  Our site is built to load instantly, optimized for search engines, and engineered with responsive CSS. Contributions are linted with ESLint and styled with custom premium layouts.
                </p>
              </div>
            )}

            {/* TAB CONTENT: CONTRIBUTE */}
            {activeTab === "contribute" && (
              <div style={{ animation: "fadeIn 0.25s ease-in-out" }}>
                <h2 className="serif" style={{ fontSize:"1.6rem", color:"var(--gold2)", marginBottom:"0.75rem" }}>Developer Setup Instructions</h2>
                <p style={{ fontSize:"0.9rem", color:"var(--white)", marginBottom:"0.5rem" }}>1. Fork the repo and clone it locally:</p>
                <div className="mono os-code-block">
                  git clone https://github.com/csufmtc/MTC.git<br/>
                  cd MTC
                </div>
                <p style={{ fontSize:"0.9rem", color:"var(--white)", marginBottom:"0.5rem" }}>2. Install dependencies & launch dev server:</p>
                <div className="mono os-code-block">
                  npm install<br/>
                  npm run dev
                </div>
                <p style={{ fontSize:"0.9rem", color:"var(--white)", marginBottom:"0.5rem" }}>3. Create your feature branch, commit your changes, and open a Pull Request (PR).</p>
              </div>
            )}

            {/* TAB CONTENT: LICENSE */}
            {activeTab === "license" && (
              <div style={{ animation: "fadeIn 0.25s ease-in-out" }}>
                <h2 className="serif" style={{ fontSize:"1.6rem", color:"var(--gold2)", marginBottom:"1rem" }}>MIT License</h2>
                <p className="mono" style={{ fontSize:"0.8rem", color:"var(--muted)", lineHeight:1.5, background:"rgba(0,0,0,0.2)", padding:"1rem", borderLeft:"3px solid var(--gold)" }}>
                  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software...
                </p>
                <p style={{ fontSize:"0.9rem", color:"var(--muted)", marginTop:"1.25rem" }}>
                  Anyone is free to view, learn from, fork, and build upon this repository to foster learning in Fullerton Titans.
                </p>
              </div>
            )}

            {/* TAB CONTROLS AT THE BOTTOM OF THE CARD */}
            <div className="os-tab-bar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`os-tab-btn${activeTab === tab.id ? " active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </main>

      <footer style={{ background:"var(--navy2)", borderTop:"1px solid var(--border)", padding:"2rem 1.5rem", display:"flex", flexDirection:"column", alignItems:"center", gap:"1.25rem" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:"1.5rem", flexWrap:"wrap" }}>
          <button onClick={goHome} className="mono" style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.62rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--muted)", transition:"color 0.2s" }} onMouseEnter={(e)=>e.target.style.color="var(--gold)"} onMouseLeave={(e)=>e.target.style.color="var(--muted)"}>Home</button>
          <a href="#/sitemap" className="mono" style={{ fontSize:"0.62rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--muted)", textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={(e)=>e.target.style.color="var(--gold)"} onMouseLeave={(e)=>e.target.style.color="var(--muted)"}>Sitemap</a>
          <a href="#/upload" className="mono" style={{ fontSize:"0.62rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--muted)", textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={(e)=>e.target.style.color="var(--gold)"} onMouseLeave={(e)=>e.target.style.color="var(--muted)"}>Photo Upload</a>
          <a href="#/graduates" className="mono" style={{ fontSize:"0.62rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--muted)", textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={(e)=>e.target.style.color="var(--gold)"} onMouseLeave={(e)=>e.target.style.color="var(--muted)"}>Graduates</a>
        </div>
        <span className="mono" style={{ fontSize:"0.56rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--muted)" }}>© Muslim Tech Collaborative @ CSUF</span>
      </footer>
    </div>
  );
}
