import express from "express";
import {getUserCourses, getCourseInfo, removeUserCourse, addUserCourse, optInForAvailabilityAlert, getUserWishlist, removeUserWishlist, addUserCourseWishlist, checkWishlist} from "../controllers/calendar.js";

const router = express.Router();

router.get("/user", getUserCourses);
router.get("/info", getCourseInfo);
router.post("/deleteCourse", removeUserCourse);
router.post("/addCourse", addUserCourse);
router.post("/optInForAvailabilityAlert", optInForAvailabilityAlert)

//wishlist
router.get("/userW", getUserWishlist);
router.post("/deleteCourseW", removeUserWishlist);
router.post("/addCourseW", addUserCourseWishlist);
router.post('/checkWishlist', checkWishlist);

export default router;