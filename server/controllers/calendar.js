import connectMongo from "../connection.js";
import UserModel from "../models/User.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";
import AlertModel from "../models/Alert.js";
import moment from "moment";
import nodemailer from "nodemailer";

import { JSDOM } from "jsdom"; // Add this import for JSDOM
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Set up Chrome options
const options = new chrome.Options();
options.addArguments('--headless'); // Run in headless mode
options.addArguments('--ignore-certificate-errors');
options.addArguments('--disable-gpu');
options.addArguments('--no-sandbox');

// Initialize the Chrome driver with options
const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();


mongoose.set("strictQuery", false);
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

// const sendAlertEmail = async (user, alert) => {
//     let message = `Dear ${user.name},\n\nYou have a new alert on CourseOwl:\n`;

//     if (alert.type === "Availability Update") {
//         const course = await Course.findById(alert.courseId[0]);
//         message += `
//         Type: ${alert.type}
//         Course: ${course.course_name} (${course.course_code})
//         Schedule: ${course.Days || "N/A"} ${course.Time || "N/A"}
//         Instructor: ${course.Instructors[0]?.name || "TBA"}
        
//         Note: A change has been made to the availability of this course.\n\n`;
//     } else if (alert.type === "Time Conflict") {
//         const [course1, course2] = await Promise.all(
//             alert.courseId.map(courseId => Course.findById(courseId))
//         );

//         message += `
//         Type: ${alert.type}
//         Conflicting Courses:
        
//         Course 1: ${course1.course_name} (${course1.course_code})
//         Schedule: ${course1.Days || "N/A"} ${course1.Time || "N/A"}
//         Instructor: ${course1.Instructors[0]?.name || "TBA"}
        
//         Course 2: ${course2.course_name} (${course2.course_code})
//         Schedule: ${course2.Days || "N/A"} ${course2.Time || "N/A"}
//         Instructor: ${course2.Instructors[0]?.name || "TBA"}
        
//         Note: The above courses have a scheduling conflict.\n\n`;
//     }

//     message += `Please log in to CourseOwl to manage your alerts.\n\nBest regards,\nCourseOwl Team`;

//     await transporter.sendMail({
//         from: emailSender,
//         to: user.email,
//         subject: "New Alert on CourseOwl",
//         text: message,
//     });

//     // console.log("sending ", message, "to ", user.email);
// };

// export const addUserCourse = async (req, res) => {
//     try {
//         const { email, courseId } = req.body;

//         // Fetch the user by email
//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ status: "User not found" });
//         }

//         // Check if course is already added
//         if (user.courses.includes(courseId)) {
//             return res.json({ status: "Course already added" });
//         }

//         // Fetch details of the course to be added
//         const newCourse = await Course.findById(courseId);
//         if (!newCourse) {
//             return res.status(404).json({ status: "Course not found" });
//         }

//         // Parse the days and time of the new course
//         const newCourseDays = newCourse.Days.split('');
//         const [newStartTime, newEndTime] = newCourse.Time.split('-').map(time => moment(time.trim(), 'h:mm a'));

//         // Fetch all currently enrolled courses of the user
//         const existingCourses = await Course.find({ _id: { $in: user.courses } });

//         let conflictDetected = false;
//         const conflictCourses = [];

//         // Check for time conflict with existing courses
//         for (let course of existingCourses) {
//             // Parse the days and time of the existing course
//             const courseDays = course.Days.split('');
//             const [startTime, endTime] = course.Time.split('-').map(time => moment(time.trim(), 'h:mm a'));

//             // Check for day overlap
//             const dayOverlap = courseDays.some(day => newCourseDays.includes(day));

//             // Check for time overlap if there's a day overlap
//             const timeOverlap = dayOverlap &&
//                 (newStartTime.isBetween(startTime, endTime, null, '[)') ||
//                  newEndTime.isBetween(startTime, endTime, null, '(]') ||
//                  (newStartTime.isSameOrBefore(startTime) && newEndTime.isSameOrAfter(endTime)));

//             if (timeOverlap) {
//                 conflictDetected = true;
//                 conflictCourses.push(course); // Add conflicting course to the list

//                 // Create a time conflict alert for this course pair
//                 const timeConflictAlert = new AlertModel({
//                     userId: user._id,
//                     courseId: [course._id, newCourse._id],
//                     type: "Time Conflict",
//                     date: new Date(),
//                     isRead: false,
//                 });

//                 await timeConflictAlert.save(); // Save the alert in the database

//                 if (user.notifPreference === "email" || user.notifPreference === "both") {
//                     await sendAlertEmail(user, timeConflictAlert);
//                 }
//             }
//         }

//         // Add the course to the user's course list regardless of conflicts
//         user.courses.push(courseId);
//         await user.save();

//         if (conflictDetected) {
//             return res.json({
//                 status: "Course added with time conflicts",
//                 timeConflict: true,
//                 conflictingCourses: conflictCourses.map(course => ({
//                     name: course.course_name,
//                     code: course.course_code,
//                     schedule: `${course.Days} ${course.Time}`
//                 }))
//             });
//         }

