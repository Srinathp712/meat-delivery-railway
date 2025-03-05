const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "❌ Email and password required" });

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            if (results[0].password === password) {
                return res.json({ message: "✅ Login successful" });
            } else {
                return res.status(401).json({ message: "❌ Incorrect password" });
            }
        } else {
            return res.status(404).json({ message: "❌ User not found. Please register!" });
        }
    });
});

router.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "❌ Email and password required" });

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            return res.status(409).json({ message: "❌ User already exists!" });
        } else {
            db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (err) => {
                if (err) return res.status(500).json({ message: "Database error" });
                return res.json({ message: "✅ Registration successful!" });
            });
        }
    });
});

module.exports = router;
