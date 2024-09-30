// controllers/courseController.js
import Course from '../models/Course.js';

export const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
