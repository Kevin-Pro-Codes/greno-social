const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer');
const db = require('./db');
const path = require('path');
const cors = require('cors');
const app = express();
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv').config();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

let posts = [];

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('views'));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));


app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin || 
      origin.startsWith('http://localhost') || 
      origin.startsWith('http://192.168.6')
    ) {
      callback(null, true); // ✅ Allow local development origins
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true,
}));



app.use(session({
  secret: process.env.SESSION_SECRET || 'some-secret', // keep this secret in env variables
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true if HTTPS
}));

const pendingUsers = new Map();

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login', { error: null }));
app.get('/register', (req, res) => res.render('register', { error: null }));

app.get('/api/check-session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});


app.post('/api/login', (req, res) => {
  console.log('🔐 Incoming login request:', req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '❌ Missing credentials' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('❌ DB error during login:', err);
        return res.status(500).json({ error: '❌ Internal error' });
      }

      if (!row) {
        console.log('❌ Login failed: Invalid credentials');
        return res.status(401).json({ error: '❌ INVALID CREDENTIALS' });
      }

      console.log('✅ Login successful:', row);
      res.json({ message: '✅ Success', user: row });
    }
  );
});

app.post('/api/register', (req, res) => {
  const username = req.body.username?.trim();
  const name = req.body.name?.trim();  
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!username || !name || !email || !password) {
    return res.render('register', { error: '❌ All fields are required' });
  }

  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, existingUser) => {
    if (err) {
      console.error('❌ Database error during registration:', err);
      return res.render('register', { error: '❌ Database error' });
    }

    if (existingUser) {
      return res.render('register', { error: '❌ Username or email already exists' });
    }

    const token = jwt.sign({ username, name, email, password }, process.env.JWT_SECRET, { expiresIn: '1h' }); // include name in token
    const verificationUrl = `http://localhost:${PORT}/verify/${token}`;

    pendingUsers.set(email, { username, name, password }); // store name temporarily here too

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email ✉️',
      html: `<p>✅ Click the link to verify your account:</p><a href="${verificationUrl}">${verificationUrl}</a>`
    }).then(() => {
      console.log(`✅ Verification email sent to ${email}`);
      res.json({ message: '✅ Verification email sent. Check your inbox.' });
    }).catch(error => {
      console.error('❌ Error sending verification email:', error);
      res.render('register', { error: '❌ Failed to send verification email' });
    });
  });
});


app.get('/verify/:token', (req, res) => {
  try {
    const { username, name, email, password } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    console.log('Decoded token data:', { username, name, email, password });

    if (!pendingUsers.has(email)) {
      return res.send('❌ Invalid or expired verification link.');
    }

    const insertQuery = `INSERT INTO users (username, name, email, password, verified) VALUES (?, ?, ?, ?, 1)`;
    db.run(insertQuery, [username, name, email, password], function (err) {
      if (err) {
        console.error('❌ DB insert error:', err);
        return res.send('❌ Error creating user in database.');
      }

      pendingUsers.delete(email);
      console.log(`✅ ${username} verified and added to database with name: ${name}`);
      res.send('✅ Email verified! You can now <a href="/login">login</a>.');
    });
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    res.send('❌ Invalid or expired token.');
  }
});


app.get('/api/posts/user/:userId', (req, res) => {
  const userId = req.params.userId;
  db.all(
    'SELECT * FROM posts WHERE user_id = ? ORDER BY timestamp DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('DB error:', err);
        res.status(500).json({ error: 'Failed to fetch user posts' });
      } else {
        res.json(rows);
      }
    }
  );
});


app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching posts:', err);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    res.json(rows);
  });
});


app.post('/api/posts', (req, res) => {
  console.log('Incoming post request:', req.body);

  const { user_id, author, post, avatar } = req.body;

  if (!user_id || !author) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

const insertQuery = `
  INSERT INTO posts (user_id, author, post, avatar)
  VALUES (?, ?, ?, ?)
`;

  db.run(insertQuery, [user_id, author, post, avatar], function (err) {
    if (err) {
      console.error('❌ Error inserting post:', err);
      return res.status(500).json({ error: 'Failed to save post' });
    }

    db.get('SELECT * FROM posts WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve post' });
      }
      res.json(row);
    });
  });
});



app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;

  db.run('DELETE FROM posts WHERE id = ?', [postId], function (err) {
    if (err) {
      console.error('❌ Error deleting post:', err.message);
      return res.status(500).json({ error: 'Failed to delete post' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: '✅ Post deleted' });
  });
});



app.post('/api/users/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Your logic to save avatar path to user record in DB
    // Example:
    await User.update({ avatar: file.path }, { where: { id: userId } });

    res.status(200).json({ message: 'Avatar uploaded successfully' });
  } catch (error) {
    console.error('Avatar upload failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  if (req.accepts('json')) {
    res.status(500).json({ 
      error: '❌ Internal server error',
      message: err.message 
    });
  } else {
    res.status(500).send('❌ Internal server error');
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});