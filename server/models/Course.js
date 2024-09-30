import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseId:Schema.ObjectId,
    course_name: {
        type: String
    },
    course_code: {
        type: String
    },
    Type: {
        type: String
    },
    Time: {
        type: String
    },
    Days: {
        type: String
    },
    Where: {
        type: String
    },
    'Date Range': {
        type: String // Use exact name as it appears in MongoDB
    },
    'Schedule Type': {
        type: String // Use exact name as it appears in MongoDB
    },
    Instructors: [{
        name: String,
        email: String,
        //alias: String,
        grade_distribution: {
            type: Schema.Types.Mixed, 
            default: {}
        }
    }],
    credit_hours: {
        type: Number
    }
    
}, { collection: 'course_info' });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;