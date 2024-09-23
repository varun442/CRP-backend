const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Recognition = require("../models/Recognition")
const mongoose = require("mongoose");

// Submit Recognition
router.post("/submit", async (req, res) => {
    try {
        const { fromUserId, toUserId, message, category, points } = req.body;

        // Validate input
        if (!fromUserId || !toUserId || !message || !category || !points) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Ensure fromUserId and toUserId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(fromUserId) || !mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Find the users
        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);

        if (!fromUser || !toUser) {
            return res.status(404).json({ message: "One or both users not found" });
        }

        // Check if the fromUser has enough available points
        if (fromUser.available_points < points) {
            return res.status(400).json({ message: "Insufficient points to give recognition" });
        }

        // Update the points for both users
        fromUser.available_points -= points;
        fromUser.gifted_points += points;
        toUser.points += points;
        toUser.gained_points += points;

        // Save the updated user documents
        await fromUser.save();
        await toUser.save();

        // Create and save a new recognition document
        const newRecognition = new Recognition({
            fromUserId,
            toUserId,
            message,
            category,
            points
        });
        await newRecognition.save();

        res.status(200).json({
            fromUser: {
                id: fromUser._id,
                available_points: fromUser.available_points,
                gifted_points: fromUser.gifted_points
            },
            toUser: {
                id: toUser._id,
                points: toUser.points,
                gained_points: toUser.gained_points,
                available_points: toUser.available_points
            },
            recognition: newRecognition
        });

    } catch (error) {
        console.error("Submit recognition error:", error);
        res.status(500).json({ message: "Server error during recognition submission", error: error.message });
    }
});



router.get("/", async (req, res) => {
    try {
        const recognitions = await Recognition.find()
            .sort({ date: -1 })
            .populate('fromUserId', 'fullName')
            .populate('toUserId', 'fullName');

        res.status(200).json({
            recognitions: recognitions.map(r => ({
                id: r._id,
                from: r.fromUserId.fullName,
                to: r.toUserId.fullName,
                message: r.message,
                category: r.category,
                points: r.points,
                date: r.date
            }))
        });
    } catch (error) {
        console.error("Get all recognitions error:", error);
        res.status(500).json({ message: "Server error while fetching all recognitions", error: error.message });
    }
});



// Get All Recognitions for a Specific User
router.get("/all/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const recognitions = await Recognition.find({
            $or: [{ fromUserId: userId }, { toUserId: userId }]
        })
            .sort({ date: -1 })
            .populate('fromUserId', 'fullName')
            .populate('toUserId', 'fullName');

        res.status(200).json({
            recognitions: recognitions.map(r => ({
                id: r._id,
                from: r.fromUserId.fullName,
                to: r.toUserId.fullName,
                message: r.message,
                category: r.category,
                points: r.points,
                date: r.date,
                isReceived: r.toUserId._id.toString() === userId
            }))
        });
    } catch (error) {
        console.error("Get all recognitions for user error:", error);
        res.status(500).json({ message: "Server error while fetching user recognitions", error: error.message });
    }
});

module.exports = router;