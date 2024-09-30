// server.js
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";
import userRoutes from "./routes/user.js";
import courses from "./routes/course.js";
import calendarRoutes from "./routes/calendar.js";

import courseRoutes from './routes/courseRoutes.js';

const PORT = process.env.PORT || 5001;
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3001',
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
app.use("/user", userRoutes); // Use the user routes
app.use("/course", courses);
app.use("/calendar", calendarRoutes);


app.use('/api/course', courseRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});