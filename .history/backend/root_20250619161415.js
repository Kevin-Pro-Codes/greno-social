const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer'); // Optional
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static login.html
app.use(express.static(path.join(__dirname, 'public')));

// Serve React app after login
app.use('/app', express.static(path.join(__dirname, 'frontend/dist')));

// For React Router (fallback for any /app/* route)
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Store unverified users temporarily (for email verification)
const pendingUsers = new Map();

// ========== ROUTES ==========

// Login page (static)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// POST /login — verify credentials
app.post('/login', (req, res) => {
  const loginId = req.body.loginId?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!loginId || !password) {
    return res.send('All fields are required');
  }

  const query = `
    SELECT * FROM users 
    WHERE (LOWER(email) = ? OR LOWER(username) = ?) 
    AND password = ? 
    AND verified = 1
  `;

  db.get(query, [loginId, loginId, password], (err, user) => {
    if (err) {
      console.error('❌ DB error:', err);
      return res.send('Database error');
    }

    if (user) {
      return res.redirect('/app');
    } else {
      res.send('❌ INVALID CREDENTIALS OR UNVERIFIED EMAIL');
    }
  });
});

// Register page (optional)
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html')); // Optional static page
});

// POST /register — logic to create unverified user
app.post('/register', (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!username || !email || !password) {
    return res.send('All fields are required');
  }

  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, existingUser) => {
    if (err) {
      console.error(err);
      return res.send('Database error');
    }

    if (existingUser) {
      return res.send('Username or email already exists');
    }

    const token = jwt.sign({ username, email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationUrl = `http://localhost:${PORT}/verify/${token}`;

    pendingUsers.set(email, { username, password });

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click to verify your account:</p><a href="${verificationUrl}">${verificationUrl}</a>`
    }).then(() => {
      res.send('✅ Verification email sent. Check your inbox.');
    }).catch(error => {
      console.error('❌ Error sending email:', error);
      res.send('Failed to send verification email');
    });
  });
});

// Email verification route
app.get('/verify/:token', (req, res) => {
  try {
    const { username, email, password } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    if (!pendingUsers.has(email)) {
      return res.send('❌ Invalid or expired verification link.');
    }

    const insertQuery = `INSERT INTO users (username, email, password, verified) VALUES (?, ?, ?, 1)`;
    db.run(insertQuery, [username, email, password], function (err) {
      if (err) {
        console.error('❌ DB insert error:', err);
        return res.send('Error creating user in database.');
      }

      pendingUsers.delete(email);
      res.send('✅ Email verified! You can now <a href="/">log in</a>.');
    });
  } catch (err) {
    console.error('❌ Token error:', err);
    res.send('Invalid or expired token.');
  }
});

  // Handle React routing, return all requests to React app
app.get(/^\/(?!api).*/, (req, res) => {  // Match all except /api routes
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
