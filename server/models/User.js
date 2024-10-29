// /models/User.js
import mongoose from 'mongoose';
import { ObjectId} from "bson";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    courses: {
        type: [ObjectId]
    },
    isVerified: {
        type: Boolean
    },
    upvotedReviews: {
        type: [ObjectId]
    },
    notifPreference: {
        type: String,
        enum: ["email", "in_app", "both", "none"],
        default: "in_app",
    },
    avail_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const User = mongoose.model('User', userSchema);
export default User;