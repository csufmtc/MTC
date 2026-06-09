import { useEffect } from "react";

export default function SitemapPage() {
  // Always open at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goHome = () => {
    window.location.hash = "";
  };

  const categories = [
    {
      title: "Main Sections",
      description: "Direct sections on the landing page of the MTC CSUF website.",
      items: [
        { name: "Home / Hero Banner", path: "/#home", desc: "Welcome section, key statistics, and main call-to-actions." },
        { name: "About MTC", path: "/#about", desc: "Our core values: Community, Innovation, Education, and Networking." },
        { name: "Meet Our Team", path: "/#team", desc: "The executive board members organizing and leading the collaborative." },
        { name: "What's Happening (Events)", path: "/#events", desc: "List of upcoming workshops, networking nights, and general meetings." },
        { name: "Community Moments (Gallery)", path: "/#gallery", desc: "Photo gallery highlighting memory slides of our Titan members." },
        { name: "Connect With Us (Contact)", path: "/#contact", desc: "Direct channels to our Instagram, LinkedIn, and email." }
      ]
    },
    {
      title: "Special Features & Pages",
      description: "Dedicated full-screen portals for collaborative tools and member appreciation.",
      items: [
        { name: "Celebrating Our 2026 Graduates", path: "/#/graduates", desc: "A special wall dedicated to honoring the graduates of the Class of 2026." },
        { name: "Photo Upload Portal", path: "/#/upload", desc: "An interactive cropper and tool to upload user photos to Google Drive." },
        { name: "Open Source Info & Repository", path: "/#/opensource", desc: "Developer contribution guides, repository details, and source licensing." }
      ]
    },
    // {
    //   title: "Administrative Portal",
    //   description: "Protected offline utility to manage events, board members, and offline media.",
    //   items: [
    //     { name: "Admin Dashboard Control", path: "/admin.html", desc: "Management portal to add/remove events, adjust team rankings, and configure content." }
    //   ]
    // }
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

        .sm-back { font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:0.18em; border:1px solid var(--gold); color:var(--gold); padding:0.45rem 1.1rem; background:none; cursor:pointer; text-transform:uppercase; transition:background .2s,color .2s; }
        .sm-back:hover { background:var(--gold); color:var(--navy); }

        .sm-wrap { max-width:960px; margin:0 auto; padding:0 1.5rem; }
        .sm-section-label { font-family:'DM Mono',monospace; font-size:0.65rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold); }
        .gold-bar { width:2.5rem; height:2px; background:var(--gold); margin:1.25rem auto 0; }

        .sm-card { background:var(--navy2); border:1px solid var(--border); padding:2rem; margin-top:2rem; transition:border-color .3s; }
        .sm-card:hover { border-color:var(--gold); }
        .sm-card-title { font-size:1.5rem; color:var(--gold2); font-weight:700; margin-bottom:0.5rem; }
        .sm-card-desc { font-size:0.88rem; color:var(--muted); margin-bottom:1.5rem; }

        .sm-link-row { display:flex; justify-content:space-between; align-items:flex-start; padding:1.25rem 0; border-top:1px solid rgba(201,168,76,0.1); transition:padding-left 0.25s; text-decoration:none; }
        .sm-link-row:hover { padding-left:0.5rem; }
        .sm-link-name { font-size:1.15rem; color:var(--white); font-weight:600; transition:color 0.2s; }
        .sm-link-row:hover .sm-link-name { color:var(--gold3); }
        .sm-link-path { font-family:'DM Mono',monospace; font-size:0.7rem; color:var(--gold); letter-spacing:0.05em; background:rgba(201,168,76,0.08); padding:0.2rem 0.5rem; border-radius:3px; }
        .sm-link-desc { font-size:0.82rem; color:var(--muted); margin-top:0.3rem; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(201,168,76,0.12)", background: "rgba(5,10,20,0.92)", backdropFilter: "blur(16px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <span className="mono" style={{ fontSize: "0.75rem", letterSpacing: "0.35em", color: "var(--gold)", fontWeight: 500, cursor: "pointer" }} onClick={goHome}>MTC</span>
          <button onClick={goHome} className="sm-back">← Back to Site</button>
        </div>
      </header>

      <main style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="sm-wrap" style={{ textAlign: "center" }}>
          <span className="sm-section-label">Site Map Directory</span>
          <h1 className="serif" style={{ fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 700, color: "var(--white)", marginTop: "0.75rem", lineHeight: 1.1 }}>
            Website Infrastructure
          </h1>
          <div className="gold-bar" />
        </div>

        <div className="sm-wrap" style={{ marginTop: "2rem" }}>
          {categories.map((cat) => (
            <div key={cat.title} className="sm-card">
              <h2 className="serif sm-card-title">{cat.title}</h2>
              <p className="sm-card-desc">{cat.description}</p>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {cat.items.map((item) => (
                  <a key={item.name} href={item.path} className="sm-link-row">
                    <div style={{ paddingRight: "1rem" }}>
                      <span className="serif sm-link-name">{item.name}</span>
                      <p className="sm-link-desc">{item.desc}</p>
                    </div>
                    <span className="sm-link-path">{item.path}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ background: "var(--navy2)", borderTop: "1px solid var(--border)", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={goHome} className="mono" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "var(--gold)"} onMouseLeave={(e) => e.target.style.color = "var(--muted)"}>Home</button>
          <a href="#/opensource" className="mono" style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "var(--gold)"} onMouseLeave={(e) => e.target.style.color = "var(--muted)"}>Open Source</a>
          <a href="#/upload" className="mono" style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "var(--gold)"} onMouseLeave={(e) => e.target.style.color = "var(--muted)"}>Photo Upload</a>
          <a href="#/graduates" className="mono" style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "var(--gold)"} onMouseLeave={(e) => e.target.style.color = "var(--muted)"}>Graduates</a>
        </div>
        <span className="mono" style={{ fontSize: "0.56rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)" }}>© Muslim Tech Collaborative @ CSUF</span>
      </footer>
    </div>
  );
}
