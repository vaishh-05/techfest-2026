const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Invalid input types"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Login (Step 3 & Step 5: Sanitized input + Secure HttpOnly Cookie)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Defensive type check preventing object injection
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Invalid email or password format (injection attempt blocked)"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || "default_jwt_secret",
            {
                expiresIn: "1h"
            }
        );

        // Step 5: Set Secure, HttpOnly, SameSite Cookie
        res.cookie("token", token, {
            httpOnly: true, // Inaccessible to JavaScript (document.cookie) -> Stops XSS token theft
            secure: process.env.NODE_ENV === "production", // Transmitted only via HTTPS in production
            sameSite: "strict", // Cookie not sent with third-party cross-site requests -> Stops CSRF
            maxAge: 3600000 // 1 hour
        });

        res.json({
            message: "Login successful",
            token,
            name: user.name,
            role: user.role
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Logout (Clears secure cookie)
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
