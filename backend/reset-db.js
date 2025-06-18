// reset_db.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Define the path to your database file
const DB_FILE = path.resolve(__dirname, 'users.db');

console.log(`Attempting to reset database: ${DB_FILE}`);

// 1. Delete the existing database file
if (fs.existsSync(DB_FILE)) {
  try {
    fs.unlinkSync(DB_FILE);
    console.log('✅ Existing database file deleted successfully.');
  } catch (err) {
    console.error('❌ Error deleting database file:', err);
    process.exit(1);
  }
} else {
  console.log('ℹ️ No existing database file found. Proceeding to initialize.');
}

// 2. Re-create the database and tables
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('❌ Error opening new database:', err.message);
    process.exit(1);
  }
  console.log('📂 Database file created/opened.');

  db.serialize(() => {
    // Create the users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        verified INTEGER DEFAULT 0
      );
    `, (err) => {
      if (err) {
        console.error('❌ Error creating "users" table:', err.message);
        process.exit(1);
      }
      console.log('✅ Table "users" created.');
    });

    // Create the projects table (optional)
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `, (err) => {
      if (err) {
        console.error('❌ Error creating "projects" table:', err.message);
        process.exit(1);
      }
      console.log('✅ Table "projects" created.');
    });

    // Insert sample admin user
    db.run(`
      INSERT OR IGNORE INTO users (username, email, password, verified)
      VALUES ('admin', 'admin@example.com', '123', 1);
    `, (err) => {
      if (err) {
        console.error('❌ Error inserting initial user:', err.message);
      } else {
        console.log('✅ Initial user inserted (if not exists).');
      }
    });

    // Close DB connection
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing DB:', err.message);
      } else {
        console.log('🎉 Database reset and initialization complete.');
      }
      process.exit(0);
    });
  });
});
