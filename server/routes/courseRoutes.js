// routes/courseRoutes.js
import { Router } from 'express';
import { getCoursesByCode } from '../controllers/courseController.js';

const router = Router();

// Route to get all courses by course_code
router.get('/code/:course_code', getCoursesByCode);

export default router;
