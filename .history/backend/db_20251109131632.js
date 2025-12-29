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

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'database', 'database.sqlite'), (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err);
  } else {
    console.log('✅ Connected to database.sqlite');
  }
});

db.serialize(() => {

  db.run(`
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  name TEXT ,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  verified INTEGER DEFAULT 0
)
  `, (err) => {
    if (err) console.error('❌ Failed to create users table:', err);
    else console.log('✅ Users table ready.');
  });

  // Posts table
  db.run(`
  CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  author TEXT NOT NULL,
  post TEXT,
  avatar TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)
  `, (err) => {
    if (err) console.error('❌ Failed to create posts table:', err);
    else console.log('✅ Posts table ready.');
  });

  // Debug: list all users
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) console.error('❌ Failed to fetch users:', err);
    else console.log('📋 Users in DB:', rows);
  });
  
});

module.exports = db;
