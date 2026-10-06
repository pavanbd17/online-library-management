const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Database connection
const connectDB = require("./config/db");

// Create Express application
const app = express();

// Connect MongoDB
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// ==========================================
// STATIC FRONTEND
// ==========================================

const clientPath = path.join(__dirname, "..", "client");

app.use(express.static(clientPath));

// ==========================================
// BASIC API TEST
// ==========================================

app.get("/api", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Online Library Management API is running"
    });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        server: "Online",
        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected"
    });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/fines", require("./routes/adminRoutes"));
app.get("/api/stats/public", require("./controllers/adminController").publicStats);

// ==========================================
// FRONTEND ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res, next) => {
    // API 404
    if (req.originalUrl.startsWith("/api/")) {
        return res.status(404).json({
            success: false,
            message: "API route not found"
        });
    }

    // Frontend 404
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Page Not Found</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 100px;
                }

                h1 {
                    font-size: 60px;
                    margin-bottom: 10px;
                }

                p {
                    font-size: 20px;
                }

                a {
                    color: #2563eb;
                    text-decoration: none;
                }
            </style>
        </head>

        <body>
            <h1>404</h1>
            <p>Page not found.</p>
            <a href="/">Go to Home</a>
        </body>
        </html>
    `);
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log("==========================================");
    console.log(" Online Library Management System");
    console.log("==========================================");
    console.log(` Server running on: http://localhost:${PORT}`);
    console.log(` API running on: http://localhost:${PORT}/api`);
    console.log("==========================================");
});

// ==========================================
// HANDLE UNHANDLED ERRORS
// ==========================================

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Promise Rejection:", error.message);

    server.close(() => {
        process.exit(1);
    });
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error.message);
    process.exit(1);
});