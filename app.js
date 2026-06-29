const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const session = require("express-session");
const SQLiteStore = require("better-sqlite3-session-store")(session);

const usersRouter = require("./routes/users");
const sessionRouter = require("./routes/session");
const projectsRouter = require("./routes/projects");

process.loadEnvFile();

const app = express();
const db = new Database("app.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    isAdmin INTEGER NOT NULL DEFAULT 0
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    ownerId INTEGER NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE)
`).run();

app.locals.db = db;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new SQLiteStore({ client: db }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/users", usersRouter);
app.use("/session", sessionRouter);
app.use("/projects", projectsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server works on http://localhost:${PORT}`);
});