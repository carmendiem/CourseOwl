import express from "express";
import {getUserCourses, getCourseInfo, removeUserCourse, addUserCourse} from "../controllers/calendar.js";

const router = express.Router();

router.get("/user", getUserCourses);
router.get("/info", getCourseInfo);
router.post("/deleteCourse", removeUserCourse);
router.post("/addCourse", addUserCourse);

export default router;