const express = require("express");
const router = express.Router();
const db = require("../db"); // your mysql connection

router.get("/users", (req, res) => {
  const a =db.query(
    "SELECT id, name FROM users WHERE role='user'",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
  console.log(a)
});
router.get("/messages/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    `SELECT m.*
     FROM messages m
     JOIN conversations c ON c.id = m.conversation_id
     WHERE c.user_id = ?
     ORDER BY m.created_at`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

module.exports = router;
