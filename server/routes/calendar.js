import express from "express";
import {getUserCourses, getCourseInfo, removeUserCourse, addUserCourse, optInForAvailabilityAlert} from "../controllers/calendar.js";

const router = express.Router();

router.get("/user", getUserCourses);
router.get("/info", getCourseInfo);
router.post("/deleteCourse", removeUserCourse);
router.post("/addCourse", addUserCourse);
router.post("/optInForAvailabilityAlert", optInForAvailabilityAlert)

export default router;