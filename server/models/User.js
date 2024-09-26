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
    }
});

const User = mongoose.model('User', userSchema);
export default User;