//         return res.json({ status: "Course added" });
//     } catch (error) {
//         console.error("Error in addUserCourse:", error);
//         res.status(500).json({ status: "Error adding course" });
//     }
// };


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
            alert.courseId.map((courseId) => Course.findById(courseId))
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
};

// Function to scrape course availability
const getCourseAvailability = async (courseUrl) => {
    const driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();
    let remainingSeats = null;

    try {
        // Step 1: Navigate to the course availability page
        await driver.get(courseUrl);

        // Step 2: Wait for the seating table to load
        await driver.wait(until.elementLocated(By.css("table[summary='This layout table is used to present the seating numbers.']")), 20000);

        // Step 3: Retry mechanism to handle "too many requests" error
        let attempts = 0;
        const maxAttempts = 3; // Limit retries to prevent infinite loop
        while (attempts < maxAttempts) {
            const pageSource = await driver.getPageSource();

            if (!pageSource.includes("received too many requests")) {
                // Parse the page with JSDOM
                const dom = new JSDOM(pageSource);
                const document = dom.window.document;

                // Step 4: Locate the table with seating information
                const table = document.querySelector("table[summary='This layout table is used to present the seating numbers.']");
                if (table) {
                    const rows = table.querySelectorAll("tr");
                    if (rows.length > 1) {
                        const cells = rows[1].querySelectorAll("td");
                        if (cells.length === 3) {
                            remainingSeats = parseInt(cells[2].textContent.trim(), 10); // Get remaining seats
                            break; // Exit the loop if we successfully get remaining seats
                        }
                    }
                }
            } else {
                console.log("Received 'too many requests' message, retrying...");
                await driver.sleep(10000); // Wait 10 seconds before retrying
                attempts += 1;
            }
        }

        if (remainingSeats === null) {
            console.error("Failed to retrieve remaining seats due to 'too many requests' or missing data.");
        }

    } catch (error) {
        console.error("Error in getCourseAvailability:", error);
    } finally {
        // Ensure the driver is closed
        await driver.quit();
    }
    return remainingSeats;
};


// Main addUserCourse function
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

        // Fetch course details
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "Course not found" });
        }

        // Check and save availability using avail_url from the course document
        const remainingSeats = await getCourseAvailability(course.avail_url);  // Using avail_url from the course document
        course.availSeats = remainingSeats || 0;
        await course.save();

        if (remainingSeats === 0) {
            return res.json({
                status: "Course is full. Would you like to receive an alert when it becomes available?",
                courseFull: true,
                courseId: courseId
            });
        }

        // Parse new course days and times
        const newCourseDays = course.Days.split("");
        const [newStartTime, newEndTime] = course.Time.split("-").map((time) => moment(time.trim(), "h:mm a"));

        // Fetch existing courses and check for conflicts
        const existingCourses = await Course.find({ _id: { $in: user.courses } });
        let conflictDetected = false;
        const conflictCourses = [];

        for (let existingCourse of existingCourses) {
            const existingDays = existingCourse.Days.split("");
            const [startTime, endTime] = existingCourse.Time.split("-").map((time) => moment(time.trim(), "h:mm a"));

            const dayOverlap = existingDays.some((day) => newCourseDays.includes(day));
            const timeOverlap = dayOverlap && (
                newStartTime.isBetween(startTime, endTime, null, "[)") ||
                newEndTime.isBetween(startTime, endTime, null, "(]") ||
                (newStartTime.isSameOrBefore(startTime) && newEndTime.isSameOrAfter(endTime))
            );

            if (timeOverlap) {
                conflictDetected = true;
                conflictCourses.push(existingCourse);

                const alert = new AlertModel({
                    userId: user._id,
                    courseId: [existingCourse._id, course._id],
                    type: "Time Conflict",
                    date: new Date(),
                    isRead: false,
                });
                await alert.save();

                if (user.notifPreference === "email" || user.notifPreference === "both") {
                    await sendAlertEmail(user, alert);
                }
            }
        }

        user.courses.push(courseId);
        await user.save();

        const responseMessage = conflictDetected
            ? { status: "Course added with time conflicts", timeConflict: true, conflictCourses }
            : { status: "Course added", availSeats: remainingSeats };

        res.json(responseMessage);
    } catch (error) {
        console.error("Error in addUserCourse:", error);
        res.status(500).json({ status: "Error adding course" });
    }
};

export const optInForAvailabilityAlert = async (req, res) => {
    try {
        const { email, courseId } = req.body;

        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "User not found" });
        }

        // Check if courseId already exists in avail_ids
        if (!user.avail_ids.includes(courseId)) {
            // Add the courseId to avail_ids if it doesn’t exist
            user.avail_ids.push(courseId);
            await user.save();
        }

        res.json({ status: "Opted in for course availability alert" });
    } catch (error) {
        console.error("Error in optInForAvailabilityAlert:", error);
        res.status(500).json({ status: "Error opting in for availability alert" });
    }
};