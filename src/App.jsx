import { useState, useEffect, useCallback } from "react";

export default function MTCCSUFSite() {
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [selectedBoardTerm, setSelectedBoardTerm] = useState("Spring 2026");
  const [menuOpen, setMenuOpen] = useState(false);

  const loadData = useCallback(() => {
    fetch("/data/events.json")
      .then((r) => r.json())
      .then((raw) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setEvents(raw.filter((ev) => new Date(ev.date + "T00:00:00") >= today));
      })
      .catch(() => setEvents([]));
    fetch("/data/gallery.json").then((r) => r.json()).then(setGallery).catch(() => setGallery([]));
    fetch("/data/board.json").then((r) => r.json()).then(setBoardMembers).catch(() => setBoardMembers([]));
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("focus", loadData);
    window.addEventListener("storage", loadData);
    return () => { window.removeEventListener("focus", loadData); window.removeEventListener("storage", loadData); };
  }, [loadData]);

  const fmt12 = (t) => { if (!t) return ""; const [hh, mm] = t.split(":"); const h = +hh; return `${h % 12 || 12}:${mm} ${h >= 12 ? "PM" : "AM"}`; };
  const fmtDate = (s) => { if (!s) return ""; const [, m, d] = s.split("-"); return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${+d}`; };
  const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); setMenuOpen(false); };

  const navItems = [
    { id: "home", label: "Home" }, { id: "about", label: "About" }, { id: "team", label: "Team" },
    { id: "events", label: "Events" }, { id: "gallery", label: "Gallery" }, { id: "contact", label: "Contact" },
  ];
  const aboutCards = [
    { title: "Community", icon: "◈", text: "A welcoming space where Muslim tech students connect, share experiences, and support each other through their academic and professional journeys." },
    { title: "Innovation", icon: "◆", text: "We encourage members to build projects, join hackathons, and explore emerging technologies while staying grounded in their values." },
    { title: "Education", icon: "◉", text: "Through workshops, tech talks, and study sessions, we help members grow their skills and prepare for careers in software, AI, and cybersecurity." },
    { title: "Networking", icon: "◎", text: "We connect students with professionals, alumni, and peers to open doors and create opportunities beyond the classroom." },
  ];
  const boardTerms = ["Spring 2026", "Fall 2025", "Fall 2026"];
  const currentTeam = boardMembers.filter((m) => m.term === selectedBoardTerm).sort((a, b) => (a.rank || 999) - (b.rank || 999));
  const fallbackEvents = [
    { id: "f1", title: "MTC General Meeting", date: "2026-04-28", start: "17:30", end: "19:00", tag: "Meeting", desc: "Meet the team, learn about the semester, and connect with fellow members." },
    { id: "f2", title: "Tech Networking Night", date: "2026-05-10", start: "18:00", end: "21:00", tag: "Networking", desc: "Connect with Muslim professionals in tech and expand your community." },
    { id: "f3", title: "Resume and LinkedIn Workshop", date: "2026-05-03", start: "16:00", end: "18:00", tag: "Workshop", desc: "Polish your resume and online presence before internship season." },
  ];
  const galleryFallback = ["Fall Kickoff", "Python Workshop", "Networking Night", "Ramadan Iftar", "Hackathon Teams", "Community Meetup"];
  const eventsToShow = events.length > 0 ? events : fallbackEvents;

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
        html { scroll-behavior: smooth; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono  { font-family: 'DM Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--navy); }
        ::-webkit-scrollbar-thumb { background: var(--gold); }

        .section-shell { min-height: 100vh; scroll-margin-top: 72px; }
        .section-pad { padding: 5rem 1.5rem; }
        @media (min-width: 768px) { .section-pad { padding: 7rem 2rem; } }
        .section-inner { max-width: 1280px; margin: 0 auto; }
        .section-label { font-family:'DM Mono',monospace; font-size:0.65rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold); }
        .gold-bar { width:2.5rem; height:2px; background:var(--gold); margin-top:1.25rem; }
        .divider { border:none; border-top:1px solid var(--border); }

        /* NAV */
        .nav-desktop { display:none; align-items:center; gap:2rem; }
        .nav-hamburger { display:flex; background:none; border:none; cursor:pointer; color:var(--gold); font-size:1.6rem; line-height:1; padding:0; }
        @media (min-width: 768px) { .nav-desktop { display:flex; } .nav-hamburger { display:none; } }
        .nav-link { position:relative; font-family:'DM Mono',monospace; font-size:0.7rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted); background:none; border:none; cursor:pointer; padding:0.3rem 0; transition:color .2s; }
        .nav-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:var(--gold); transition:width .25s; }
        .nav-link:hover { color:var(--gold3); }
        .nav-link:hover::after { width:100%; }
        .nav-admin { font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:0.18em; border:1px solid var(--gold); color:var(--gold); padding:0.4rem 1rem; text-decoration:none; text-transform:uppercase; transition:background .2s, color .2s; }
        .nav-admin:hover { background:var(--gold); color:var(--navy); }

        /* MOBILE MENU */
        .mobile-menu { position:fixed; inset:0; background:rgba(5,10,20,0.98); z-index:200; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem; backdrop-filter:blur(16px); }
        .mobile-nav-btn { font-family:'Cormorant Garamond',Georgia,serif; font-size:2.2rem; font-weight:600; color:var(--white); background:none; border:none; cursor:pointer; transition:color .2s; }
        .mobile-nav-btn:hover { color:var(--gold); }

        /* NOISE */
        .noise { position:relative; }
        .noise::after { content:''; position:absolute; inset:0; pointer-events:none; z-index:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); }

        /* HERO */
        .hero-inner { position:relative; z-index:1; max-width:1280px; margin:0 auto; padding:4rem 1.5rem 4rem; width:100%; }
        .hero-giant { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(5.5rem,20vw,18rem); font-weight:700; line-height:0.88; letter-spacing:-0.04em; background:linear-gradient(160deg,#F5E098 0%,#C9A84C 45%,#8B6914 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .hero-grid { display:grid; gap:2rem; margin-top:2.5rem; grid-template-columns:1fr; }
        @media (min-width: 768px) { .hero-grid { grid-template-columns:1fr 1fr; max-width:900px; } }
        .hero-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); }
        .hero-stat { background:rgba(15,30,53,0.6); backdrop-filter:blur(12px); padding:1.25rem 1rem; text-align:center; }
        .hero-btns { margin-top:1.75rem; display:flex; gap:1rem; flex-wrap:wrap; }
        .btn-gold { font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:0.2em; background:var(--gold); color:var(--navy); padding:0.75rem 1.5rem; border:none; cursor:pointer; text-transform:uppercase; font-weight:500; transition:background .2s; white-space:nowrap; }
        .btn-gold:hover { background:var(--gold3); }
        .btn-outline { font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:0.2em; background:transparent; color:var(--white); padding:0.75rem 1.5rem; border:1px solid rgba(255,255,255,0.2); cursor:pointer; text-transform:uppercase; transition:border-color .2s,color .2s; white-space:nowrap; }
        .btn-outline:hover { border-color:var(--gold); color:var(--gold); }

        /* MARQUEE */
        .marquee-track { display:flex; animation:marquee 28s linear infinite; white-space:nowrap; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

        /* ABOUT */
        .about-layout { display:grid; gap:2.5rem; grid-template-columns:1fr; }
        @media (min-width: 900px) { .about-layout { grid-template-columns:260px 1fr; gap:5rem; } }
        .about-cards { display:grid; grid-template-columns:1fr; gap:1px; background:rgba(201,168,76,0.1); margin-top:0; }
        @media (min-width: 600px) { .about-cards { grid-template-columns:1fr 1fr; } }
        .about-card { background:var(--navy2); padding:1.5rem; border:1px solid transparent; transition:transform .3s,border-color .3s; cursor:default; }
        .about-card:hover { transform:translateY(-3px); border-color:var(--gold); }

        /* TEAM */
        .team-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1.25rem; margin-top:0.75rem; }
        .team-grid { display:grid; gap:1px; background:rgba(201,168,76,0.08); grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); margin-top:2rem; }
        @media (min-width: 600px) { .team-grid { grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); } }
        .team-card { background:var(--navy2); padding:1.5rem 1rem; text-align:center; border:1px solid transparent; transition:border-color .3s,transform .3s; }
        .team-card:hover { border-color:var(--gold); transform:translateY(-3px); }
        .team-avatar { width:52px; height:52px; border-radius:50%; margin:0 auto 1rem; background:linear-gradient(135deg,var(--navy3),var(--gold)); display:flex; align-items:center; justify-content:center; font-family:'DM Mono',monospace; font-size:0.82rem; color:var(--navy); font-weight:700; }

        /* EVENTS */
        .event-row { display:grid; gap:0.75rem; align-items:start; padding:1.5rem 0; border-bottom:1px solid var(--border); grid-template-columns:1fr; transition:padding-left .25s; }
        @media (min-width: 600px) { .event-row { grid-template-columns:100px 1fr; gap:2rem; } .event-row:hover { padding-left:0.5rem; } }
        .tag { display:inline-block; font-family:'DM Mono',monospace; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--navy); background:var(--gold); padding:0.22rem 0.7rem; }

        /* GALLERY */
        .gallery-grid { display:grid; gap:1px; background:rgba(201,168,76,0.08); grid-template-columns:1fr; }
        @media (min-width: 500px) { .gallery-grid { grid-template-columns:1fr 1fr; } }
        @media (min-width: 900px) { .gallery-grid { grid-template-columns:1fr 1fr 1fr; } }
        .gallery-item { position:relative; aspect-ratio:4/3; overflow:hidden; border:1px solid var(--border); cursor:pointer; transition:border-color .3s; }
        .gallery-item:hover { border-color:var(--gold); }
        .gallery-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(5,10,20,.85) 0%,transparent 55%); opacity:0; transition:opacity .3s; display:flex; align-items:flex-end; padding:1.25rem; }
        .gallery-item:hover .gallery-overlay { opacity:1; }

        /* CONTACT */
        .contact-layout { display:grid; gap:2.5rem; grid-template-columns:1fr; }
        @media (min-width: 900px) { .contact-layout { grid-template-columns:260px 1fr; gap:5rem; } }
        .contact-link { display:flex; align-items:center; gap:1.25rem; padding:1.25rem 0; border-bottom:1px solid var(--border); text-decoration:none; transition:padding-left .25s; }
        .contact-link:hover { padding-left:0.5rem; }
        .contact-icon { width:42px; height:42px; border:1px solid var(--border); flex-shrink:0; display:flex; align-items:center; justify-content:center; color:var(--gold); font-size:1.1rem; }
        .contact-arrow { margin-left:auto; color:var(--muted); font-size:1.2rem; transition:transform .2s,color .2s; flex-shrink:0; }
        .contact-link:hover .contact-arrow { color:var(--gold); transform:translateX(4px); }
      `}</style>

      {/* ── NAVBAR ── */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, borderBottom:"1px solid rgba(201,168,76,0.12)", background:"rgba(5,10,20,0.92)", backdropFilter:"blur(16px)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>
          <button onClick={() => scrollTo("home")} className="mono" style={{ fontSize:"0.75rem", letterSpacing:"0.35em", color:"var(--gold)", fontWeight:500, background:"none", border:"none", cursor:"pointer" }}>MTC</button>
          <nav className="nav-desktop">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link">{item.label}</button>
            ))}
            <a href="/admin.html" className="nav-admin">Admin</a>
          </nav>
          <button className="nav-hamburger" onClick={() => setMenuOpen(true)}>☰</button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => setMenuOpen(false)} style={{ position:"absolute", top:"1.5rem", right:"1.5rem", background:"none", border:"none", cursor:"pointer", color:"var(--gold)", fontSize:"1.6rem" }}>✕</button>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className="mobile-nav-btn">{item.label}</button>
          ))}
          <a href="/admin.html" className="nav-admin" style={{ marginTop:"0.5rem" }}>Admin</a>
        </div>
      )}

      <main>
        {/* ── HOME ── */}
        <section id="home" className="section-shell noise" style={{ display:"flex", alignItems:"center", overflow:"hidden", background:"linear-gradient(155deg,#050A14 0%,#0B1628 50%,#050A14 100%)", paddingTop:72 }}>
          <div style={{ position:"absolute", top:"8%", right:"-5%", width:"42vw", height:"42vw", maxWidth:600, maxHeight:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"10%", left:"-8%", width:"35vw", height:"35vw", maxWidth:500, maxHeight:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%)", pointerEvents:"none" }} />
          {[15,35,65,85].map(p => <div key={p} style={{ position:"absolute", top:0, bottom:0, left:`${p}%`, width:1, background:"rgba(201,168,76,0.04)", pointerEvents:"none" }} />)}

          <div className="hero-inner">
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"2rem" }}>
              <div style={{ width:"2rem", height:1, background:"var(--gold)", flexShrink:0 }} />
              <span className="mono" style={{ fontSize:"0.6rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"var(--gold)" }}>Muslim Tech Collaborative @ CSUF</span>
            </div>

            <h1 className="hero-giant">MTC</h1>

            <div className="hero-grid">
              <div>
                <p className="serif" style={{ fontSize:"clamp(1.1rem,3vw,1.4rem)", color:"var(--white)", fontWeight:300, lineHeight:1.6, fontStyle:"italic" }}>Muslim Tech Collaborative</p>
                <p style={{ marginTop:"0.75rem", fontSize:"0.875rem", color:"var(--muted)", lineHeight:1.8 }}>A space where faith, leadership, and technology converge at California State University, Fullerton.</p>
                <div className="hero-btns">
                  <button className="btn-gold" onClick={() => scrollTo("about")}>Learn More</button>
                  <button className="btn-outline" onClick={() => scrollTo("contact")}>Connect</button>
                </div>
              </div>
              <div className="hero-stat-grid">
                {[["50+","Members"],["8","Core Leaders"],["CSUF","Campus"],["Tech & Faith","Focus"]].map(([val,lab]) => (
                  <div key={lab} className="hero-stat">
                    <div className="serif" style={{ fontSize:"clamp(1.4rem,3vw,1.8rem)", fontWeight:700, color:"var(--gold2)" }}>{val}</div>
                    <div className="mono" style={{ fontSize:"0.56rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--muted)", marginTop:"0.3rem" }}>{lab}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
        </section>

        {/* ── MARQUEE ── */}
        <div style={{ background:"var(--gold)", overflow:"hidden", padding:"0.6rem 0" }}>
          <div className="marquee-track">
            {Array(8).fill(["MUSLIM","TECH","COLLABORATIVE","CSUF","◆"]).flat().map((word, i) => (
              <span key={i} className="mono" style={{ fontSize:"0.6rem", fontWeight:500, letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--navy)", marginRight:"2.5rem" }}>{word}</span>
            ))}
          </div>
        </div>

        {/* ── ABOUT ── */}
        <section id="about" className="section-shell section-pad" style={{ background:"var(--navy)" }}>
          <div className="section-inner">
            <div className="about-layout">
              <div>
                <span className="section-label">About</span>
                <h2 className="serif" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"var(--white)", marginTop:"0.75rem", lineHeight:1.1 }}>About MTC</h2>
                <div className="gold-bar" />
              </div>
              <div>
                <p className="serif" style={{ fontSize:"clamp(1.05rem,2.5vw,1.3rem)", color:"var(--white)", fontWeight:300, lineHeight:1.7, fontStyle:"italic", marginBottom:"1.75rem" }}>
                  MTC is a student organization dedicated to building a supportive and empowering community for students pursuing careers in technology.
                </p>
                <div style={{ padding:"1.25rem 1.5rem", border:"1px solid var(--border)", background:"var(--navy2)", marginBottom:"2rem" }}>
                  <span className="section-label">Our Mission</span>
                  <p style={{ marginTop:"0.65rem", color:"var(--muted)", lineHeight:1.9, fontSize:"0.875rem" }}>
                    We bridge the gap between faith identity and professional ambition through mentorship, networking, events, and collaborative projects.
                  </p>
                </div>
                <div className="about-cards">
                  {aboutCards.map((card) => (
                    <div key={card.title} className="about-card">
                      <span style={{ fontSize:"1rem", color:"var(--gold)", display:"block", marginBottom:"0.6rem" }}>{card.icon}</span>
                      <h3 className="serif" style={{ fontSize:"1.15rem", fontWeight:700, color:"var(--white)", marginBottom:"0.5rem" }}>{card.title}</h3>
                      <p style={{ fontSize:"0.84rem", color:"var(--muted)", lineHeight:1.8 }}>{card.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section id="team" className="section-shell section-pad" style={{ background:"var(--navy2)", borderTop:"1px solid var(--border)" }}>
          <div className="section-inner">
            <span className="section-label">Team</span>
            <div className="team-header">
              <div>
                <h2 className="serif" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"var(--white)", lineHeight:1.1 }}>Meet Our Team</h2>
                <div className="gold-bar" />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexShrink:0 }}>
                <span className="mono" style={{ fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--muted)" }}>Term</span>
                <select value={selectedBoardTerm} onChange={(e) => setSelectedBoardTerm(e.target.value)}
                  style={{ background:"var(--navy3)", border:"1px solid var(--border)", color:"var(--white)", fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.1em", padding:"0.45rem 0.9rem", outline:"none", cursor:"pointer" }}>
                  {boardTerms.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {currentTeam.length > 0 ? (
              <div className="team-grid">
                {currentTeam.map((member) => (
                  <div key={member.name} className="team-card">
                    <div className="team-avatar">{initials(member.name)}</div>
                    <h3 className="serif" style={{ fontSize:"1.05rem", fontWeight:700, color:"var(--white)" }}>{member.name}</h3>
                    <p className="mono" style={{ fontSize:"0.56rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginTop:"0.3rem" }}>{member.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop:"2rem", padding:"3rem 1rem", border:"1px solid var(--border)", textAlign:"center" }}>
                <p className="serif" style={{ fontSize:"1.3rem", color:"var(--muted)", fontStyle:"italic" }}>No members for this term.</p>
                <p className="mono" style={{ fontSize:"0.6rem", letterSpacing:"0.2em", color:"var(--gold)", marginTop:"0.75rem", textTransform:"uppercase" }}>Check back soon</p>
              </div>
            )}
          </div>
        </section>

        {/* ── EVENTS ── */}
        <section id="events" className="section-shell section-pad" style={{ background:"var(--navy)", borderTop:"1px solid var(--border)" }}>
          <div className="section-inner">
            <span className="section-label">Events</span>
            <h2 className="serif" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"var(--white)", lineHeight:1.1, marginTop:"0.75rem" }}>What's Happening</h2>
            <div className="gold-bar" style={{ marginBottom:"2.5rem" }} />
            <hr className="divider" />

            {eventsToShow.length === 0 ? (
              <div style={{ padding:"3rem 1rem", textAlign:"center" }}>
                <p className="serif" style={{ fontSize:"1.3rem", color:"var(--muted)", fontStyle:"italic" }}>No upcoming events.</p>
              </div>
            ) : eventsToShow.map((ev) => {
              const timeStr = ev.start || ev.end ? fmt12(ev.start) + (ev.end ? " – " + fmt12(ev.end) : "") : ev.time || "";
              return (
                <div key={ev.id} className="event-row">
                  <div>
                    <div className="mono" style={{ fontSize:"0.95rem", fontWeight:500, color:"var(--gold)" }}>{fmtDate(ev.date)}</div>
                    {timeStr && <div className="mono" style={{ fontSize:"0.58rem", letterSpacing:"0.15em", color:"var(--muted)", marginTop:"0.2rem", textTransform:"uppercase" }}>{timeStr}</div>}
                  </div>
                  <div>
                    <span className="tag">{ev.tag}</span>
                    <h3 className="serif" style={{ fontSize:"clamp(1.2rem,3vw,1.55rem)", fontWeight:700, color:"var(--white)", marginTop:"0.55rem", lineHeight:1.2 }}>{ev.title}</h3>
                    <p style={{ marginTop:"0.45rem", fontSize:"0.875rem", color:"var(--muted)", lineHeight:1.8 }}>{ev.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── LIGHTBOX ── */}
        {lightbox && (
          <div onClick={() => setLightbox(null)} style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(5,10,20,0.95)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ position:"relative", maxWidth:900, width:"100%" }}>
              <button onClick={() => setLightbox(null)} style={{ position:"absolute", top:"-3rem", right:0, background:"none", border:"none", cursor:"pointer", color:"var(--gold)", fontSize:"1.1rem", fontFamily:"'DM Mono',monospace" }}>✕ Close</button>
              <img src={lightbox.src} alt={lightbox.caption} style={{ width:"100%", maxHeight:"80vh", objectFit:"contain" }} />
              {lightbox.caption && <p className="serif" style={{ textAlign:"center", marginTop:"1rem", color:"var(--white)", fontStyle:"italic", fontSize:"1.05rem" }}>{lightbox.caption}</p>}
            </div>
          </div>
        )}

        {/* ── GALLERY ── */}
        <section id="gallery" className="section-shell section-pad" style={{ background:"var(--navy2)", borderTop:"1px solid var(--border)" }}>
          <div className="section-inner">
            <span className="section-label">Gallery</span>
            <h2 className="serif" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"var(--white)", lineHeight:1.1, marginTop:"0.75rem" }}>Community Moments</h2>
            <div className="gold-bar" style={{ marginBottom:"2.5rem" }} />

            {gallery.length > 0 ? (
              <div className="gallery-grid">
                {gallery.map((item) => (
                  <div key={item.id} className="gallery-item" onClick={() => setLightbox({ src:item.src, caption:item.caption })}>
                    <img src={item.src} alt={item.caption} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .4s" }}
                      onMouseEnter={(e) => e.currentTarget.style.transform="scale(1.04)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform="scale(1)"} />
                    <div className="gallery-overlay">
                      <p className="serif" style={{ color:"var(--white)", fontWeight:600, fontSize:"1rem" }}>{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="gallery-grid">
                {galleryFallback.map((item, i) => (
                  <div key={item} style={{ aspectRatio:"4/3", background:"var(--navy3)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"0.75rem", padding:"1rem" }}>
                    <div style={{ width:"2rem", height:1, background:"var(--gold)" }} />
                    <p className="serif" style={{ fontSize:"1rem", color:"var(--white)", fontStyle:"italic", textAlign:"center" }}>{item}</p>
                    <span className="mono" style={{ fontSize:"0.56rem", letterSpacing:"0.2em", color:"var(--gold)", textTransform:"uppercase" }}>#{String(i+1).padStart(2,"0")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="section-shell section-pad" style={{ background:"var(--navy)", borderTop:"1px solid var(--border)" }}>
          <div className="section-inner">
            <div className="contact-layout">
              <div>
                <span className="section-label">Contact</span>
                <h2 className="serif" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"var(--white)", marginTop:"0.75rem", lineHeight:1.1 }}>Connect With Us</h2>
                <div className="gold-bar" />
                <p style={{ marginTop:"1.25rem", fontSize:"0.875rem", color:"var(--muted)", lineHeight:1.9 }}>
                  Reach out for collaborations, events, or to learn more about joining the MTC community.
                </p>
              </div>
              <div>
                <hr className="divider" />
                {[
                  { icon:"◈", label:"Instagram", value:"@mtccsuf", href:"https://www.instagram.com/mtccsuf" },
                  { icon:"◆", label:"LinkedIn", value:"Muslim Tech Collaborative @ CSUF", href:"https://www.linkedin.com/company/muslim-tech-collaborative-at-csuf/posts/?feedView=all" },
                  { icon:"◎", label:"Email", value:"csufmtc@gmail.com", href:"mailto:csufmtc@gmail.com" },
                ].map(({ icon, label, value, href }) => (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="contact-link">
                    <div className="contact-icon">{icon}</div>
                    <div style={{ minWidth:0, flex:1 }}>
                      <div className="mono" style={{ fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--muted)" }}>{label}</div>
                      <div className="serif" style={{ fontSize:"clamp(0.95rem,2vw,1.15rem)", color:"var(--white)", marginTop:"0.2rem", wordBreak:"break-word" }}>{value}</div>
                    </div>
                    <span className="contact-arrow">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background:"var(--navy2)", borderTop:"1px solid var(--border)", padding:"1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.75rem" }}>
        <span className="mono" style={{ fontSize:"0.65rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--gold)" }}>MTC</span>
        <span className="mono" style={{ fontSize:"0.56rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--muted)" }}>© Muslim Tech Collaborative @ CSUF</span>
        <span className="mono" style={{ fontSize:"0.56rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--muted)" }}>Fullerton, CA</span>
      </footer>
    </div>
  );
}
