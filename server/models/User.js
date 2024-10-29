// /models/User.js
import mongoose from 'mongoose';
import { ObjectId } from 'bson';

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
    year_in_school: {
        type: String,
    },
    major: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,  // Used to store the token sent in the verification email
    },
    resetToken: String,
    resetTokenExpiry: Date,
});

const User = mongoose.model('User', userSchema);
export default User;
