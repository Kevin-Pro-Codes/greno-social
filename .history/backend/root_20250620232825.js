const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing
const transporter = require('./mailer');
const db = require('./db');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration (optional if frontend and backend are on same origin)
app.use(cors({
  origin: 'http://localhost:3000', // Adjust if frontend is on a different port
  credentials: true,
}));

// API routes should come before static files and catch-all
app.post('/api/login', async (req, res) => {
  console.log('Incoming login:', req.body);

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

    // Compare hashed password
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
    res.status(500).json({ error: 'Internal error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email.toLowerCase()],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ username, email, password: hashedPassword }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationUrl = `http://localhost:${PORT}/api/verify/${token}`;

    // Store temporarily before verification
    const pendingUsers = new Map();
    pendingUsers.set(email, { username, hashedPassword });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click the link to verify your account:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    res.json({ message: 'Verification email sent. Check your inbox.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

app.get('/api/verify/:token', async (req, res) => {
  try {
    const { username, email, password } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const pendingUsers = new Map();

    if (!pendingUsers.has(email)) {
      return res.status(400).json({ error: 'Invalid or expired verification link' });
    }

    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password, verified) VALUES (?, ?, ?, 1)',
        [username, email, password, 1],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    pendingUsers.delete(email);
    res.json({ message: 'Email verified! You can now login.' });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

// Serve static files and React app *after* API routes
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all for React routing
app.get('*', (req, res) => {
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