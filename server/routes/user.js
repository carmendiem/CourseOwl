// routes/user.js
import express from "express";
import { signupUser, loginUser, logoutUser, getUser } from "../controllers/user.js"; // Import controller functions

const router = express.Router();

// Define routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", getUser);

export default router;