const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer');
const db = require('./db');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Temporarily store unverified users
const pendingUsers = new Map();

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login', { error: null }));
app.get('/register', (req, res) => res.render('register', { error: null }));


// Register
app.post('/register', (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!username || !email || !password) {
    return res.render('register', { error: 'All fields are required' });
  }

  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, existingUser) => {
    if (err) {
      console.error(err);
      return res.render('register', { error: 'Database error' });
    }

    if (existingUser) {
      return res.render('register', { error: 'Username or email already exists' });
    }

    const token = jwt.sign({ username, email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationUrl = `http://localhost:${PORT}/verify/${token}`;

    // Store temporarily before verification
    pendingUsers.set(email, { username, password });

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click the link to verify your account:</p><a href="${verificationUrl}">${verificationUrl}</a>`
    }).then(() => {
      res.send('✅ Verification email sent. Check your inbox.');
    }).catch(error => {
      console.error('❌ Error sending email:', error);
      res.render('register', { error: 'Failed to send verification email' });
    });
  });
});

// Verify email
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
      res.send('✅ Email verified! You can now <a href="/login">login</a>.');
    });
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    res.send('Invalid or expired token.');
  }
});

// Login
app.post('/login', (req, res) => {
  const loginId = req.body.loginId?.trim().toLowerCase(); // accepts either username or email
  const password = req.body.password?.trim();

  if (!loginId || !password) {
    return res.render('login', { error: 'All fields are required' });
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
      return res.render('login', { error: 'Database error' });
    }

    if (user) {
      res.render('dashboard', { user });
    } else {
      res.render('login', { error: 'INVALID CREDENTIALS OR UNVERIFIED E-MAIL' });
    }
  });
});


app.get('/test', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('React build not found. Please run "npm run build" in your frontend directory.');
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));


  // Handle React routing, return all requests to React app
app.get(/^\/(?!api).*/, (req, res) => {  // Match all except /api routes
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
