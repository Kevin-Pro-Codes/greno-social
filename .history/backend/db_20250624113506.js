const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.sqlite');
const db2 = new sqlite3.Database('./posts.sqlite');

// Create users and posts tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      verified INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create users table:', err);
    else console.log('✅ Users table ready.');
  });


db.run(
  `INSERT INTO users (username, email, password, verified) VALUES (?, ?, ?, 1)`,
  ['admin', 'admin@greeno.com', '123'],
  (err) => {
    if (err) {
      console.error('❌ Insert failed:', err);
    } else {
      console.log('✅ Test user inserted');
    }
  }
);



/*
 const usernameToDelete = '';

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
*/

  db2.run(`
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