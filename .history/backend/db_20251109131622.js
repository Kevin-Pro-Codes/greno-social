// CREATE SINGLE USER

/*
db.run(
  `INSERT INTO users (username, name, email, password, verified) VALUES (?, ?, ?, ?, 1)`,
  ['admin', 'Manager', 'admin@greeno.com', '123'],
  (err) => {
    if (err) {
      console.error('❌ Insert failed:', err);
    } else {
      console.log('✅ User inserted');
    }
  }
);
});

*/

// DELETE SINGLE USER

/*
 const usernameToDelete = '4';

  db.run(
    `DELETE FROM users WHERE id = ?`,
    [usernameToDelete],
    function (err) {
      if (err) {
        console.error(`❌ Failed to delete user "${usernameToDelete}":`, err);
      } else if (this.changes === 0) {
        console.log(`⚠️ User "${usernameToDelete}" not found.`);
      } else {
        console.log(`✅ User "${usernameToDelete}" deleted.`);
      }
    }
  );



db.get(`PRAGMA table_info(users)`, (err, row) => {
  if (err) {
    console.error('❌ Failed to fetch users table info:', err);
    return;
  }

  db.all(`PRAGMA table_info(users)`, [], (err, columns) => {
    if (err) {
      console.error('❌ Failed to check users table columns:', err);
    } else {
      const hasAvatar = columns.some(col => col.name === 'avatar');
      if (!hasAvatar) {
        db.run(`ALTER TABLE users ADD COLUMN avatar TEXT`, (err) => {
          if (err) console.error('❌ Failed to add avatar column:', err);
          else console.log('✅ Avatar column added to users table.');
        });
      } else {
        console.log('ℹ️ Avatar column already exists.');
      }
    }
  });
});


*/

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Your existing db.js
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 3000;

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
function sendJSONResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true'
  });
  res.end(JSON.stringify(data));
}

// Helper function to serve static files
function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
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

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
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
      serveStaticFile(res, filePath, contentTypes[ext] || 'application/octet-stream');
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
      serveStaticFile(res, frontendPath, contentTypes[ext] || 'text/plain');
    } else {
      // For SPA routing, serve index.html for all non-api routes
      const indexHtml = path.join(__dirname, '../frontend/dist/index.html');
      serveStaticFile(res, indexHtml, 'text/html');
    }

  } catch (error) {
    console.error('❌ Server error:', error);
    sendJSONResponse(res, 500, { error: 'Internal server error', message: error.message });
  }
});

async function handleAPIRoutes(req, res, pathname, method, session, parsedUrl) {
  const body = await parseRequestBody(req);

  switch (pathname) {
    case '/api/check-session':
      if (method === 'GET') {
        sendJSONResponse(res, 200, { loggedIn: !!session });
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
        handleLogout(req, res, session);
      }
      break;

    case '/api/posts':
      if (method === 'GET') {
        handleGetAllPosts(req, res);
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
        sendJSONResponse(res, 404, { error: 'API endpoint not found' });
      }
  }
}

function handleLogin(req, res, body) {
  const { username, password } = body;

  if (!username || !password) {
    return sendJSONResponse(res, 400, { error: 'Missing credentials' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ? AND verified = 1',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('❌ DB error during login:', err);
        return sendJSONResponse(res, 500, { error: 'Internal error' });
      }

      if (!row) {
        return sendJSONResponse(res, 401, { error: 'Invalid credentials or email not verified' });
      }

      const sessionId = createSession(row);
      res.setHeader('Set-Cookie', `connect.sid=${sessionId}; HttpOnly; Max-Age=86400; Path=/; SameSite=Lax`);
      sendJSONResponse(res, 200, { message: 'Success', user: row });
    }
  );
}

function handleRegister(req, res, body) {
  const username = body.username?.trim();
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!username || !name || !email || !password) {
    return sendJSONResponse(res, 400, { error: 'All fields are required' });
  }

  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(checkQuery, [username, email], (err, existingUser) => {
    if (err) {
      console.error('❌ Database error during registration:', err);
      return sendJSONResponse(res, 500, { error: 'Database error' });
    }

    if (existingUser) {
      return sendJSONResponse(res, 400, { error: 'Username or email already exists' });
    }

    // For demo purposes, create user directly without email verification
    const insertQuery = `INSERT INTO users (username, name, email, password, verified) VALUES (?, ?, ?, ?, 1)`;
    db.run(insertQuery, [username, name, email, password], function (err) {
      if (err) {
        console.error('❌ DB insert error:', err);
        return sendJSONResponse(res, 500, { error: 'Error creating user in database' });
      }

      // Get the newly created user
      db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
        if (err) {
          console.error('❌ Error fetching new user:', err);
          return sendJSONResponse(res, 500, { error: 'User created but failed to login' });
        }

        const sessionId = createSession(newUser);
        res.setHeader('Set-Cookie', `connect.sid=${sessionId}; HttpOnly; Max-Age=86400; Path=/; SameSite=Lax`);
        sendJSONResponse(res, 200, { message: 'Registration successful', user: newUser });
      });
    });
  });
}

