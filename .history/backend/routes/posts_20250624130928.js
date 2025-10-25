const express = require('express');
const router = express.Router();
const db = require('../db'); // <- shared db.js file

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  const postId = req.params.id;

  db.run('DELETE FROM posts WHERE id = ?', [postId], function (err) {
    if (err) {
      console.error('❌ Error deleting post:', err.message);
      return res.status(500).json({ error: 'Failed to delete post' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: '✅ Post deleted' });
  });
});

module.exports = router;
