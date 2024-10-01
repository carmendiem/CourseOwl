import Course from '../models/Course.js';

export const getCoursesByCode = async (req, res) => {
    let { course_code } = req.params;

    try {

        course_code = course_code.trim();
        console.log(`Trimmed course_code: "${course_code}"`);

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
