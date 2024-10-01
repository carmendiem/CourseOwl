import connectMongo from "../connection.js"
import Course from "../models/Course.js";
import mongoose from 'mongoose';
import moment from 'moment-timezone';

mongoose.set('strictQuery', false);
connectMongo();

export default async function getCoursesByName(req,res){
    try {
        const {name, days, startTime, endTime} = req.query;
        
        const newStartTime = new Date(startTime)
        const startTimeString = newStartTime.getUTCHours() + ":" + newStartTime.getUTCMinutes()
        //console.log(startTimeString)

        const newEndTime = new Date(endTime)
        const newEndString = newEndTime.getUTCHours() + ":" + newEndTime.getUTCMinutes()
        //console.log(newEndString)

        const daysArray = days.split(',')
        const daysRegex = new RegExp(daysArray.join('|'))
        const courses = await Course.find({
            $or: [
            { course_name: { $regex: new RegExp(name, 'i') } },  // find classes w/ name that start with given searchterm
            { Instructors: { $elemMatch: { name: { $regex: new RegExp(name, 'i') } } }  }
            ],
            Days: { $regex: daysRegex }
        })
        .limit(70);

        const filteredCoursesByTime = courses.filter(course => {
            const [startTimeStr, endTimeStr] = course.Time.split(" - ");
            const userStartTime = moment.tz(startTimeString, 'h:mm a', 'GMT').tz('America/New_York');
            const userEndTime = moment.tz(newEndString, 'h:mm a', 'GMT').tz('America/New_York');

            const startTimeCourse = moment.tz(startTimeStr, 'h:mm a', 'America/New_York');
            const endTimeCourse = moment.tz(endTimeStr, 'h:mm a', 'America/New_York');

            //console.log(userStartTime.format('h:mm a'));
            //console.log(userEndTime.format('h:mm a'));
            //console.log(startTimeCourse.format('h:mm a'));
            //console.log(endTimeCourse.format('h:mm a'));
            // Check if the course's time is within the user's provided range
            const isWithinRange = startTimeCourse.isSameOrAfter(userStartTime) && endTimeCourse.isSameOrBefore(userEndTime);
            console.log(isWithinRange)
            return isWithinRange
        })

        if (!filteredCoursesByTime || filteredCoursesByTime.length === 0) {
            return res.status(404).json({ status: 'Course not found' });
        }
        return res.json(filteredCoursesByTime);

    } catch (error) {
        console.log("Error in getCourse:", error);
        res.status(400).json({ status: 'Error fetching course' });
    }
}