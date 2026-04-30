/**
 * MTC Admin Server
 * Run locally with: npm run admin
 * This server handles saving events to JSON and uploading photos to disk.
 * It is NOT deployed — it only runs on your machine so you can manage content,
 * then push the resulting files (public/data/ and public/gallery/) to GitHub.
 */

const express = require('express');
const multer  = require('multer');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = 3001;

// ── Paths ──
const PUBLIC_DIR   = path.join(__dirname, 'public');
const DATA_DIR     = path.join(PUBLIC_DIR, 'data');
const GALLERY_DIR  = path.join(PUBLIC_DIR, 'gallery');
const EVENTS_FILE  = path.join(DATA_DIR, 'events.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const BOARD_FILE   = path.join(DATA_DIR, 'board.json');

// Ensure folders exist
[DATA_DIR, GALLERY_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR)); // serve public/ so admin.html loads

// ── Multer (image uploads) ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, GALLERY_DIR),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `img_${Date.now()}_${Math.random().toString(36).slice(2,7)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// ── Helpers ──
function readJSON(file, fallback = []) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return fallback; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ═══════════════════════════════════════════
//  EVENTS API
// ═══════════════════════════════════════════

// GET all events
app.get('/api/events', (req, res) => {
  res.json(readJSON(EVENTS_FILE));
});

// POST add event
app.post('/api/events', (req, res) => {
  const { title, date, start, end, tag, desc } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'title and date required' });

  const events = readJSON(EVENTS_FILE);
  const newEvent = { id: Date.now(), title, date, start: start||'', end: end||'', tag: tag||'Other', desc: desc||'' };
  events.push(newEvent);
  events.sort((a, b) => a.date.localeCompare(b.date));
  writeJSON(EVENTS_FILE, events);
  res.json(newEvent);
});

// DELETE event
app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const events = readJSON(EVENTS_FILE).filter(e => e.id !== id);
  writeJSON(EVENTS_FILE, events);
  res.json({ ok: true });
});

// ═══════════════════════════════════════════
//  GALLERY API
// ═══════════════════════════════════════════

// GET all gallery items
app.get('/api/gallery', (req, res) => {
  res.json(readJSON(GALLERY_FILE));
});

// POST upload photo(s)
app.post('/api/gallery/upload', upload.array('photos', 20), (req, res) => {
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'No files uploaded' });

  const caption = req.body.caption || 'MTC Moment';
  const gallery = readJSON(GALLERY_FILE);

  const added = req.files.map((file, i) => ({
    id: Date.now() + i,
    filename: file.filename,
    src: `/gallery/${file.filename}`,
    caption: req.files.length > 1 ? `${caption} (${i + 1})` : caption,
    addedAt: new Date().toISOString()
  }));

  gallery.push(...added);
  writeJSON(GALLERY_FILE, gallery);
  res.json(added);
});

// DELETE gallery photo
app.delete('/api/gallery/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const gallery = readJSON(GALLERY_FILE);
  const item = gallery.find(g => g.id === id);

  if (item) {
    const filePath = path.join(GALLERY_DIR, item.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // delete actual image file
    writeJSON(GALLERY_FILE, gallery.filter(g => g.id !== id));
  }
  res.json({ ok: true });
});

// ═══════════════════════════════════════════
//  BOARD MEMBERS API
// ═══════════════════════════════════════════

// GET all board members
app.get('/api/board', (req, res) => {
  res.json(readJSON(BOARD_FILE));
});

// POST add board member
app.post('/api/board', (req, res) => {
  const { term, name, role } = req.body;
  if (!term || !name || !role) return res.status(400).json({ error: 'term, name, and role required' });

  const board = readJSON(BOARD_FILE);
  const termMembers = board.filter(m => m.term === term);
  const nextRank = termMembers.length > 0 ? Math.max(...termMembers.map(m => m.rank || 0)) + 1 : 1;
  const newMember = { id: Date.now(), term, name, role, rank: nextRank };
  board.push(newMember);
  board.sort((a, b) => {
    const termOrder = { 'Fall 2025': 0, 'Spring 2026': 1, 'Fall 2026': 2 };
    const termSort = (termOrder[a.term] || 999) - (termOrder[b.term] || 999);
    return termSort || (a.rank || 999) - (b.rank || 999);
  });
  writeJSON(BOARD_FILE, board);
  res.json(newMember);
});

// PUT update board member rank
app.put('/api/board/:id/rank', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { direction } = req.body; // 'up' or 'down'
  if (!direction) return res.status(400).json({ error: 'direction required' });

  const board = readJSON(BOARD_FILE);
  const member = board.find(m => m.id === id);
  if (!member) return res.status(404).json({ error: 'Member not found' });

  const termMembers = board.filter(m => m.term === member.term).sort((a, b) => (a.rank || 999) - (b.rank || 999));
  const idx = termMembers.findIndex(m => m.id === id);

  if (direction === 'up' && idx > 0) {
    const swap = termMembers[idx - 1];
    const temp = member.rank;
    member.rank = swap.rank;
    swap.rank = temp;
  } else if (direction === 'down' && idx < termMembers.length - 1) {
    const swap = termMembers[idx + 1];
    const temp = member.rank;
    member.rank = swap.rank;
    swap.rank = temp;
  }

  writeJSON(BOARD_FILE, board);
  res.json(member);
});


// DELETE board member
app.delete('/api/board/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const board = readJSON(BOARD_FILE).filter(m => m.id !== id);
  writeJSON(BOARD_FILE, board);
  res.json({ ok: true });
});

// ── Start ──
app.listen(PORT, () => {
  console.log('');
  console.log('  🔒  MTC Admin Server running!');
  console.log(`  ➜  Admin Panel: http://localhost:${PORT}/admin.html`);
  console.log('');
  console.log('  Add events & upload photos, then push to GitHub.');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
