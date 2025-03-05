/*
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // Change if needed
    password: "WPsri@712n",  // Your MySQL password
    database: "meat_delivery",
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        return;
    }
    console.log("✅ Connected to MySQL database.");
});

module.exports = db;
*/

/*require("dotenv").config({ path: "./cred.env" });  // 👈 Load env file
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Database connected successfully!");
    }
});

module.exports = db;
*/

/*const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./cred.env") });

// Debugging: Check if DATABASE_URL is loaded
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

// Ensure DATABASE_URL exists before using it
if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL is not defined in cred.env");
    process.exit(1); // Stop execution
}

// Create database connection
const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

module.exports = db;
*/

const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');

// ✅ Explicitly load crd.env
const envPath = path.join(__dirname, 'cred.env');
const result = dotenv.config({ path: envPath });

// ✅ Check if dotenv loaded properly
if (result.error) {
    console.error("❌ Failed to load environment variables from cred.env:", result.error);
    process.exit(1); // Exit the app if .env is missing
}

// ✅ Log environment variables for debugging
console.log("DB_HOST:", process.env.DB_HOST || "❌ Not Loaded");
console.log("DB_USER:", process.env.DB_USER || "❌ Not Loaded");
console.log("DB_PASS:", process.env.DB_PASS ? "✔️ Loaded" : "❌ Not Loaded");
console.log("DB_NAME:", process.env.DB_NAME || "❌ Not Loaded");
console.log("DB_PORT:", process.env.DB_PORT || "❌ Not Loaded");

// ✅ Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

// ✅ Attempt to connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

module.exports = db;
