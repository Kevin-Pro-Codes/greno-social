const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const crypto = require('crypto');
const { promisify } = require('util');

// Database setup (using sqlite3)
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

// Email transporter (using nodemailer)
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// File upload handling
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-session-secret';

let posts = [];
const pendingUsers = new Map();
const sessions = new Map();

class Server {
  constructor() {
    this.middleware = [];
    this.routes = [];
    this.staticDirs = [];
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  get(path, handler) {
    this.routes.push({ method: 'GET', path, handler });
  }

  post(path, handler) {
    this.routes.push({ method: 'POST', path, handler });
  }

  delete(path, handler) {
    this.routes.push({ method: 'DELETE', path, handler });
  }

  static(directory) {
    this.staticDirs.push(directory);
  }

  async handleRequest(req, res) {
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    req.pathname = parsedUrl.pathname;
    req.query = parsedUrl.query;

    // Parse cookies
    req.cookies = this.parseCookies(req.headers.cookie);

    // Handle session
    await this.handleSession(req, res);

    // Apply middleware
    for (const middleware of this.middleware) {
      if (await middleware(req, res)) {
        return;
      }
    }

    // Parse body for POST requests
    if (req.method === 'POST') {
      await this.parseBody(req);
    }

    // Serve static files
    for (const staticDir of this.staticDirs) {
      if (await this.serveStatic(req, res, staticDir)) {
        return;
      }
    }

    // Handle routes
    const route = this.routes.find(r => 
      r.method === req.method && this.matchRoute(r.path, req.pathname)
    );

    if (route) {
      try {
        await route.handler(req, res);
      } catch (error) {
        this.handleError(error, req, res);
      }
    } else {
      // Serve SPA for non-API routes
      if (!req.pathname.startsWith('/api')) {
        await this.serveSPA(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    }
  }

  matchRoute(routePath, requestPath) {
    if (routePath === requestPath) return true;
    
    // Handle route parameters
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');
    
    if (routeParts.length !== requestParts.length) return false;
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) continue;
      if (routeParts[i] !== requestParts[i]) return false;
    }
    
    return true;
  }

  parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;
    
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
    
    return cookies;
  }

  async handleSession(req, res) {
    const sessionId = req.cookies['sessionId'];
    
    if (sessionId && sessions.has(sessionId)) {
      req.session = sessions.get(sessionId);
    } else {
      const newSessionId = crypto.randomBytes(16).toString('hex');
      req.session = { id: newSessionId };
      sessions.set(newSessionId, req.session);
      
      res.setHeader('Set-Cookie', `sessionId=${newSessionId}; HttpOnly; Max-Age=86400`);
    }
  }

  async parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        const contentType = req.headers['content-type'];
        
        if (contentType && contentType.includes('application/json')) {
          try {
            req.body = JSON.parse(body);
          } catch (error) {
            req.body = {};
          }
        } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
          req.body = querystring.parse(body);
        } else {
          req.body = {};
        }
        
        resolve();
      });
      
      req.on('error', reject);
    });
  }

  async serveStatic(req, res, staticDir) {
    if (req.method !== 'GET') return false;
    
    const filePath = path.join(__dirname, staticDir, req.pathname);
    
    try {
      const stats = await promisify(fs.stat)(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml'
        };
        
        const contentType = contentTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
        return true;
      }
    } catch (error) {
      // File doesn't exist or other error
    }
    
    return false;
  }

  async serveSPA(req, res) {
    const spaPath = path.join(__dirname, '../frontend/dist/index.html');
    
    try {
      const content = await promisify(fs.readFile)(spaPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('SPA not found');
    }
  }

  handleError(error, req, res) {
    console.error('❌ Server error:', error);
    
    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
    
    if (acceptsJson) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: '❌ Internal server error',
        message: error.message 
      }));
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('❌ Internal server error');
    }
  }

  json(res, data) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  redirect(res, location) {
    res.writeHead(302, { Location: location });
    res.end();
  }

  render(res, view, data = {}) {
    // Simple template rendering (replace with your template engine)
    const viewsDir = path.join(__dirname, 'views');
    const filePath = path.join(viewsDir, `${view}.html`);
    
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Template not found');
        return;
      }
      
      // Simple template variable replacement
      let rendered = content;
      for (const [key, value] of Object.entries(data)) {
        rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(rendered);
    });
  }

  start() {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(PORT, () => {
      console.log(`✅ Node.js server running at http://localhost:${PORT}`);
    });

    return server;
  }
}

// Create server instance
const app = new Server();

