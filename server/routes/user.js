// routes/user.js
import express from "express";
import { signupUser, loginUser, logoutUser, getUser, getUserFromDB} from "../controllers/user.js"; // Import controller functions

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/full", getUserFromDB);
router.get("/", getUser);

export default router;