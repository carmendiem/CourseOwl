import connect from "../connection.js"
import Course from "../models/Course.js";
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
connect();

export default async function getCourse(req,res){
    try {
        console.log("Received request for course");
        //const {name} = req.query;
        const course = await Course.findOne({})
        if (!course) {
            return res.status(404).json({ status: 'Course not found' });
        }
        else {
            return res.json(course);
        }
    } catch (error) {
        console.log("Error in getCourse:", error);
        res.status(400).json({ status: 'Error fetching course' });
    }
}