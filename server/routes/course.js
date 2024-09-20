import express from "express";
import getCoursesByName from '../controllers/course.js';

const router = express.Router();

router.get('/', getCoursesByName);

export default router;