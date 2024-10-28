import Alert from "../models/Alert.js";

// Get all unread alerts for a specific user
export const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ userId: req.params.userId, isRead: false })
            .populate("courseId");  // Populating each course in the courseId array
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch alerts" });
    }
};

export const getArchivedAlerts = async (req, res) => {
    try {
        const archivedAlerts = await Alert.find({ userId: req.params.userId, isRead: true })
            .populate("courseId");  // Populating each course in the courseId array
        res.status(200).json(archivedAlerts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch archived alerts" });
    }
};

// Mark an alert as read
export const markAlertAsRead = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.status(200).json(alert);
    } catch (error) {
        res.status(500).json({ error: "Failed to mark alert as read" });
    }
};

// Mark an alert as unread
export const markAlertAsUnread = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: false }, { new: true });
        res.status(200).json(alert);
    } catch (error) {
        res.status(500).json({ error: "Failed to mark alert as unread" });
    }
};

// Delete an alert
export const deleteAlert = async (req, res) => {
    try {
        await Alert.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Alert deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete alert" });
    }
};