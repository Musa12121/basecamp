const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

function getDB(req) {
  return req.app.locals.db;
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthanticated" });
  }
  next();
}

function requireAdmin(req, res, next) {
  const db = getDB(req);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ success: false, message: "Admin access is required" });
  }
  next();
}

router.post("/", async (req, res) => {
  try {
    const db = getDB(req);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields should be filled" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(400).json({ success: false, message: "Email is already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = db
      .prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
      .run(username, email, hashed);

    if (result.changes === 0) {
      return res.status(500).json({ success: false, message: "Could not create user" });
    }

        req.session.userId = result.lastInsertRowid;
    return res.status(201).json({ success: true, message: "Account created successfully", userId: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/:id", requireAuth, (req, res) => {
  const db = getDB(req);
  const user = db
    .prepare("SELECT id, username, email, isAdmin FROM users WHERE id = ?")
    .get(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.json({ success: true, user });
});

router.delete("/:id", requireAuth, (req, res) => {
  const db = getDB(req);
  const targetId = parseInt(req.params.id, 10);
  const requesterId = req.session.userId;

  const requester = db.prepare("SELECT * FROM users WHERE id = ?").get(requesterId);

    if (!requester.isAdmin && requesterId !== targetId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const result = db.prepare("DELETE FROM users WHERE id = ?").run(targetId);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

    if (requesterId === targetId) req.session.destroy(() => {});

  return res.json({ success: true, message: "User deleted" });
});

router.post("/:id/set-admin", requireAuth, requireAdmin, (req, res) => {
  const db = getDB(req);
  const result = db.prepare("UPDATE users SET isAdmin = 1 WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ success: false, message: "User not found" });
  return res.json({ success: true, message: "Admin granted" });
});

router.delete("/:id/set-admin", requireAuth, requireAdmin, (req, res) => {
  const db = getDB(req);
  const result = db.prepare("UPDATE users SET isAdmin = 0 WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ success: false, message: "User not found" });
  return res.json({ success: true, message: "Admin removed" });
});

module.exports = router;