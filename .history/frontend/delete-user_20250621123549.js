const db = require('./db'); // adjust if your DB file is elsewhere

const userId = 2;
const deleteQuery = `DELETE FROM users WHERE id = ?`;

db.run(deleteQuery, [userId], function (err) {
  if (err) {
    return console.error('Error deleting user:', err);
  }
  if (this.changes === 0) {
    console.log('No user found with that ID.');
  } else {
    console.log('User deleted successfully.');
  }
});