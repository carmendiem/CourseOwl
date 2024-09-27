import connectMongo from "../connection.js"
import UserModel from "../models/User.js";
import Course from "../models/Course.js";
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
connectMongo();

export const getUserCourses = async (req, res) => {
    try {
        const {userId} = req.query;
        // console.log("userid: ",userId)
        const user = await UserModel.findById(userId);
        const courses = user.courses;
        if (courses != null) {
            return res.json(courses);
        } else {
            return res.status(404).json({ status: 'User not found' });
        }
    } catch (error) {
        console.log("Error in getUserCourse:", error);
        res.status(400).json({ status: 'Error fetching course' });
    }
}

export const getCourseInfo = async (req, res) => {
    try {
        const {courseId} = req.query;
        // console.log("courseid",courseId)
        const course = await Course.findById(courseId);
        if (course != null) {
            return res.json(course);
        } else {
            return res.status(404).json({ status: 'Course not found' });
        }
    } catch (error) {
        console.log("Error in getCourseInfo:", error);
        res.status(400).json({ status: 'Error fetching course' });
    }
}


