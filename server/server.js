require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const registrationRoutes = require("./routes/registrations");

const logger = require("./middleware/logger");

const {
    notFound,
    errorHandler
} = require("./middleware/errorHandler");

const app = express();

// Security Middlewares (Experiment 5: Step 3 & 4)
app.use(helmet());

// Express 5 compatible MongoDB sanitization (cleans bad input, removes $, and prevents NoSQL injection)
app.use((req, res, next) => {
    if (req.body) {
        req.body = mongoSanitize.sanitize(req.body);
    }
    if (req.params) {
        req.params = mongoSanitize.sanitize(req.params);
    }
    next();
});

app.use(cookieParser());

// Standard Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));
app.use(express.json({ limit: "10kb" })); // Body limit prevents DoS
app.use(logger);

// Health check endpoint for CI/CD & Cloud deployment
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// MongoDB connection (only connect if not in testing environment)
if (process.env.NODE_ENV !== "test") {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log("DB error:", err.message);
        });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
