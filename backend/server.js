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
  - PUT  http://localhost:${PORT}/api/content/:section (更新特定區塊)
  - POST http://localhost:${PORT}/api/content      (更新全站資料)
  
  資料檔案: backend/data.json
  
  伺服器運行中... 🚀
  `);
});

export default app;