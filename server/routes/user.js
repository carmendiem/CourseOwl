// routes/user.js
import express from "express";
import { signupUser, loginUser, logoutUser, getUser, updateUserDetails, sendVerificationEmail, verifyUser, getFreshUserInfo } from "../controllers/user.js"; // Import controller functions

const router = express.Router();

// Define routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", getUser);
router.get("/verifyFull", getFreshUserInfo);
router.put('/update', updateUserDetails);
router.post('/verify/send', sendVerificationEmail); // Route to trigger sending verification email
router.get('/verify/:token', verifyUser);


export default router;