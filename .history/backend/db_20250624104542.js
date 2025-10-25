const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'users.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database at', dbPath);
});

// Debugging handlers
//db.on('trace', (sql) => console.log('SQL TRACE:', sql));
//db.on('profile', (sql, ms) => console.log(`SQL (${ms}ms):`, sql));

// Create tables
db.serialize(() => {
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    verified INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    post TEXT NOT NULL,
    avatar TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`, (err) => {
    if (err) {
      console.error('❌ Failed to create users table:', err);
      process.exit(1);
    }
    console.log('✅ Database is ready');
  });
});

// Verify table exists on startup
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  if (err || !row) {
    console.error('❌ Users table verification failed!');
    process.exit(1);
  }
});

module.exports = db;