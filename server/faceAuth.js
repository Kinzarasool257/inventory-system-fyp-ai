const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const db = require("./db")

const app = express();
app.use(cors());
app.use(bodyParser.json());
// try {
//     const hashedPassword = await bcrypt.hash(Password, 10);
//     const SQL = 'INSERT INTO users (email, name, password , role) VALUES (?, ?, ?,?)';
//     await db.query(SQL, [Email, Name, hashedPassword, role]);
//     res.send({ message: 'User added!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: 'Signup failed' });
//   }


// ✅ Helper function for Euclidean distance
function euclidean(a, b) {
  if (!a || !b || a.length !== b.length) return 9999;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

// ✅ 1. ENROLL FACE — one-time for each admin
app.post("/api/enroll", async (req, res) => {
  try {
    const { user_id, face_encoding } = req.body;
    if (!user_id || !face_encoding)
      return res.status(400).send({ error: "Missing fields" });

    // const conn = await pool.getConnection();
    
    const SQL= 'UPDATE users SET face_encoding = ? WHERE user_id = ?';
    await db.query(SQL, [JSON.stringify(face_encoding), user_id]);
  
    // conn.release();

    console.log(`✅ Face enrolled for user_id=${user_id}`);
    res.send({ status: "ok", message: "Face enrolled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});

// ✅ 2. LOGIN WITH FACE — for any admin
app.post("/api/face-login", async (req, res) => {
  try {
    const { face_encoding } = req.body;
    if (!face_encoding)
      return res.status(400).send({ matched: false, reason: "No encoding" });

    const conn = await pool.getConnection();
    const [users] = await conn.query(
      "SELECT user_id, username, role, face_encoding FROM users WHERE face_encoding IS NOT NULL"
    );
    conn.release();

    let bestUser = null;
    let bestDistance = 999;

    // Compare with every stored admin/staff face
    for (const user of users) {
      const stored = JSON.parse(user.face_encoding);
      const dist = euclidean(stored, face_encoding);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestUser = user;
      }
    }

    const THRESHOLD = 0.55; // Tune if needed
    if (bestUser && bestDistance < THRESHOLD) {
      console.log(`✅ Face match: ${bestUser.username} (dist=${bestDistance.toFixed(3)})`);
      res.send({
        matched: true,
        user_id: bestUser.user_id,
        username: bestUser.username,
        role: bestUser.role,
        distance: bestDistance
      });
    } else {
      console.log("❌ No match found");
      res.send({ matched: false, reason: "No match", bestDistance });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ matched: false, reason: "Server error" });
  }
});

// ✅ 3. Start server
app.listen(4000, () => console.log("🚀 Face Login API running on port 4000"));
