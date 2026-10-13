const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'trashigang_esys.db'), (err) => {
  if (err) console.error("Database Connection Error:", err);
  else console.log("Connected to Trashigang E-Sys SQLite Database.");
});

// Create Database Tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS notesheets (
    id TEXT PRIMARY KEY,
    type TEXT,
    subject TEXT,
    officer TEXT,
    initiatorSector TEXT,
    targetExecutive TEXT,
    budget REAL,
    status TEXT,
    date TEXT,
    remarksText TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS settlements (
    id TEXT PRIMARY KEY,
    notesheetId TEXT,
    amount REAL,
    voucherNo TEXT,
    remarks TEXT,
    date TEXT
  )`);
});

// REST API Endpoints
app.get('/api/notesheets', (req, res) => {
  db.all("SELECT * FROM notesheets ORDER BY date DESC", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/notesheets', (req, res) => {
  const { id, type, subject, officer, initiatorSector, targetExecutive, budget, status, date } = req.body;
  const stmt = db.prepare("INSERT OR REPLACE INTO notesheets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '')");
  stmt.run([id, type, subject, officer, initiatorSector, targetExecutive, budget, status, date], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

app.post('/api/settlements', (req, res) => {
  const { id, notesheetId, amount, voucherNo, remarks, date } = req.body;
  const stmt = db.prepare("INSERT INTO settlements VALUES (?, ?, ?, ?, ?, ?)");
  stmt.run([id, notesheetId, amount, voucherNo, remarks, date], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Trashigang E-Sys Server running at http://localhost:${PORT}`);
});
