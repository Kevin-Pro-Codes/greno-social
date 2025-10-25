const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer');
const db = require('./db');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration (optional if frontend and backend are on the same origin)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// API routes
app.post('/api/login', async (req, res) => {
  console.log('Incoming login request:', req.body); // Debug log

  const { loginId, password } = req.body;
  if (!loginId || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const row = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE (LOWER(email) = ? OR LOWER(username) = ?)',
        [loginId.toLowerCase(), loginId.toLowerCase()],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });

    if (!row) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, row.password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!row.verified) {
      return res.status(401).json({ error: 'Email not verified' });
    }

    console.log('Login successful:', row);
    res.json({ message: 'Success', user: { id: row.id, username: row.username } });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files *after* API routes
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all for React routing
app.get('*', (req, res) => {
  console.log('Catch-all route hit:', req.originalUrl); // Debug log
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});