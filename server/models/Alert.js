// models/Alert.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the schema for an alert
const alertSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: [{ type: Schema.Types.ObjectId, ref: "Course", required: true }], // courseId as an array
    type: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
});

// Create and export the Alert model
export default model("Alert", alertSchema);
