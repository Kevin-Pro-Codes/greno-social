const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer');
const db = require('./db');
const dotenv = require('dotenv').config();
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const PORT = process.env.PORT || 3000;

let posts = [];
const pendingUsers = new Map();
const sessions = new Map();

// Session management
function createSession(user) {
  const sessionId = require('crypto').randomBytes(16).toString('hex');
  const session = {
    id: sessionId,
    user: user,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 1 day
  };
  sessions.set(sessionId, session);
  return sessionId;
}

function getSession(sessionId) {
  if (!sessionId) return null;
  const session = sessions.get(sessionId);
  if (!session || Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

// Helper function to parse cookies
function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  return cookies;
}

// Helper function to send JSON responses
function sendJSONResponse(res, statusCode, data, req = null) {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
  let origin = 'http://localhost:3000'; // default
  
  if (req && req.headers && req.headers.origin) {
    origin = req.headers.origin;
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  };
  
  // Set dynamic origin if it's in allowed list
  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
  }
  
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
}

// Helper function to serve static files
function serveStaticFile(res, filePath, contentType, req = null) {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
  let origin = 'http://localhost:3000';
  
  if (req && req.headers && req.headers.origin) {
    origin = req.headers.origin;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    const headers = {
      'Content-Type': contentType
    };
    
    if (allowedOrigins.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
    
    res.writeHead(200, headers);
    res.end(data);
  });
}

// Helper to parse request body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (req.headers['content-type'] === 'application/json') {
          resolve(JSON.parse(body));
        } else if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
          resolve(querystring.parse(body));
        } else {
          resolve(body);
        }
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
    const origin = req.headers.origin;
    
    const headers = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400' // 24 hours
    };
    
    if (allowedOrigins.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
    } else {
      headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    }
    
    res.writeHead(200, headers);
    res.end();
    return;
  }

  // Parse cookies
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies['connect.sid'];
  const session = getSession(sessionId);

  try {
    // API Routes
    if (pathname.startsWith('/api')) {
      await handleAPIRoutes(req, res, pathname, method, session, parsedUrl);
      return;
    }

    // Serve static files
    if (pathname.startsWith('/uploads')) {
      const filePath = path.join(__dirname, pathname);
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
      };
      serveStaticFile(res, filePath, contentTypes[ext] || 'application/octet-stream', req);
      return;
    }

    // Serve frontend (SPA)
    const frontendPath = path.join(__dirname, '../frontend/dist', 
      pathname === '/' ? 'index.html' : pathname);
    const ext = path.extname(frontendPath).toLowerCase();
    
    const contentTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };

    if (fs.existsSync(frontendPath)) {
      serveStaticFile(res, frontendPath, contentTypes[ext] || 'text/plain', req);
    } else {
      // For SPA routing, serve index.html for all non-api routes
      const indexHtml = path.join(__dirname, '../frontend/dist/index.html');
      serveStaticFile(res, indexHtml, 'text/html', req);
    }

  } catch (error) {
    console.error('❌ Server error:', error);
    sendJSONResponse(res, 500, { error: 'Internal server error', message: error.message }, req);
  }
});

async function handleAPIRoutes(req, res, pathname, method, session, parsedUrl) {
  const body = await parseRequestBody(req);

  switch (pathname) {
    case '/api/check-session':
      if (method === 'GET') {
        sendJSONResponse(res, 200, { loggedIn: !!session }, req);
      }
      break;

    case '/api/login':
      if (method === 'POST') {
        handleLogin(req, res, body);
      }
      break;

    case '/api/register':
      if (method === 'POST') {
        handleRegister(req, res, body);
      }
      break;

    case '/api/logout':
      if (method === 'POST') {
        handleLogout(req, res, session, req);
      }
      break;

 case '/api/posts':
  if (method === 'GET') {
    handleGetAllPosts(req, res, session); // PASS THE SESSION HERE
  } else if (method === 'POST') {
    handleCreatePost(req, res, body, session);
  }
  break;

    default:
      // Handle dynamic routes like /api/posts/user/:userId
      if (pathname.startsWith('/api/posts/user/') && method === 'GET') {
        const userId = pathname.split('/').pop();
        handleGetUserPosts(req, res, userId);
      } 
      // Handle post deletion
      else if (pathname.startsWith('/api/posts/') && method === 'DELETE') {
        const postId = pathname.split('/').pop();
        handleDeletePost(req, res, postId, session);
      }
      // Handle avatar upload
      else if (pathname.startsWith('/api/users/') && pathname.endsWith('/avatar') && method === 'POST') {
        const userId = pathname.split('/')[3];
        handleAvatarUpload(req, res, userId, session);
      }
      else {
        sendJSONResponse(res, 404, { error: 'API endpoint not found' }, req);
      }
  }
}

