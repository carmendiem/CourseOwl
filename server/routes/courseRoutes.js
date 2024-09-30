// routes/courseRoutes.js
import { Router } from 'express';
import { getCourseById } from '../controllers/courseController.js';

const router = Router();

router.get('/:courseId', getCourseById);

export default router;