function handleLogout(req, res, session) {
  if (session) {
    sessions.delete(session.id);
  }
  res.setHeader('Set-Cookie', 'connect.sid=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/');
  sendJSONResponse(res, 200, { message: 'Logout successful' });
}

function handleGetAllPosts(req, res) {
  const query = `
    SELECT p.*, u.name as author_name 
    FROM posts p 
    LEFT JOIN users u ON p.user_id = u.id 
    ORDER BY p.timestamp DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching posts:', err);
      return sendJSONResponse(res, 500, { error: 'Failed to fetch posts' });
    }
    
    console.log('✅ Posts fetched:', rows.length);
    sendJSONResponse(res, 200, rows);
  });
}

function handleCreatePost(req, res, body, session) {
  if (!session) {
    return sendJSONResponse(res, 401, { error: 'Unauthorized' });
  }

  const { post } = body;
  const user_id = session.user.id;
  const author = session.user.name || session.user.username;

  if (!user_id || !author || !post) {
    return sendJSONResponse(res, 400, { error: 'Missing required fields' });
  }

  const insertQuery = `
    INSERT INTO posts (user_id, author, post, avatar)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertQuery, [user_id, author, post, session.user.avatar || null], function (err) {
    if (err) {
      console.error('❌ Error inserting post:', err);
      return sendJSONResponse(res, 500, { error: 'Failed to save post' });
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
        return sendJSONResponse(res, 500, { error: 'Failed to retrieve post' });
      }
      
      console.log('✅ New post created:', row);
      sendJSONResponse(res, 200, row);
    });
  });
}

function handleGetUserPosts(req, res, userId) {
  if (!userId || isNaN(userId)) {
    return sendJSONResponse(res, 400, { error: 'Invalid user ID' });
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
      return sendJSONResponse(res, 500, { error: 'Failed to fetch user posts' });
    }
    
    console.log(`✅ User ${userId} posts fetched:`, rows.length);
    sendJSONResponse(res, 200, rows);
  });
}

function handleDeletePost(req, res, postId, session) {
  if (!session) {
    return sendJSONResponse(res, 401, { error: 'Unauthorized' });
  }

  if (!postId || isNaN(postId)) {
    return sendJSONResponse(res, 400, { error: 'Invalid post ID' });
  }

  // First check if the post belongs to the current user
  db.get('SELECT * FROM posts WHERE id = ? AND user_id = ?', [postId, session.user.id], (err, post) => {
    if (err) {
      console.error('❌ Error checking post ownership:', err.message);
      return sendJSONResponse(res, 500, { error: 'Failed to delete post' });
    }

    if (!post) {
      return sendJSONResponse(res, 403, { error: 'Not authorized to delete this post' });
    }

    db.run('DELETE FROM posts WHERE id = ?', [postId], function (err) {
      if (err) {
        console.error('❌ Error deleting post:', err.message);
        return sendJSONResponse(res, 500, { error: 'Failed to delete post' });
      }

      console.log('✅ Post deleted:', postId);
      sendJSONResponse(res, 200, { message: 'Post deleted successfully' });
    });
  });
}

function handleAvatarUpload(req, res, userId, session) {
  if (!session || session.user.id !== parseInt(userId)) {
    return sendJSONResponse(res, 401, { error: 'Unauthorized' });
  }

  if (!userId || isNaN(userId)) {
    return sendJSONResponse(res, 400, { error: 'Invalid user ID' });
  }

  // For now, return a mock response since file upload requires multipart parsing
  const mockFilePath = `uploads/avatar-${userId}-${Date.now()}.jpg`;
  
  // Update user's avatar in database
  db.run('UPDATE users SET avatar = ? WHERE id = ?', [mockFilePath, userId], function(err) {
    if (err) {
      console.error('❌ Error updating avatar:', err);
      return sendJSONResponse(res, 500, { error: 'Failed to update avatar' });
    }
    
    // Update all user's posts with new avatar
    db.run('UPDATE posts SET avatar = ? WHERE user_id = ?', [mockFilePath, userId], function(err) {
      if (err) {
        console.error('❌ Error updating post avatars:', err);
        // Don't fail the request if this fails
      }
      
      console.log('✅ Avatar updated for user:', userId);
      sendJSONResponse(res, 200, { 
        message: 'Avatar updated successfully', 
        filePath: mockFilePath 
      });
    });
  });
}

// Handle verification route (kept for reference)
server.on('request', (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname.startsWith('/verify/') && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Email verification is disabled in this demo version.');
  }
});

server.listen(PORT, () => {
  console.log(`✅ Pure Node.js server running at http://localhost:${PORT}`);
  console.log(`✅ Using your existing database from db.js`);
});