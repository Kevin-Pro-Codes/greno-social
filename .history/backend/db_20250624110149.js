const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./posts.sqlite');

// Create users and posts tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      random TEXT NOT NULL,
      verified INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create users table:', err);
    else console.log('✅ Users table ready.');
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      post TEXT NOT NULL,
      avatar TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create posts table:', err);
    else console.log('✅ Posts table ready.');
  });

  db.all('SELECT * FROM users', [], (err, rows) => {
  console.log('✅ Users in DB:', rows);
});

});

module.exports = db;