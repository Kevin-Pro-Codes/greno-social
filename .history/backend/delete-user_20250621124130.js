import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Required to construct __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to your SQLite DB (adjust path as needed)
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Delete by ID or email
const userId = 2;
const deleteQuery = `DELETE FROM users WHERE id = 2`;

db.run(deleteQuery, [userId], function (err) {
  if (err) {
    return console.error('❌ Error deleting user:', err);
  }
  if (this.changes === 0) {
    console.log('⚠️ No user found with that ID.');
  } else {
    console.log('✅ User deleted successfully.');
  }
  db.close();
});