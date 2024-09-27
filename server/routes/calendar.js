import express from "express";
import {getUserCourses, getCourseInfo} from "../controllers/calendar.js";

const router = express.Router();

router.get("/user", getUserCourses);
router.get("/info", getCourseInfo);

export default router;