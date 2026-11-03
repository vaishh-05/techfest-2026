const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// Register for an event
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({
                message: "Event ID is required"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        if (event.seats <= 0) {
            return res.status(400).json({
                message: "No seats available"
            });
        }

        const existingRegistration =
            await Registration.findOne({
                user: req.user.id,
                event: eventId
            });

        if (existingRegistration) {
            return res.status(400).json({
                message: "Already registered for this event"
            });
        }

        const registration = new Registration({
            user: req.user.id,
            event: eventId
        });

        await registration.save();

        event.seats -= 1;

        await event.save();

        res.status(201).json({
            message: "Event registration successful",
            registration
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// View logged-in user's registrations
router.get("/my", authMiddleware, async (req, res) => {
    try {
        const registrations = await Registration.find({
            user: req.user.id
        })
            .populate("event")
            .populate("user", "name email");

        res.json(registrations);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;