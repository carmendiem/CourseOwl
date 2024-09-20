import connect from "../connection.js"
import Course from "../models/Course.js";
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
connect();

export default async function getCoursesByName(req,res){
    try {
        console.log("Received request for course");
        const {name} = req.query;
        console.log(name)
        const courses = await Course.find({
            course_name: { $regex: new RegExp(`^${name}`, 'i') }  // find classes w/ name that start with given searchterm
        });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ status: 'Course not found' });
        }
        console.log(courses)
        return res.json(courses);

    } catch (error) {
        console.log("Error in getCourse:", error);
        res.status(400).json({ status: 'Error fetching course' });
    }
}