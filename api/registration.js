const express = require("express")
const Database = require("better-sqlite3")
const bcrypt = require("bcrypt")

const router = express.Router()
const db = new Database("users.db", { verbose: console.log })

db.prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, isAdmin BOOLEAN DEFAULT 0);").run();

router.post("/new", (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!password) res.status(400).send({success: false, message: "Password cannot be empty!"})
        if (password.length < 6) res.status(400).send({success: false, message: "Password cannot be less than 6 characters!"});
        const check = db.prepare("SELECT * FROM users WHERE email = ?;").run(email);
        if (check) res.status(400).send({success: false, message: "This email is already taken"})
        const result = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?);").run(username, email, bcrypt.hash(password));
        if (result.changes == 0) res.status(400).send({ success: false, message: "Error!" });
        else res.status(200).send({ success: true, message: "Successfully created!" })
    } catch (err){
        console.log(err.message)
    }
})