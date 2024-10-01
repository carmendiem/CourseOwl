// controllers/courseController.js
import Course from '../models/Course.js';

// Get courses by course_code
export const getCoursesByCode = async (req, res) => {
    let { course_code } = req.params;  // Use let instead of const

    try {
        // Trim any leading or trailing whitespace
        course_code = course_code.trim();
        
        // Log the trimmed course code for debugging
        console.log(`Trimmed course_code: "${course_code}"`);

        // Find all courses with the same course_code
        const courses = await Course.find({ course_code: course_code });
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found with the given course code' });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
