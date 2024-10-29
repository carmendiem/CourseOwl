// routes/user.js
import express from "express";

import { signupUser, loginUser, logoutUser, getUser, updateUserDetails, sendVerificationEmail, verifyUser, getFreshUserInfo, forgotPassword, resetPassword, getUserFromDB } from "../controllers/user.js"; // Import controller functions


const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/full", getUserFromDB);
router.get("/", getUser);
router.get("/verifyFull", getFreshUserInfo);

router.put('/update', updateUserDetails);
router.post('/verify/send', sendVerificationEmail); // Route to trigger sending verification email
router.get('/verify/:token', verifyUser);
router.post('/forgot-password', forgotPassword);

// Route to reset the password using the token
router.post('/reset-password/:token', resetPassword);

export default router;