// routes/alert.js
import express from "express";
import { getAlerts, getArchivedAlerts, markAlertAsRead, markAlertAsUnread, deleteAlert } from "../controllers/alert.js";

const router = express.Router();

// Get all unread alerts for a specific user
router.get("/:userId", getAlerts);

// Get all archived alerts for a specific user
router.get("/:userId/archived", getArchivedAlerts);

// Create a new alert
// router.post("/", createAlert);

// Mark an alert as read
router.put("/:id/read", markAlertAsRead);

// Mark an alert as unread
router.put("/:id/unread", markAlertAsUnread);  // New route for marking as unread

// Delete an alert
router.delete("/:id", deleteAlert);

export default router;