import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseId:Schema.ObjectId,
    course_name: {
        type: String
    },
    department: {
        type: String
    },
    professor: {
        type: String
    },
    time: {
        type: Date
    },
    credit: {
        type: Number
    },
    class_size: {
        type: Number
    },
    location: {
        type: String
    },
    prerequisites: {
        type: [String]
    },
    grade_distribution: {
        type: Number
    },
    description: {
        type: String
    }
}, { collection: 'course' });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;