// REPLACE the handleGetAllPosts function in root.js with this:
function handleGetAllPosts(req, res, session) {
  console.log('📨 GET /api/posts request received');
  
  if (!session) {
    return sendJSONResponse(res, 401, { error: 'Unauthorized - Please log in' }, req);
  }

  const userId = session.user.id;
  console.log('👤 Fetching posts for user ID:', userId);
  
  // Only get posts from the logged-in user
  const query = `
    SELECT p.*, u.name as author_name 
    FROM posts p 
    LEFT JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ?
    ORDER BY p.timestamp DESC
  `;
  
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching user posts:', err);
      return sendJSONResponse(res, 500, { error: 'Failed to fetch posts' }, req);
    }
    
    console.log(`✅ Sending ${rows.length} posts for user ${userId}`);
    sendJSONResponse(res, 200, rows, req);
  });
}

function handleLogin(req, res, body) {
  const { username, password } = body;

  if (!username || !password) {
    return sendJSONResponse(res, 400, { error: 'Missing credentials' }, req);
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('❌ DB error during login:', err);
        return sendJSONResponse(res, 500, { error: 'Internal error' }, req);
      }

      if (!row) {
        return sendJSONResponse(res, 401, { error: 'Invalid credentials' }, req);
      }

      const sessionId = createSession(row);
      res.setHeader('Set-Cookie', `connect.sid=${sessionId}; HttpOnly; Max-Age=86400; Path=/; SameSite=Lax`);
      sendJSONResponse(res, 200, { message: 'Success', user: row }, req);
    }
  );
}

function handleRegister(req, res, body) {
  const username = body.username?.trim();
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!username || !name || !email || !password) {
    return sendJSONResponse(res, 400, { error: 'All fields are required' }, req);
  }

  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, existingUser) => {
    if (err) {
      console.error('❌ Database error during registration:', err);
      return sendJSONResponse(res, 500, { error: 'Database error' }, req);
    }

    if (existingUser) {
      return sendJSONResponse(res, 400, { error: 'Username or email already exists' }, req);
    }

    // For demo, skip email verification and create user directly
    const insertQuery = `INSERT INTO users (username, name, email, password, verified) VALUES (?, ?, ?, ?, 1)`;
    db.run(insertQuery, [username, name, email, password], function (err) {
      if (err) {
        console.error('❌ DB insert error:', err);
        return sendJSONResponse(res, 500, { error: 'Error creating user in database' }, req);
      }

      // Get the newly created user
      db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
        if (err) {
          console.error('❌ Error fetching new user:', err);
          return sendJSONResponse(res, 500, { error: 'User created but failed to login' }, req);
        }

        const sessionId = createSession(newUser);
        res.setHeader('Set-Cookie', `connect.sid=${sessionId}; HttpOnly; Max-Age=86400; Path=/; SameSite=Lax`);
        sendJSONResponse(res, 200, { message: 'Registration successful', user: newUser }, req);
      });
    });
  });
}

function handleLogout(req, res, session, req) {
  if (session) {
    sessions.delete(session.id);
  }
  res.setHeader('Set-Cookie', 'connect.sid=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/');
  sendJSONResponse(res, 200, { message: 'Logout successful' }, req);
}

function handleCreatePost(req, res, body, session) {
  if (!session) {
    return sendJSONResponse(res, 401, { error: 'Unauthorized' }, req);
  }

  const { post } = body;
  const user_id = session.user.id;
  const author = session.user.name || session.user.username;

  if (!user_id || !author || !post) {
    return sendJSONResponse(res, 400, { error: 'Missing required fields' }, req);
  }

  const insertQuery = `
    INSERT INTO posts (user_id, author, post, avatar)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertQuery, [user_id, author, post, session.user.avatar || null], function (err) {
    if (err) {
      console.error('❌ Error inserting post:', err);
      return sendJSONResponse(res, 500, { error: 'Failed to save post' }, req);
    }

    // Return the newly created post
    db.get(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `, [this.lastID], (err, row) => {
      if (err) {
        console.error('❌ Error fetching new post:', err);
        return sendJSONResponse(res, 500, { error: 'Failed to retrieve post' }, req);
      }
      
      console.log('✅ New post created:', row);
      sendJSONResponse(res, 200, row, req);
    });
  });
}

