// routes/user.js
import express from "express";
import { signupUser, loginUser, logoutUser, getUser, getUserFromDB, getFreshUserInfo} from "../controllers/user.js"; // Import controller functions

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/full", getUserFromDB)
router.get("/", getUser);
router.get("/verifyFull", getFreshUserInfo);

export default router;