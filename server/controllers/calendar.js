import connectMongo from "../connection.js"
import UserModel from "../models/User.js";
import Course from "../models/Course.js";
import mongoose from 'mongoose';
import AlertModel from "../models/Alert.js"; // Assuming Alert.js is your alert schema file
import moment from 'moment';
import nodemailer from 'nodemailer';

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

export const removeUserCourse = async (req, res) => {
    try {
        const { email, courseId } = req.body;

        // Remove the course from the user's list
        const user = await UserModel.findOneAndUpdate(
            { email: email },
            { $pull: { courses: courseId } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ status: 'User not found' });
        }

        // Delete all "Time Conflict" alerts involving the removed course
        await AlertModel.deleteMany({
            userId: user._id,
            courseId: courseId,
            type: "Time Conflict"
        });

        return res.json({ status: 'Course removed and relevant alerts deleted' });
    } catch (error) {
        console.log("Error in removeUserCourse:", error);
        res.status(500).json({ status: 'Error removing course and updating alerts' });
    }
};

// Inside the same file as `addUserCourse`
const smtpServer = "smtp.gmail.com";
const smtpPort = 587;
const emailSender = "courseowlapp@gmail.com";
const emailPassword = "uxqv ebab htkf vswi";

const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: smtpPort,
    secure: false,
    auth: {
        user: emailSender,
        pass: emailPassword,
    },
});

const sendAlertEmail = async (user, alert) => {
    let message = `Dear ${user.name},\n\nYou have a new alert on CourseOwl:\n`;

    if (alert.type === "Availability Update") {
        const course = await Course.findById(alert.courseId[0]);
        message += `
        Type: ${alert.type}
        Course: ${course.course_name} (${course.course_code})
        Schedule: ${course.Days || "N/A"} ${course.Time || "N/A"}
        Instructor: ${course.Instructors[0]?.name || "TBA"}
        
        Note: A change has been made to the availability of this course.\n\n`;
    } else if (alert.type === "Time Conflict") {
        const [course1, course2] = await Promise.all(
            alert.courseId.map(courseId => Course.findById(courseId))
        );

        message += `
        Type: ${alert.type}
        Conflicting Courses:
        
        Course 1: ${course1.course_name} (${course1.course_code})
        Schedule: ${course1.Days || "N/A"} ${course1.Time || "N/A"}
        Instructor: ${course1.Instructors[0]?.name || "TBA"}
        
        Course 2: ${course2.course_name} (${course2.course_code})
        Schedule: ${course2.Days || "N/A"} ${course2.Time || "N/A"}
        Instructor: ${course2.Instructors[0]?.name || "TBA"}
        
        Note: The above courses have a scheduling conflict.\n\n`;
    }

    message += `Please log in to CourseOwl to manage your alerts.\n\nBest regards,\nCourseOwl Team`;

    await transporter.sendMail({
        from: emailSender,
        to: user.email,
        subject: "New Alert on CourseOwl",
        text: message,
    });

    // console.log("sending ", message, "to ", user.email);
};

export const addUserCourse = async (req, res) => {
    try {
        const { email, courseId } = req.body;

        // Fetch the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "User not found" });
        }

        // Check if course is already added
        if (user.courses.includes(courseId)) {
            return res.json({ status: "Course already added" });
        }

        // Fetch details of the course to be added
        const newCourse = await Course.findById(courseId);
        if (!newCourse) {
            return res.status(404).json({ status: "Course not found" });
        }

        // Parse the days and time of the new course
        const newCourseDays = newCourse.Days.split('');
        const [newStartTime, newEndTime] = newCourse.Time.split('-').map(time => moment(time.trim(), 'h:mm a'));

        // Fetch all currently enrolled courses of the user
        const existingCourses = await Course.find({ _id: { $in: user.courses } });

        let conflictDetected = false;
        const conflictCourses = [];

        // Check for time conflict with existing courses
        for (let course of existingCourses) {
            // Parse the days and time of the existing course
            const courseDays = course.Days.split('');
            const [startTime, endTime] = course.Time.split('-').map(time => moment(time.trim(), 'h:mm a'));

            // Check for day overlap
            const dayOverlap = courseDays.some(day => newCourseDays.includes(day));

            // Check for time overlap if there's a day overlap
            const timeOverlap = dayOverlap &&
                (newStartTime.isBetween(startTime, endTime, null, '[)') ||
                 newEndTime.isBetween(startTime, endTime, null, '(]') ||
                 (newStartTime.isSameOrBefore(startTime) && newEndTime.isSameOrAfter(endTime)));

            if (timeOverlap) {
                conflictDetected = true;
                conflictCourses.push(course); // Add conflicting course to the list

                // Create a time conflict alert for this course pair
                const timeConflictAlert = new AlertModel({
                    userId: user._id,
                    courseId: [course._id, newCourse._id],
                    type: "Time Conflict",
                    date: new Date(),
                    isRead: false,
                });

                await timeConflictAlert.save(); // Save the alert in the database

                if (user.notifPreference === "email" || user.notifPreference === "both") {
                    await sendAlertEmail(user, timeConflictAlert);
                }
            }
        }

        // Add the course to the user's course list regardless of conflicts
        user.courses.push(courseId);
        await user.save();

        if (conflictDetected) {
            return res.json({
                status: "Course added with time conflicts",
                timeConflict: true,
                conflictingCourses: conflictCourses.map(course => ({
                    name: course.course_name,
                    code: course.course_code,
                    schedule: `${course.Days} ${course.Time}`
                }))
            });
        }

        return res.json({ status: "Course added" });
    } catch (error) {
        console.error("Error in addUserCourse:", error);
        res.status(500).json({ status: "Error adding course" });
    }
};