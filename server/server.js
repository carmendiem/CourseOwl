// // server.js
// import express from "express";
// import cors from "cors";
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import "dotenv/config";
// import userRoutes from "./routes/user.js";
// import courses from "./routes/course.js";
// import calendarRoutes from "./routes/calendar.js";
// import professorRoutes from './routes/professor.js';
// import forumRoutes from './routes/forum.js';
// import alertRoutes from './routes/alert.js';
// import courseRoutes from './routes/courseRoutes.js';

// import { exec } from "child_process";


// const PORT = process.env.PORT || 3001;
// const app = express();

// // Middleware
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));
// app.use(express.json());

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGO_URI,
//     }),
//     cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
// }));

// // Routes
// app.use("/user", userRoutes);
// app.use("/course", courses);
// app.use("/calendar", calendarRoutes);
// app.use("/professor", professorRoutes);
// app.use("/forum", forumRoutes);
// app.use("/api/alerts", alertRoutes); // Added alerts route
// app.use('/course', courseRoutes);

// // Function to run course_availability.py
// const runCourseAvailabilityScript = () => {
//     exec("python3 course_availability.py", (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error executing course_availability.py: ${error}`);
//             return;
//         }
//         console.log(`Course availability updated:\n${stdout}`);
//         if (stderr) console.error(`Error output:\n${stderr}`);
//     });
// };

// // Run the script initially when the server starts
// runCourseAvailabilityScript();

// // Set an interval to run the script every 5 minutes (300,000 ms)
// setInterval(runCourseAvailabilityScript, 300000); // 300,000 ms = 5 minutes

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });

// server.js
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";
import userRoutes from "./routes/user.js";
import courses from "./routes/course.js";
import calendarRoutes from "./routes/calendar.js";
import professorRoutes from './routes/professor.js';
import forumRoutes from './routes/forum.js';
import alertRoutes from './routes/alert.js';
import courseRoutes from './routes/courseRoutes.js';
import { exec } from "child_process";

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Routes
app.use("/user", userRoutes);
app.use("/course", courses);
app.use("/calendar", calendarRoutes);
app.use("/professor", professorRoutes);
app.use("/forum", forumRoutes);
app.use("/api/alerts", alertRoutes); // Added alerts route
app.use('/course', courseRoutes);

// Function to run course_availability.py
// Function to run course_availability.py
const runCourseAvailabilityScript = () => {
    exec("python3 course_availability.py", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing course_availability.py: ${error.message}`);
            console.error(`Make sure that all required Python modules are installed, e.g., try running 'pip install selenium pymongo beautifulsoup4 webdriver-manager'.`);
            return;
        }
        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
        }
        if (stdout) {
            console.log(`Course availability updated successfully:\n${stdout}`);
        }
    });
};

// Run the script initially when the server starts
runCourseAvailabilityScript();

// Set an interval to run the script every 5 minutes (300,000 ms)
setInterval(runCourseAvailabilityScript, 60000); // 300,000 ms = 5 minutes

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
