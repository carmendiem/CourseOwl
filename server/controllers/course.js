import connectMongo from "../connection.js"
import Course from "../models/Course.js";
import mongoose from 'mongoose';
import moment from 'moment-timezone';

mongoose.set('strictQuery', false);
connectMongo();

export default async function getCoursesByName(req, res) {
    try {
        const { name, days, startTime, endTime } = req.query;

        const newStartTime = new Date(startTime)
        const startTimeString = newStartTime.getUTCHours() + ":" + newStartTime.getUTCMinutes()

        const newEndTime = new Date(endTime)
        const endTimeString = newEndTime.getUTCHours() + ":" + newEndTime.getUTCMinutes()

        const daysArray = days.split(',')
        const daysRegex = new RegExp(daysArray.join('|'))
        const courses = await Course.find({
            $or: [
                { course_code: { $regex: new RegExp(`^${name}`, 'i') } },  // find classes w/ name that start with given searchterm
                { Instructors: { $elemMatch: { name: { $regex: new RegExp(name, 'i') } } } }
            ],
            Days: { $regex: daysRegex },
            credit_hours: { $lte: 10 }
        })
        .sort({credit_hours: -1, course_code: -1})
        .limit(250)

        if (startTimeString !== "NaN:NaN" && endTimeString !== "NaN:NaN") {
            const filteredCoursesByTime = courses.filter(course => {
                const [startTimeStr, endTimeStr] = course.Time.split(" - ");
                const userStartTime = moment.tz(startTimeString, 'h:mm a', 'GMT').tz('America/New_York');
                const userEndTime = moment.tz(endTimeString, 'h:mm a', 'GMT').tz('America/New_York');

                const startTimeCourse = moment.tz(startTimeStr, 'h:mm a', 'America/New_York');
                const endTimeCourse = moment.tz(endTimeStr, 'h:mm a', 'America/New_York');

                // Check if the course's time is within provided range
                const isWithinRange = startTimeCourse.isSameOrAfter(userStartTime) && endTimeCourse.isSameOrBefore(userEndTime);
                return isWithinRange
            })

            if (!filteredCoursesByTime || filteredCoursesByTime.length === 0) {
                return res.status(404).json({ status: 'Course not found' });
            }
            return res.json(filteredCoursesByTime);
        }
        else if (startTimeString !== "NaN:NaN") {
            const filteredCoursesByTime = courses.filter(course => {
            const [startTimeStr, endTimeStr] = course.Time.split(" - ");
            const userStartTime = moment.tz(startTimeString, 'h:mm a', 'GMT').tz('America/New_York');
            const startTimeCourse = moment.tz(startTimeStr, 'h:mm a', 'America/New_York');

            const isWithinRange = startTimeCourse.isSameOrAfter(userStartTime);
             return isWithinRange
            })
            if (!filteredCoursesByTime || filteredCoursesByTime.length === 0) {
                return res.status(404).json({ status: 'Course not found' });
            }
            return res.json(filteredCoursesByTime);
        }
        else if (endTimeString !== "NaN:NaN") {
            const filteredCoursesByTime = courses.filter(course => {
                const [startTimeStr, endTimeStr] = course.Time.split(" - ");
                const userEndTime = moment.tz(endTimeString, 'h:mm a', 'GMT').tz('America/New_York');
                const endTimeCourse = moment.tz(endTimeStr, 'h:mm a', 'America/New_York');
    
                const isWithinRange = endTimeCourse.isSameOrBefore(userEndTime);
                 return isWithinRange
                })
                if (!filteredCoursesByTime || filteredCoursesByTime.length === 0) {
                    return res.status(404).json({ status: 'Course not found' });
                }
                return res.json(filteredCoursesByTime);
        }

        if (!courses || courses.length === 0) {
            return res.status(404).json({ status: 'Course not found' });
        }
        return res.json(courses);

    } catch (error) {
        console.log("Error in getCourse:", error);
        res.status(400).json({ status: 'Error fetching course' });
    }
}