const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer');
const db = require('./db');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv').config();

app.use(bodyParser.json()); // Add this for JSON parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// CORS Middleware - place before routes
app.use(cors({
  origin: 'http://localhost:5180', // Be specific instead of '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

const pendingUsers = new Map();

// API Routes
app.post('/api/login', async (req, res) => {
  try {
    const loginId = req.body.loginId?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!loginId || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
      SELECT * FROM users 
      WHERE (LOWER(email) = ? OR LOWER(username) = ?) 
      AND password = ? 
      AND verified = 1
    `;

    db.get(query, [loginId, loginId, password], (err, user) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (user) {
        // Create a token if you're using JWT for sessions
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
      } else {
        res.status(401).json({ error: 'Invalid credentials or unverified email' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/register', (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, existingUser) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const token = jwt.sign({ username, email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationUrl = `http://localhost:${PORT}/api/verify/${token}`;

    pendingUsers.set(email, { username, password });

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click the link to verify your account:</p><a href="${verificationUrl}">${verificationUrl}</a>`
    }).then(() => {
      res.json({ message: 'Verification email sent. Check your inbox.' });
    }).catch(error => {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send verification email' });
    });
  });
});

app.get('/api/verify/:token', (req, res) => {
  try {
    const { username, email, password } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    if (!pendingUsers.has(email)) {
      return res.status(400).send('Invalid or expired verification link.');
    }

    const insertQuery = `INSERT INTO users (username, email, password, verified) VALUES (?, ?, ?, 1)`;
    db.run(insertQuery, [username, email, password], function (err) {
      if (err) {
        console.error('DB insert error:', err);
        return res.status(500).send('Error creating user in database.');
      }

      pendingUsers.delete(email);
      res.send('Email verified! You can now <a href="/login">login</a>.');
    });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(400).send('Invalid or expired token.');
  }
});

// Serve React App - must be after all API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});