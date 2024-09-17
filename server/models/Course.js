import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String
    }
}, { collection: 'course' });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;