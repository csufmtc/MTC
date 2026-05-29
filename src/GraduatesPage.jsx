import { useEffect } from "react";

// 2026 graduating board / members honored by MTC.
// Drop each photo into public/graduates/ using the `photo` filename below.
const GRADUATES = [
  { name: "Kamal Shmara",   degree: "B.A. Business Administration", photo: "/graduates/kamal-shmara.jpeg" },
  { name: "Talhah Raheem",  degree: "B.S. Computer Science",        photo: "/graduates/talhah-raheem.jpeg" },
  { name: "Zunaira Rahat",  degree: "B.S. Computer Science",        photo: "/graduates/zunaira-rahat.jpeg" },
  { name: "Yawer Mahmood",  degree: "M.S. Information Systems",     photo: "/graduates/yawer-mahmood.jpeg" },
  { name: "Ahmad Zaidan",   degree: "B.S. Computer Science",        photo: "/graduates/ahmad-zaidan.jpeg" },
  { name: "Ahad Ahmad",     degree: "B.S. Computer Science",        photo: "/graduates/ahad-ahmad.jpeg" },
];

const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

export default function GraduatesPage() {
  // Always open at the top of the page.
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const goHome = () => { window.location.hash = ""; };

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

        .grad-back { font-family:'DM Mono',monospace; font-size:0.68rem; letter-spacing:0.18em; border:1px solid var(--gold); color:var(--gold); padding:0.45rem 1.1rem; background:none; cursor:pointer; text-transform:uppercase; transition:background .2s,color .2s; }
        .grad-back:hover { background:var(--gold); color:var(--navy); }

        .grad-wrap { max-width:1120px; margin:0 auto; padding:0 1.5rem; }
        .grad-section-label { font-family:'DM Mono',monospace; font-size:0.65rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold); }
        .gold-bar { width:2.5rem; height:2px; background:var(--gold); margin:1.25rem auto 0; }

        .grad-note { border:1px solid var(--border); background:linear-gradient(160deg,var(--navy2),var(--navy)); padding:2.5rem 1.75rem; margin-top:2.5rem; position:relative; }
        @media (min-width:768px){ .grad-note { padding:3.5rem 3rem; } }
        .grad-note::before { content:'\\201C'; position:absolute; top:0.5rem; left:1.25rem; font-family:'Cormorant Garamond',serif; font-size:5rem; color:var(--gold); opacity:0.25; line-height:1; }

        .grad-grid { display:grid; gap:1px; background:rgba(201,168,76,0.08); grid-template-columns:1fr; margin-top:1px; }
        @media (min-width:560px){ .grad-grid { grid-template-columns:1fr 1fr; } }
        @media (min-width:880px){ .grad-grid { grid-template-columns:1fr 1fr 1fr; } }
        .grad-card { background:var(--navy2); border:1px solid transparent; transition:border-color .3s,transform .3s; }
        .grad-card:hover { border-color:var(--gold); transform:translateY(-3px); }
        .grad-photo-wrap { position:relative; aspect-ratio:1/1; overflow:hidden; background:linear-gradient(135deg,var(--navy3),#1a2942); }
        .grad-photo { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
        .grad-card:hover .grad-photo { transform:scale(1.04); }
        .grad-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:2.6rem; font-weight:700; color:var(--gold); }
        .grad-badge { position:absolute; top:0.85rem; right:0.85rem; font-family:'DM Mono',monospace; font-size:0.56rem; letter-spacing:0.2em; color:var(--navy); background:var(--gold); padding:0.25rem 0.6rem; }
        .grad-meta { padding:1.1rem 1.25rem 1.4rem; }
      `}</style>

      {/* HEADER */}
      <header style={{ position:"sticky", top:0, zIndex:100, borderBottom:"1px solid rgba(201,168,76,0.12)", background:"rgba(5,10,20,0.92)", backdropFilter:"blur(16px)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>
          <span className="mono" style={{ fontSize:"0.75rem", letterSpacing:"0.35em", color:"var(--gold)", fontWeight:500 }}>MTC</span>
          <button onClick={goHome} className="grad-back">← Back to Site</button>
        </div>
      </header>

      <main style={{ paddingTop:"4rem", paddingBottom:"6rem" }}>
        <div className="grad-wrap" style={{ textAlign:"center" }}>
          <span className="grad-section-label">Class of 2026</span>
          <h1 className="serif" style={{ fontSize:"clamp(2.2rem,6vw,4rem)", fontWeight:700, color:"var(--white)", marginTop:"0.75rem", lineHeight:1.1 }}>
            Celebrating Our Graduates
          </h1>
          <div className="gold-bar" />
        </div>

        {/* THANK YOU NOTE */}
        <div className="grad-wrap">
          <div className="grad-note">
            <p className="serif" style={{ fontSize:"clamp(1.15rem,2.6vw,1.5rem)", fontWeight:300, fontStyle:"italic", color:"var(--white)", lineHeight:1.7 }}>
              Thank you, graduating board, for contributing to the growth and success of Muslim Tech
              Collaborative at CSUF. Your dedication, leadership, and commitment have helped shape this
              organization into a stronger community for students interested in technology, mentorship, and
              professional growth. The time, effort, and impact you have made will continue to be valued and
              remembered for years to come.
            </p>
            <p className="serif" style={{ fontSize:"clamp(1.15rem,2.6vw,1.5rem)", fontWeight:300, fontStyle:"italic", color:"var(--white)", lineHeight:1.7, marginTop:"1.5rem" }}>
              With that, we congratulate the graduating Class of 2026 as well and wish you the very best in
              your careers and future endeavors after college.
            </p>
            <p className="mono" style={{ fontSize:"0.6rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--gold)", marginTop:"2rem" }}>
              — With gratitude, Muslim Tech Collaborative @ CSUF
            </p>
          </div>
        </div>

        {/* GRADUATE CARDS */}
        <div className="grad-wrap" style={{ marginTop:"3.5rem" }}>
          <span className="grad-section-label">The Graduates</span>
          <div className="grad-grid" style={{ marginTop:"1.25rem" }}>
            {GRADUATES.map((g) => (
              <div key={g.name} className="grad-card">
                <div className="grad-photo-wrap">
                  <span className="grad-badge">2026</span>
                  <img
                    className="grad-photo"
                    src={g.photo}
                    alt={`${g.name} — ${g.degree}`}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="grad-fallback" style={{ display:"none" }}>{initials(g.name)}</div>
                </div>
                <div className="grad-meta">
                  <h3 className="serif" style={{ fontSize:"1.3rem", fontWeight:700, color:"var(--gold2)", lineHeight:1.2 }}>{g.name}</h3>
                  <p style={{ fontSize:"0.85rem", color:"var(--white)", marginTop:"0.35rem", lineHeight:1.5 }}>{g.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ background:"var(--navy2)", borderTop:"1px solid var(--border)", padding:"1.5rem", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.75rem", flexWrap:"wrap" }}>
        <span className="mono" style={{ fontSize:"0.56rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--muted)" }}>© Muslim Tech Collaborative @ CSUF · Congratulations Class of 2026</span>
      </footer>
    </div>
  );
}
