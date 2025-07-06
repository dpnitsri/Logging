const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const LOG_FILE = path.join(__dirname, 'logs.json');

app.use(cors());
app.use(express.json());

// Helper to read logs from file
function readLogs() {
  if (!fs.existsSync(LOG_FILE)) return [];
  const data = fs.readFileSync(LOG_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write logs to file
function writeLogs(logs) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// POST /logs - Ingest a new log entry
app.post('/logs', (req, res) => {
  const { level, message, timestamp, ...rest } = req.body;
  if (!level || !message || !timestamp) {
    return res.status(400).json({ error: 'level, message, and timestamp are required.' });
  }
  const logs = readLogs();
  const newLog = { level, message, timestamp, ...rest };
  logs.push(newLog);
  writeLogs(logs);
  res.status(201).json({ success: true });
});

// GET /logs - Query logs with filters
app.get('/logs', (req, res) => {
  let logs = readLogs();
  const { level, search, start, end } = req.query;

  if (level) logs = logs.filter(log => log.level === level);
  if (search) logs = logs.filter(log => log.message.toLowerCase().includes(search.toLowerCase()));
  if (start) logs = logs.filter(log => new Date(log.timestamp) >= new Date(start));
  if (end) logs = logs.filter(log => new Date(log.timestamp) <= new Date(end));

  res.json(logs);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Log API server running on http://localhost:${PORT}`);
});
