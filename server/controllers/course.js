import connectMongo from "../connection.js"
import Course from "../models/Course.js";
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
connectMongo();

export default async function getCoursesByName(req,res){
    try {
        const {name, days, startTime, endTime} = req.query;
        console.log(days)
        
        const newStartTime = new Date(startTime)
        const startTimeString = newStartTime.getUTCHours() + ":" + newStartTime.getUTCMinutes()
        console.log(startTimeString)

        const newEndTime = new Date(endTime)
        const newEndString = newEndTime.getUTCHours() + ":" + newEndTime.getUTCMinutes()
        console.log(newEndString)

        const courses = await Course.find({
           /* $or: [
            { course_name: { $regex: new RegExp(name, 'i') } },  // find classes w/ name that start with given searchterm
           // { Instructors.name: { $regex: new RegExp(name, 'i') }}
            ]*/
           course_code: { $regex: new RegExp(name, 'i') }
        });
        
        if (!courses || courses.length === 0) {
            return res.status(404).json({ status: 'Course not found' });
        }
        return res.json(courses);

    } catch (error) {
        console.log("Error in getCourse:", error);
        res.status(400).json({ status: 'Error fetching course' });
    }
}