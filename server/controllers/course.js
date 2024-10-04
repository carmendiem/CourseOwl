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
            .sort({ credit_hours: -1, course_code: -1 })
            .limit(250)
        if (startTimeString !== "NaN:NaN" && endTimeString !== "NaN:NaN") {
            const filteredCoursesByTime = courses.filter(course => {
                const [startTimeStr, endTimeStr] = course.Time.split(" - ");
                // Convert GMT to EST bc MUI stores date as GMT
                const userStartTimeGMT = moment.tz(startTimeString, 'h:mm a', 'GMT');
                const userStartTimeEST = userStartTimeGMT.clone().tz('America/New_York');

                const userEndTimeGMT = moment.tz(endTimeString, 'h:mm a', 'GMT');
                const userEndTimeEST = userEndTimeGMT.clone().tz('America/New_York');

                const startTimeCourseEST = moment.tz(startTimeStr, 'h:mm a', 'America/New_York');
                const endTimeCourseEST = moment.tz(endTimeStr, 'h:mm a', 'America/New_York');

                // Extract just the hours and minutes for comparison
                const userStartTimeOnly = { hours: userStartTimeEST.hours(), minutes: userStartTimeEST.minutes() };
                const userEndTimeOnly = { hours: userEndTimeEST.hours(), minutes: userEndTimeEST.minutes() };

                const courseStartTimeOnly = { hours: startTimeCourseEST.hours(), minutes: startTimeCourseEST.minutes() };
                const courseEndTimeOnly = { hours: endTimeCourseEST.hours(), minutes: endTimeCourseEST.minutes() };

                // Function to compare time objects 
                const isTimeWithinRange = (startTime, endTime, courseStart, courseEnd) => {
                    const isAfterStart = (courseStart.hours > startTime.hours) ||
                        (courseStart.hours === startTime.hours && courseStart.minutes >= startTime.minutes);
                    const isBeforeEnd = (courseEnd.hours < endTime.hours) ||
                        (courseEnd.hours === endTime.hours && courseEnd.minutes <= endTime.minutes);
                    return isAfterStart && isBeforeEnd;
                };

                const isWithinRange = isTimeWithinRange(userStartTimeOnly, userEndTimeOnly, courseStartTimeOnly, courseEndTimeOnly);

                return isWithinRange;
            })

            if (!filteredCoursesByTime || filteredCoursesByTime.length === 0) {
                return res.status(404).json({ status: 'Course not found' });
            }
            return res.json(filteredCoursesByTime);
        }
        else if (startTimeString !== "NaN:NaN") {
            const filteredCoursesByTime = courses.filter(course => {
                const [startTimeStr, endTimeStr] = course.Time.split(" - ");
        
                const userStartTimeGMT = moment.tz(startTimeString, 'h:mm a', 'GMT');
                const userStartTimeEST = userStartTimeGMT.clone().tz('America/New_York');
        
                const startTimeCourseEST = moment.tz(startTimeStr, 'h:mm a', 'America/New_York');

                const userStartTimeOnly = {
                    hours: userStartTimeEST.hours(),
                    minutes: userStartTimeEST.minutes(),
                };
        
                const startTimeCourseOnly = {
                    hours: startTimeCourseEST.hours(),
                    minutes: startTimeCourseEST.minutes(),
                };
        
                const isWithinRange = (startTimeCourseOnly.hours > userStartTimeOnly.hours) || 
                    (startTimeCourseOnly.hours === userStartTimeOnly.hours && 
                    startTimeCourseOnly.minutes >= userStartTimeOnly.minutes);
        
                return isWithinRange;
            });
        
            if (!filteredCoursesByTime || filteredCoursesByTime.length === 0) {
                return res.status(404).json({ status: 'Course not found' });
            }
        
            return res.json(filteredCoursesByTime);
        }
        else if (endTimeString !== "NaN:NaN") {
            const filteredCoursesByTime = courses.filter(course => {
                const [startTimeStr, endTimeStr] = course.Time.split(" - ");
        
                const userEndTimeGMT = moment.tz(endTimeString, 'h:mm a', 'GMT');
                const userEndTimeEST = userEndTimeGMT.clone().tz('America/New_York');
        
                const endTimeCourseEST = moment.tz(endTimeStr, 'h:mm a', 'America/New_York');
        
                const userEndTimeOnly = {
                    hours: userEndTimeEST.hours(),
                    minutes: userEndTimeEST.minutes(),
                };
        
                const endTimeCourseOnly = {
                    hours: endTimeCourseEST.hours(),
                    minutes: endTimeCourseEST.minutes(),
                };
        
                const isWithinRange = (endTimeCourseOnly.hours < userEndTimeOnly.hours) || 
                    (endTimeCourseOnly.hours === userEndTimeOnly.hours && 
                    endTimeCourseOnly.minutes <= userEndTimeOnly.minutes);
        
                return isWithinRange;
            });
        
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