function handleGetUserPosts(req, res, userId) {
  console.log(`📨 GET /api/posts/user/${userId} request received`);
  console.log('🌐 Origin:', req.headers.origin);
  
  if (!userId || isNaN(userId)) {
    return sendJSONResponse(res, 400, { error: 'Invalid user ID' }, req);
  }

  const query = `
    SELECT p.*, u.name as author_name 
    FROM posts p 
    LEFT JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ? 
    ORDER BY p.timestamp DESC
  `;
  
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('❌ DB error fetching user posts:', err);
      return sendJSONResponse(res, 500, { error: 'Failed to fetch user posts' }, req);
    }
    
    console.log(`✅ Sending ${rows.length} posts for user ${userId}`);
    sendJSONResponse(res, 200, rows, req);
  });
}

function handleDeletePost(req, res, postId, session) {
  if (!session) {
    return sendJSONResponse(res, 401, { error: 'Unauthorized' }, req);
  }

  db.run('DELETE FROM posts WHERE id = ?', [postId], function (err) {
    if (err) {
      console.error('❌ Error deleting post:', err.message);
      return sendJSONResponse(res, 500, { error: 'Failed to delete post' }, req);
    }

    if (this.changes === 0) {
      return sendJSONResponse(res, 404, { error: 'Post not found' }, req);
    }

    sendJSONResponse(res, 200, { message: 'Post deleted' }, req);
  });
}

function handleAvatarUpload(req, res, userId, session) {
  if (!session || session.user.id !== parseInt(userId)) {
    return sendJSONResponse(res, 401, { error: 'Unauthorized' }, req);
  }

  // For now, return a mock response
  const mockFilePath = `uploads/avatar-${userId}-${Date.now()}.jpg`;
  
  // Update user's avatar in database
  db.run('UPDATE users SET avatar = ? WHERE id = ?', [mockFilePath, userId], function(err) {
    if (err) {
      console.error('Error updating avatar:', err);
      return sendJSONResponse(res, 500, { error: 'Failed to update avatar' }, req);
    }
    
    sendJSONResponse(res, 200, { 
      message: 'Avatar updated', 
      filePath: mockFilePath 
    }, req);
  });
}

// Handle verification route
server.on('request', (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname.startsWith('/verify/') && req.method === 'GET') {
    const token = parsedUrl.pathname.split('/')[2];
    handleVerification(req, res, token);
  }
});

function handleVerification(req, res, token) {
  try {
    const { username, name, email, password } = jwt.verify(token, process.env.JWT_SECRET);

    if (!pendingUsers.has(email)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('❌ Invalid or expired verification link.');
      return;
    }

    const insertQuery = `INSERT INTO users (username, name, email, password, verified) VALUES (?, ?, ?, ?, 1)`;
    db.run(insertQuery, [username, name, email, password], function (err) {
      if (err) {
        console.error('❌ DB insert error:', err);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('❌ Error creating user in database.');
        return;
      }

      pendingUsers.delete(email);
      console.log(`✅ ${username} verified and added to database with name: ${name}`);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('✅ Email verified! You can now <a href="/login">login</a>.');
    });
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('❌ Invalid or expired token.');
  }
}

server.listen(PORT, () => {
  console.log(`✅ Pure Node.js server running at http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: http://localhost:3000, http://localhost:5173, http://localhost:5174`);
  console.log(`✅ Posts API: GET /api/posts, POST /api/posts, GET /api/posts/user/:id`);
});