// Middleware
app.use((req, res) => {
  // CORS middleware
  const origin = req.headers.origin;
  if (origin && (origin.startsWith('http://localhost') || origin.startsWith('http://192.168.6'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return true;
  }
  
  return false;
});

// Static files
app.static('views');
app.static(path.join(__dirname, '../frontend/dist'));
app.static('uploads');

// Routes
app.get('/', (req, res) => app.redirect(res, '/login'));
app.get('/login', (req, res) => app.render(res, 'login', { error: null }));
app.get('/register', (req, res) => app.render(res, 'register', { error: null }));

app.get('/api/check-session', (req, res) => {
  if (req.session && req.session.user) {
    app.json(res, { loggedIn: true });
  } else {
    app.json(res, { loggedIn: false });
  }
});

app.post('/api/login', (req, res) => {
  console.log('🔐 Incoming login request:', req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    app.json(res, { error: '❌ Missing credentials' }, 400);
    return;
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('❌ DB error during login:', err);
        app.json(res, { error: '❌ Internal error' }, 500);
        return;
      }

      if (!row) {
        console.log('❌ Login failed: Invalid credentials');
        app.json(res, { error: '❌ INVALID CREDENTIALS' }, 401);
        return;
      }

      console.log('✅ Login successful:', row);
      req.session.user = row;
      app.json(res, { message: '✅ Success', user: row });
    }
  );
});

app.post('/api/register', (req, res) => {
  const username = req.body.username?.trim();
  const name = req.body.name?.trim();  
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!username || !name || !email || !password) {
    app.render(res, 'register', { error: '❌ All fields are required' });
    return;
  }

  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, existingUser) => {
    if (err) {
      console.error('❌ Database error during registration:', err);
      app.render(res, 'register', { error: '❌ Database error' });
      return;
    }

    if (existingUser) {
      app.render(res, 'register', { error: '❌ Username or email already exists' });
      return;
    }

    const token = crypto.createHmac('sha256', JWT_SECRET)
      .update(JSON.stringify({ username, name, email, password }))
      .digest('hex');

    const verificationUrl = `http://localhost:${PORT}/verify/${token}`;

    pendingUsers.set(email, { username, name, password, token });

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email ✉️',
      html: `<p>✅ Click the link to verify your account:</p><a href="${verificationUrl}">${verificationUrl}</a>`
    }).then(() => {
      console.log(`✅ Verification email sent to ${email}`);
      app.json(res, { message: '✅ Verification email sent. Check your inbox.' });
    }).catch(error => {
      console.error('❌ Error sending verification email:', error);
      app.render(res, 'register', { error: '❌ Failed to send verification email' });
    });
  });
});

app.get('/verify/:token', (req, res) => {
  const token = req.pathname.split('/')[2];
  
  for (const [email, userData] of pendingUsers.entries()) {
    if (userData.token === token) {
      const { username, name, password } = userData;
      
      const insertQuery = `INSERT INTO users (username, name, email, password, verified) VALUES (?, ?, ?, ?, 1)`;
      db.run(insertQuery, [username, name, email, password], function (err) {
        if (err) {
          console.error('❌ DB insert error:', err);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end('❌ Error creating user in database.');
          return;
        }

        pendingUsers.delete(email);
        console.log(`✅ ${username} verified and added to database with name: ${name}`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('✅ Email verified! You can now <a href="/login">login</a>.');
      });
      return;
    }
  }

  res.writeHead(400, { 'Content-Type': 'text/html' });
  res.end('❌ Invalid or expired verification link.');
});

app.get('/api/posts/user/:userId', (req, res) => {
  const userId = req.pathname.split('/')[4];
  db.all(
    'SELECT * FROM posts WHERE user_id = ? ORDER BY timestamp DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('DB error:', err);
        app.json(res, { error: 'Failed to fetch user posts' }, 500);
      } else {
        app.json(res, rows);
      }
    }
  );
});

app.post('/api/posts', (req, res) => {
  console.log('Incoming post request:', req.body);

  const { user_id, author, post, avatar } = req.body;

  if (!user_id || !author) {
    app.json(res, { error: 'Missing required fields' }, 400);
    return;
  }

  const insertQuery = `
    INSERT INTO posts (user_id, author, post, avatar)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertQuery, [user_id, author, post, avatar || null], function (err) {
    if (err) {
      console.error('❌ Error inserting post:', err);
      app.json(res, { error: 'Failed to save post' }, 500);
      return;
    }

    db.get('SELECT * FROM posts WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        app.json(res, { error: 'Failed to retrieve post' }, 500);
        return;
      }
      app.json(res, row);
    });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  const postId = req.pathname.split('/')[3];

  db.run('DELETE FROM posts WHERE id = ?', [postId], function (err) {
    if (err) {
      console.error('❌ Error deleting post:', err.message);
      app.json(res, { error: 'Failed to delete post' }, 500);
      return;
    }

    if (this.changes === 0) {
      app.json(res, { error: 'Post not found' }, 404);
      return;
    }

    app.json(res, { message: '✅ Post deleted' });
  });
});

// File upload handler (simplified - you'd need to handle multipart form data properly)
app.post('/api/users/:id/avatar', (req, res) => {
  // This is a simplified version - you'd need proper multipart form data parsing
  const userId = req.pathname.split('/')[3];
  app.json(res, { error: 'File upload requires proper multipart handling' }, 501);
});

app.post('/api/logout', (req, res) => {
  if (!req.session) {
    app.json(res, { error: 'No active session' }, 400);
    return;
  }
  
  const sessionId = req.cookies['sessionId'];
  if (sessionId) {
    sessions.delete(sessionId);
  }
  
  res.setHeader('Set-Cookie', 'sessionId=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  app.json(res, { message: 'Logout successful' });
});

// Start the server
app.start();