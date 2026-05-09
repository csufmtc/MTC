import { useState, useEffect, useCallback } from "react";

export default function MTCCSUFSite() {
  // ── Dynamic data from admin panel (localStorage) ──
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [lightbox, setLightbox] = useState(null); // { src, caption }
  const [selectedBoardTerm, setSelectedBoardTerm] = useState("Spring 2026");

  const loadData = useCallback(() => {
    // ── EVENTS: fetch from public/data/events.json ──
    fetch("/data/events.json")
      .then((r) => r.json())
      .then((raw) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = raw.filter((ev) => {
          const d = new Date(ev.date + "T00:00:00");
          return d >= today;
        });
        setEvents(upcoming);
      })
      .catch(() => setEvents([]));

    // ── GALLERY: fetch from public/data/gallery.json ──
    fetch("/data/gallery.json")
      .then((r) => r.json())
      .then((raw) => setGallery(raw))
      .catch(() => setGallery([]));

    // ── BOARD MEMBERS: fetch from public/data/board.json ──
    fetch("/data/board.json")
      .then((r) => r.json())
      .then((raw) => setBoardMembers(raw))
      .catch(() => setBoardMembers([]));
  }, []);


  useEffect(() => {
    loadData();
    const handler = () => loadData();
    window.addEventListener("focus", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("focus", handler);
      window.removeEventListener("storage", handler);
    };
  }, [loadData]);

  // ── Time/Date helpers ──
  function fmt12(timeStr) {
    if (!timeStr) return "";
    const [hh, mm] = timeStr.split(":");
    const h = parseInt(hh, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${mm} ${ampm}`;
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return "";
    const [, m, d] = dateStr.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m) - 1]} ${parseInt(d)}`;
  }

  // ── Static data ──
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "team", label: "Team" },
    { id: "events", label: "Events" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const aboutCards = [
    {
      title: "Community",
      icon: "🤝",
      text: "We create a welcoming space where Muslim tech students can connect, share experiences, and support each other throughout their academic and professional journeys.",
    },
    {
      title: "Innovation",
      icon: "💡",
      text: "We encourage members to build projects, participate in hackathons, and explore emerging technologies while staying grounded in their values.",
    },
    {
      title: "Education",
      icon: "🎓",
      text: "Through workshops, tech talks, and study sessions, we help members grow their technical skills and prepare for careers in software, AI, cybersecurity, and more.",
    },
    {
      title: "Networking",
      icon: "🌐",
      text: "We connect students with professionals, alumni, and peers to open doors and create opportunities beyond the classroom.",
    },
  ];

  const boardTerms = ["Spring 2026","Fall 2025", "Fall 2026"];

  const currentTeam = boardMembers
    .filter((m) => m.term === selectedBoardTerm)
    .sort((a, b) => (a.rank || 999) - (b.rank || 999)) || [];

  // Fallback events shown only when admin hasn't added any
  const fallbackEvents = [
    {
      id: "f1",
      title: "MTC General Meeting",
      date: "2026-04-28",
      start: "17:30",
      end: "19:00",
      tag: "Meeting",
      desc: "Meet the team, learn about the semester, and connect with fellow members.",
    },
    {
      id: "f2",
      title: "Tech Networking Night",
      date: "2026-05-10",
      start: "18:00",
      end: "21:00",
      tag: "Networking",
      desc: "Connect with Muslim professionals in tech and expand your community.",
    },
    {
      id: "f3",
      title: "Resume and LinkedIn Workshop",
      date: "2026-05-03",
      start: "16:00",
      end: "18:00",
      tag: "Workshop",
      desc: "Polish your resume and online presence before internship season.",
    },
  ];

  // Fallback gallery placeholders when admin hasn't uploaded any photos
  const galleryFallback = [
    "Fall Kickoff",
    "Python Workshop",
    "Networking Night",
    "Ramadan Iftar",
    "Hackathon Teams",
    "Community Meetup",
  ];

  const eventsToShow = events.length > 0 ? events : fallbackEvents;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const initials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FFE8BE] text-slate-900 scroll-smooth">
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes shakeTiny {
          0%   { transform: rotate(0deg) translateY(0); }
          20%  { transform: rotate(-6deg) translateY(-1px); }
          40%  { transform: rotate(6deg) translateY(0); }
          60%  { transform: rotate(-5deg) translateY(-1px); }
          80%  { transform: rotate(5deg) translateY(0); }
          100% { transform: rotate(0deg) translateY(0); }
        }

        .shake-letter:hover {
          animation: shakeTiny 0.35s ease-in-out 2;
        }

        .section-shell {
          min-height: 100vh;
          scroll-margin-top: 88px;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/30 bg-[#FFE8BE]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl font-black tracking-[0.25em] text-[#406AAF] transition hover:text-[#427AB5]"
          >
            MTC
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#F7DD7D] hover:text-[#406AAF]"
              >
                {item.label}
              </button>
            ))}
            <a
              href="/admin.html"
              className="rounded-full bg-[#406AAF] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#427AB5]"
            >
              Admin ⚙️
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ── HOME ── */}
        <section
          id="home"
          className="section-shell relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#406AAF] via-[#427AB5] to-[#406AAF] px-6 pt-28"
        >
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border-[34px] border-[#F7DD7D]/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_42%)]" />

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
            <div className="mb-6 rounded-full border border-[#F7DD7D]/40 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#FFE8BE]">
              Muslim in Tech Collaborative at CSUF
            </div>

            <h1 className="text-[5rem] font-black leading-none tracking-[-0.08em] text-white md:text-[8rem] lg:text-[10rem]">
              <span className="shake-letter inline-block cursor-default">M </span>
              <span className="shake-letter inline-block cursor-default">T </span>
              <span className="shake-letter inline-block cursor-default">C </span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-light uppercase tracking-[0.35em] text-[#FFE8BE] md:text-2xl">
              Muslim in Tech Collaborative
            </p>
            <p className="mt-3 max-w-2xl text-base text-white/85 md:text-lg">
              A space where faith, leadership, and technology come together at California State University, Fullerton.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection("about")}
                className="rounded-full bg-[#F7DD7D] px-7 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#406AAF] shadow-lg transition hover:-translate-y-1 hover:bg-[#FFE8BE]"
              >
                Learn More
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="rounded-full border border-white/50 px-7 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                Connect
              </button>
            </div>

            <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              {[
                ["50+", "Members"],
                ["8", "Core Leaders"],
                ["CSUF", "Campus"],
                ["Tech & Faith", "Focus"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="text-3xl font-black text-[#F7DD7D] md:text-4xl">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.25em] text-white/80">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="section-shell bg-[#FFE8BE] px-6 py-24 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#406AAF]">About</p>
              <h2 className="text-4xl font-black text-[#406AAF] md:text-5xl">About MTC</h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-700 md:text-lg">
                MTC is a student organization dedicated to building a supportive and empowering community for students pursuing careers in technology.
              </p>
            </div>

            <div className="mb-10 rounded-[2rem] bg-white/70 p-8 shadow-sm ring-1 ring-[#427AB5]/10 md:p-10">
              <div className="grid gap-6 md:grid-cols-[10px,1fr] md:items-start">
                <div className="rounded-full bg-[#F7DD7D]" />
                <div>
                  <h3 className="text-2xl font-bold text-[#406AAF]">Our Mission</h3>
                  <p className="mt-3 max-w-4xl text-base leading-8 text-slate-700">
                    We bridge the gap between faith identity and professional ambition through mentorship, networking, events, and collaborative projects.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {aboutCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-[#427AB5]/10 transition hover:-translate-y-1"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7DD7D] text-2xl">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#406AAF]">{card.title}</h3>
                  <p className="mt-3 leading-7 text-slate-700">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section id="team" className="section-shell bg-[#F7DD7D]/30 px-6 py-24 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#406AAF]">Team</p>
              <h2 className="text-4xl font-black text-[#406AAF] md:text-5xl">Meet Our Team</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700">
                The students behind the vision, events, and community building at MTC.
              </p>
            </div>

            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#406AAF]">Board Members by Term</h3>
                <p className="mt-2 max-w-2xl text-base leading-7 text-slate-700">
                  Select a term to view the team members serving during that semester.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-3xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-[#427AB5]/10">
                <label htmlFor="term-select" className="text-sm font-semibold text-slate-700">
                  Term
                </label>
                <select
                  id="term-select"
                  value={selectedBoardTerm}
                  onChange={(event) => setSelectedBoardTerm(event.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#406AAF]"
                >
                  {boardTerms.map((term) => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentTeam.length > 0 ? (
                currentTeam.map((member) => (
                  <div
                    key={member.name}
                    className="rounded-[2rem] bg-white p-7 text-center shadow-sm ring-1 ring-[#427AB5]/10 transition hover:-translate-y-1"
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#427AB5] text-2xl font-black text-white">
                      {initials(member.name)}
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-slate-900">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-[#406AAF]">{member.role}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-[2rem] bg-white/70 p-12 text-center ring-1 ring-[#427AB5]/10">
                  <div className="text-5xl mb-4">👥</div>
                  <p className="text-lg font-bold text-[#406AAF]">No members for this term</p>
                  <p className="mt-2 text-slate-600">Check back soon or select a different term.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        <section id="events" className="section-shell bg-[#FFE8BE] px-6 py-24 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#406AAF]">Events</p>
              <h2 className="text-4xl font-black text-[#406AAF] md:text-5xl">What's Happening</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700">
                Workshops, networking, and community gatherings that help our members grow.
              </p>
            </div>

            {eventsToShow.length === 0 ? (
              <div className="rounded-[2rem] bg-white/70 p-12 text-center ring-1 ring-[#427AB5]/10">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-xl font-bold text-[#406AAF]">No Upcoming Events</p>
                <p className="mt-2 text-slate-600">Check back soon — new events are on the way!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {eventsToShow.map((event) => {
                  const timeStr =
                    event.start || event.end
                      ? fmt12(event.start) + (event.end ? " – " + fmt12(event.end) : "")
                      : event.time || "";
                  return (
                    <div
                      key={event.id}
                      className="grid gap-5 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#427AB5]/10 md:grid-cols-[130px,1fr] md:items-start transition hover:-translate-y-1"
                    >
                      <div className="rounded-2xl bg-[#427AB5] p-4 text-center text-white">
                        <div className="text-sm font-semibold uppercase tracking-[0.25em]">
                          {formatDateDisplay(event.date)}
                        </div>
                        {timeStr && (
                          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[#FFE8BE]">{timeStr}</div>
                        )}
                      </div>
                      <div>
                        <div className="inline-block rounded-full bg-[#F7DD7D] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#406AAF]">
                          {event.tag}
                        </div>
                        <h3 className="mt-3 text-2xl font-bold text-slate-900">{event.title}</h3>
                        <p className="mt-3 leading-7 text-slate-700">{event.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── LIGHTBOX ── */}
        {lightbox && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <div
              className="relative max-w-3xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-white text-3xl font-black hover:text-[#F7DD7D] transition"
              >
                ✕
              </button>
              <img
                src={lightbox.src}
                alt={lightbox.caption}
                className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              {lightbox.caption && (
                <p className="mt-3 text-center text-white font-semibold text-lg">{lightbox.caption}</p>
              )}
            </div>
          </div>
        )}

        {/* ── GALLERY ── */}
        <section id="gallery" className="section-shell bg-[#F7DD7D]/30 px-6 py-24 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#406AAF]">Gallery</p>
              <h2 className="text-4xl font-black text-[#406AAF] md:text-5xl">Community Moments</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700">
                A visual snapshot of events, projects, and memories from the MTC community.
              </p>
            </div>

            {gallery.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#427AB5]/10 cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => setLightbox({ src: item.src, caption: item.caption })}
                  >
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="h-full w-full object-cover rounded-[1.5rem]"
                    />
                    <div className="absolute inset-4 flex items-end rounded-[1.5rem] bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                      <div className="p-4">
                        <p className="text-white font-bold text-lg leading-tight">{item.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {galleryFallback.map((item, index) => (
                  <div
                    key={item}
                    className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#427AB5]/10"
                  >
                    <div className="flex h-full items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#427AB5] via-[#406AAF] to-[#F7DD7D] p-6 text-center">
                      <div>
                        <div className="text-5xl">📸</div>
                        <div className="mt-4 text-lg font-bold text-white">{item}</div>
                        <div className="mt-2 text-sm text-[#FFE8BE]">MTC memory #{index + 1}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="section-shell bg-[#FFE8BE] px-6 py-24 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#406AAF]">Contact</p>
              <h2 className="text-4xl font-black text-[#406AAF] md:text-5xl">Connect With Us</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700">
                Reach out for collaborations, events, or to learn more about joining the MTC community.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr,1.1fr]">
              <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#427AB5]/10">
                <h3 className="text-2xl font-bold text-[#406AAF]">Get in Touch</h3>
                <p className="mt-4 leading-7 text-slate-700">
                  Follow our socials and stay updated on opportunities, events, and announcements.
                </p>

                <div className="mt-8 space-y-4">
                  <a
                    href="#"
                    className="flex items-center gap-4 rounded-2xl border border-[#427AB5]/10 bg-[#FFE8BE]/50 p-4 transition hover:translate-x-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7DD7D] text-2xl">📸</div>
                    <div>
                      <div className="font-bold text-slate-900">Instagram</div>
                      <div className="text-sm text-slate-600">@mtccsuf</div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-4 rounded-2xl border border-[#427AB5]/10 bg-[#FFE8BE]/50 p-4 transition hover:translate-x-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#427AB5] text-2xl text-white">💼</div>
                    <div>
                      <div className="font-bold text-slate-900">LinkedIn</div>
                      <div className="text-sm text-slate-600">Muslim Tech Collaborative @ CSUF</div>
                    </div>
                  </a>
                </div>
              </div>

              
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#427AB5]/15 bg-[#406AAF] px-6 py-5 text-center text-sm font-medium tracking-[0.18em] text-[#FFE8BE] uppercase">
        Copyright @MTC CSUF
      </footer>
    </div>
  );
}