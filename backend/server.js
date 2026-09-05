import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SEO headers
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'index, follow');
  if (req.path.endsWith('.html')) {
    // Always revalidate page HTML so deployments are visible immediately.
    res.setHeader('Cache-Control', 'no-cache');
  }
  next();
});

// Serve static files from dist/
const DIST_DIR = path.join(__dirname, '..', 'dist');
app.use(express.static(DIST_DIR));

// Load data
const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/content - Return all site content
app.get('/api/content', (req, res) => {
  try {
    const data = loadData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load content' });
  }
});

// GET /api/content/:section - Return specific section
app.get('/api/content/:section', (req, res) => {
  try {
    const data = loadData();
    const section = req.params.section;
    
    if (!data[section]) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    res.json(data[section]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load section' });
  }
});

// PUT /api/content/:section - Update specific section
app.put('/api/content/:section', (req, res) => {
  try {
    const data = loadData();
    const section = req.params.section;
    
    data[section] = req.body;
    saveData(data);
    
    res.json({ success: true, message: `${section} updated` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// POST /api/content - Update entire content (admin use)
app.post('/api/content', (req, res) => {
  try {
    saveData(req.body);
    res.json({ success: true, message: 'Content updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Google Sheets 積分資料
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/10NhNqFPifLKOxVr14cWWDYvlyH3YXa7euTTDTr25dkY/gviz/tq?tqx=out:csv';
let scoresCache = { data: null, timestamp: 0 };
const CACHE_TTL = 10000; // 10 秒快取

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h, i) => {
    const header = h.replace(/"/g, '').trim();
    // The score sheet's first header is blank, but that column contains names.
    return header || (i === 0 ? '成員' : `column${i + 1}`);
  });
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.replace(/"/g, '').trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

app.get('/api/scores', async (req, res) => {
  try {
    if (Date.now() - scoresCache.timestamp < CACHE_TTL && scoresCache.data) {
      return res.json(scoresCache.data);
    }

    const response = await fetch(SHEET_CSV_URL);
    const csv = await response.text();
    const rows = parseCSV(csv);

    const scores = rows
      .filter(r => r['成員'] && (r['學員分'] !== '' || r['講師分'] !== ''))
      .map(r => {
        const studentScore = Number.parseInt(r['學員分'], 10) || 0;
        const instructorScore = Number.parseInt(r['講師分'], 10) || 0;

        return {
          rank: 0,
          name: r['成員'],
          studentScore,
          instructorScore,
          totalScore: studentScore + instructorScore,
        };
      });

    scores.sort((a, b) => b.totalScore - a.totalScore);
    let rank = 0;
    scores.forEach((s, i, arr) => {
      const prev = arr[i - 1];
      if (!prev || s.totalScore !== prev.totalScore) rank++;
      s.rank = rank;
    });

    scoresCache = { data: scores, timestamp: Date.now() };
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Catch-all: serve index.html for SPA routes (optional, for future use)
app.get(/.*/, (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
=================================
  無學院 Wu Academy 後端伺服器
=================================
  
  靜態檔案: ${DIST_DIR}
  
  API 端點:
  - GET  http://localhost:${PORT}/api/content      (取得全站資料)
  - GET  http://localhost:${PORT}/api/content/stats  (取得統計資料)
  - GET  http://localhost:${PORT}/api/content/awards (取得獎項資料)
  - GET  http://localhost:${PORT}/api/scores        (取得積分排行榜)
  - PUT  http://localhost:${PORT}/api/content/:section (更新特定區塊)
  - POST http://localhost:${PORT}/api/content      (更新全站資料)
  
  資料檔案: backend/data.json
  試算表: Google Sheets (10s 快取)
  
  伺服器運行中... 🚀
  `);
});

export default app;
