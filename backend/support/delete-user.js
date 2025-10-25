import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'users.db');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Database file does not exist at:', dbPath);
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

const userId = 2;
const deleteQuery = `DELETE FROM users WHERE id = ?`;

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