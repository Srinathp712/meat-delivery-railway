/*
const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// 🚀 Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// 🚀 Serve images properly
app.use("/images", express.static(path.join(__dirname, "../frontend/images")));

// 🚀 Serve login page when visiting "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// 🚀 Serve dashboard page
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// 🚀 Use Authentication Routes
app.use("/", authRoutes);

// 🚀 Handle Orders (Store in MySQL with `order_details` column)
app.post("/order", (req, res) => {
    const { name, phone, address, order_details } = req.body;

    if (!name || !phone || !address || !order_details) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = "INSERT INTO orders (name, phone, address, order_details) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, phone, address, order_details], (err, result) => {
        if (err) {
            console.error("⚠️ Error saving order:", err);
            return res.status(500).json({ success: false, message: "Order could not be placed." });
        }
        res.json({ success: true, message: "Order placed successfully!" });
    });
});

// 🚀 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
*/

/*
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Use dynamic port for Railway deployment

// ✅ Allow CORS only from your frontend (Update the URL if needed)
app.use(cors({ origin: "https://meat-delivery-production.up.railway.app" }));


app.use(express.json());

// 🚀 Serve frontend files
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// ✅ Check if frontend directory exists before serving static files
if (!fs.existsSync(frontendPath)) {
    console.error("⚠️ Frontend directory not found:", frontendPath);
}

// 🚀 Serve images properly
app.use("/images", express.static(path.join(frontendPath, "images")));

// 🚀 Serve login page when visiting "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "login.html"), (err) => {
        if (err) res.status(500).send("⚠️ Error loading login page.");
    });
});

// 🚀 Serve dashboard page
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(frontendPath, "dashboard.html"), (err) => {
        if (err) res.status(500).send("⚠️ Error loading dashboard.");
    });
});

// 🚀 Use Authentication Routes
app.use("/", authRoutes);

// 🚀 Handle Orders (Store in MySQL with `order_details` column)
app.post("/order", (req, res) => {
    const { name, phone, address, order_details } = req.body;

    if (!name || !phone || !address || !order_details) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = "INSERT INTO orders (name, phone, address, order_details) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, phone, address, order_details], (err, result) => {
        if (err) {
            console.error("⚠️ Error saving order:", err);
            return res.status(500).json({ success: false, message: "Order could not be placed." });
        }
        res.json({ success: true, message: "Order placed successfully!" });
    });
});

// 🚀 Global error handler for unexpected issues
app.use((err, req, res, next) => {
    console.error("⚠️ Unexpected error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});


process.on("uncaughtException", (err) => {
    console.error("⚠️ Uncaught Exception:", err);
});

process.on("SIGTERM", () => {
    console.log("⚠️ SIGTERM received. Closing gracefully...");
    process.exit(0);
});



// 🚀 Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT} or Railway`);
});
*/

const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const db = require("./db"); // Ensure db.js is correctly configured
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 8080; // ✅ Use dynamic port for Railway

// ✅ Allow CORS for all origins
app.use(cors());
app.use(express.json());

// ✅ Dynamically find the frontend path (for Railway)
const frontendPath = path.join(__dirname, "../frontend"); // Change based on Railway's folder structure
console.log("🛠️ Serving frontend from:", frontendPath);

// ✅ Check if frontend directory exists before serving
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    console.log("✅ Frontend directory found and being served.");
} else {
    console.error("⚠️ Frontend directory not found:", frontendPath);
}

// 🚀 Serve images
app.use("/images", express.static(path.join(frontendPath, "images")));

// 🚀 Serve the main page (default to `login.html` if `index.html` is missing)
app.get("/", (req, res) => {
    const mainFile = fs.existsSync(path.join(frontendPath, "index.html"))
        ? "index.html"
        : "login.html"; // ✅ Fix: Default to login.html if index.html is missing

    console.log(`📄 Serving ${mainFile} as the homepage`);
    
    res.sendFile(path.join(frontendPath, mainFile), (err) => {
        if (err) {
            console.error(`⚠️ Error loading ${mainFile}:`, err);
            res.status(500).send("⚠️ Error loading the homepage.");
        }
    });
});

// 🚀 Serve dashboard page
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(frontendPath, "dashboard.html"), (err) => {
        if (err) res.status(500).send("⚠️ Error loading dashboard.");
    });
});

// 🚀 Use Authentication Routes
app.use("/", authRoutes);

// 🚀 Handle Orders
app.post("/order", (req, res) => {
    const { name, phone, address, order_details } = req.body;

    if (!name || !phone || !address || !order_details) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = "INSERT INTO orders (name, phone, address, order_details) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, phone, address, order_details], (err, result) => {
        if (err) {
            console.error("⚠️ Error saving order:", err);
            return res.status(500).json({ success: false, message: "Order could not be placed." });
        }
        res.json({ success: true, message: "Order placed successfully!" });
    });
});

// 🚀 Handle all unknown routes by redirecting to `/`
app.get("*", (req, res) => {
    res.redirect("/");
});

// 🚀 Global error handler
app.use((err, req, res, next) => {
    console.error("⚠️ Unexpected error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// 🚀 Keep MySQL connection alive
setInterval(() => {
    db.query("SELECT 1", (err) => {
        if (err) console.error("⚠️ MySQL Keep-Alive Error:", err);
    });
}, 30000); // Ping DB every 30s

// 🚀 Start Server (Explicitly bind to 0.0.0.0 for Railway)
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// 🚀 Handle process termination properly
process.on("SIGTERM", () => {
    console.log("⚠️ SIGTERM received. Closing gracefully...");
    server.close(() => {
        console.log("🛑 Server closed.");
        process.exit(0);
    });
});

// 🚀 Catch unexpected errors
process.on("uncaughtException", (err) => {
    console.error("⚠️ Uncaught Exception:", err);
});
setInterval(() => {
    console.log("✅ Keeping the app alive...");
}, 10000); // Log every 10 seconds to prevent idle shutdown
