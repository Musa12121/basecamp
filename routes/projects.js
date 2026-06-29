const express = require("express");
const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  next();
}

router.use(requireAuth);

router.post("/", (req, res) => {
  const db = req.app.locals.db;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Project name is required" });
  }

  const result = db
    .prepare("INSERT INTO projects (name, description, ownerId) VALUES (?, ?, ?)")
    .run(name, description || "", req.session.userId);

  if (result.changes === 0) {
    return res.status(500).json({ success: false, message: "Could not create project" });
  }

  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid);
  return res.status(201).json({ success: true, project });
});

router.get("/", (req, res) => {
  const db = req.app.locals.db;
  const projects = db
    .prepare("SELECT * FROM projects WHERE ownerId = ? ORDER BY createdAt DESC")
    .all(req.session.userId);
  return res.json({ success: true, projects });
});

router.get("/:id", (req, res) => {
  const db = req.app.locals.db;
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

    const user = db.prepare("SELECT isAdmin FROM users WHERE id = ?").get(req.session.userId);
  if (!user.isAdmin && project.ownerId !== req.session.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  return res.json({ success: true, project });
});

router.patch("/:id", (req, res) => {
  const db = req.app.locals.db;
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const user = db.prepare("SELECT isAdmin FROM users WHERE id = ?").get(req.session.userId);
  if (!user.isAdmin && project.ownerId !== req.session.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const { name, description } = req.body;
  const newName = name ?? project.name;
  const newDescription = description ?? project.description;

  db.prepare("UPDATE projects SET name = ?, description = ? WHERE id = ?").run(
    newName,
    newDescription,
    req.params.id
  );

  const updated = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  return res.json({ success: true, project: updated });
});

router.delete("/:id", (req, res) => {
  const db = req.app.locals.db;
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const user = db.prepare("SELECT isAdmin FROM users WHERE id = ?").get(req.session.userId);
  if (!user.isAdmin && project.ownerId !== req.session.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  return res.json({ success: true, message: "Project deleted" });
});

module.exports = router;