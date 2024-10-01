import { Router } from 'express';
import { getCoursesByCode } from '../controllers/courseController.js';

const router = Router();

router.get('/code/:course_code', getCoursesByCode);

export default router;