{/*  
  
  const http = require('http');
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

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

let posts = [];
const pendingUsers = new Map();
const sessions = new Map();

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    avatar TEXT,
    verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    author TEXT,
    post TEXT,
    avatar TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  console.log('✅ Database tables initialized');
});

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
    console.log(`📨 ${req.method} ${req.url}`);
    
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
    if (req.method === 'POST' || req.method === 'PUT') {
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
        // Extract route parameters and add to req
        req.params = this.extractRouteParams(route.path, req.pathname);
        await route.handler(req, res);
      } catch (error) {
        this.handleError(error, req, res);
      }
    } else {
      // Serve SPA for non-API routes
      if (!req.pathname.startsWith('/api')) {
        await this.serveSPA(req, res);
      } else {
        this.json(res, { error: 'Not found' }, 404);
      }
    }
  }

  extractRouteParams(routePath, requestPath) {
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');
    const params = {};
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = requestParts[i];
      }
    }
    
    return params;
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
      
      res.setHeader('Set-Cookie', `sessionId=${newSessionId}; HttpOnly; Max-Age=86400; Path=/`);
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
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon'
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
      this.json(res, { 
        error: '❌ Internal server error',
        message: error.message 
      }, 500);
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('❌ Internal server error');
    }
  }

  json(res, data, statusCode = 200) {
    res.writeHead(statusCode, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true'
    });
    res.end(JSON.stringify(data));
  }

  redirect(res, location) {
    res.writeHead(302, { Location: location });
    res.end();
  }

  render(res, view, data = {}) {
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
    app.json(res, { loggedIn: true, user: req.session.user });
  } else {
    app.json(res, { loggedIn: false });
  }
});

app.post('/api/login', (req, res) => {
  console.log('🔐 Incoming login request:', req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    return app.json(res, { error: '❌ Missing credentials' }, 400);
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('❌ DB error during login:', err);
        return app.json(res, { error: '❌ Internal error' }, 500);
      }

      if (!row) {
        console.log('❌ Login failed: Invalid credentials');
        return app.json(res, { error: '❌ INVALID CREDENTIALS' }, 401);
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
    return app.json(res, { error: '❌ All fields are required' }, 400);
  }

  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, existingUser) => {
    if (err) {
      console.error('❌ Database error during registration:', err);
      return app.json(res, { error: '❌ Database error' }, 500);
    }

    if (existingUser) {
      return app.json(res, { error: '❌ Username or email already exists' }, 400);
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
      app.json(res, { error: '❌ Failed to send verification email' }, 500);
    });
  });
});

app.get('/verify/:token', (req, res) => {
  const token = req.params.token;
  console.log('🔑 Verification token received:', token);
  
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

// Get all posts
app.get('/api/posts', (req, res) => {
  console.log('📝 Fetching all posts');
  
  db.all(
    'SELECT * FROM posts ORDER BY timestamp DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error('❌ DB error fetching posts:', err);
        return app.json(res, { error: 'Failed to fetch posts' }, 500);
      }
      
      console.log(`✅ Found ${rows.length} posts`);
      app.json(res, rows);
    }
  );
});

// Get posts by user ID
app.get('/api/posts/user/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('🔍 Fetching posts for user ID:', userId);
  
  if (!userId) {
    return app.json(res, { error: 'User ID is required' }, 400);
  }

  db.all(
    'SELECT * FROM posts WHERE user_id = ? ORDER BY timestamp DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('❌ Database error:', err);
        return app.json(res, { error: 'Failed to fetch user posts' }, 500);
      }
      
      console.log(`✅ Found ${rows.length} posts for user ${userId}`);
      app.json(res, rows);
    }
  );
});

app.post('/api/posts', (req, res) => {
  console.log('📮 Incoming post request:', req.body);

  const { user_id, author, post, avatar } = req.body;

  if (!user_id || !author) {
    return app.json(res, { error: 'Missing required fields' }, 400);
  }

  const insertQuery = `
    INSERT INTO posts (user_id, author, post, avatar)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertQuery, [user_id, author, post, avatar || null], function (err) {
    if (err) {
      console.error('❌ Error inserting post:', err);
      return app.json(res, { error: 'Failed to save post' }, 500);
    }

    console.log('✅ Post saved with ID:', this.lastID);
    
    db.get('SELECT * FROM posts WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('❌ Error retrieving post:', err);
        return app.json(res, { error: 'Failed to retrieve post' }, 500);
      }
      app.json(res, row);
    });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  console.log('🗑️ Deleting post:', postId);

  db.run('DELETE FROM posts WHERE id = ?', [postId], function (err) {
    if (err) {
      console.error('❌ Error deleting post:', err.message);
      return app.json(res, { error: 'Failed to delete post' }, 500);
    }

    if (this.changes === 0) {
      return app.json(res, { error: 'Post not found' }, 404);
    }

    console.log('✅ Post deleted successfully');
    app.json(res, { message: '✅ Post deleted' });
  });
});

// Simple file upload handler (basic version)
app.post('/api/users/:id/avatar', (req, res) => {
  const userId = req.params.id;
  console.log('🖼️ Avatar upload request for user:', userId);
  
  // For now, return a placeholder since multipart handling is complex
  const filePath = `uploads/avatar_${userId}_${Date.now()}.jpg`;
  app.json(res, { 
    message: 'Avatar upload endpoint - implement multipart handling',
    filePath 
  });
});

app.post('/api/logout', (req, res) => {
  console.log('🚪 Logout request');
  
  if (!req.session) {
    return app.json(res, { error: 'No active session' }, 400);
  }
  
  const sessionId = req.cookies['sessionId'];
  if (sessionId) {
    sessions.delete(sessionId);
  }
  
  res.setHeader('Set-Cookie', 'sessionId=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/');
  app.json(res, { message: 'Logout successful' });
});

// Start the server
app.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

*/}