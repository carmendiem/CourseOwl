import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Handle user signup
export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword, courses: [] });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle user login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email, courses: user.courses, year_in_school: user.year_in_school, major: user.major, isVerified: user.isVerified};
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle user logout
export const logoutUser = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
};

// Get the authenticated user
export const getUser = (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
        console.log(req.session.user )
    } else {
        res.status(401).json("Not authenticated");
    }
};

export const getFreshUserInfo = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json("Not authenticated");
        }
       
        const user = await UserModel.findById(req.session.user.id);
 
 
        if (!user) {
            return res.status(404).json("User not found");
        }
 
 
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            courses: user.courses,
            isVerified: user.isVerified,
            major: user.major,
            year_in_school: user.year_in_school
        };
 
 
        res.json({ user: req.session.user });
    } catch (error) {
        console.error('Error fetching user from DB:', error);
        res.status(500).json({ error: 'Error fetching user from the database' });
    }
 
};

// Handle updating user details (year in school, major)
export const updateUserDetails = async (req, res) => {
    const { year_in_school, major } = req.body;

    // Check if the user is authenticated
    if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        // Find the user by their ID from the session
        const user = await UserModel.findById(req.session.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's details
        user.year_in_school = year_in_school || user.year_in_school;
        user.major = major || user.major;

        // Save the updated user details
        const updatedUser = await user.save();

        // Update session data with updated user info
        req.session.user = {
            ...req.session.user,
            year_in_school: updatedUser.year_in_school,
            major: updatedUser.major
        };

        res.status(200).json({ message: "User details updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const smtpServer = "smtp.gmail.com";
const smtpPort = 587;
const emailSender = "courseowlapp@gmail.com";
const emailPassword = "uxqv ebab htkf vswi"

const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {
        user: emailSender,
        pass: emailPassword,
    },
});

// Handle sending verification email
// Handle sending verification email
export const sendVerificationEmail = async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const user = await UserModel.findById(userId);

        // Check if the user exists and has a Purdue email
        if (!user || !user.email.endsWith("@purdue.edu")) {
            return res.status(400).json({ message: "Only @purdue.edu email addresses can be verified" });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // Set the verificationToken on the user model and save the user to MongoDB
        user.verificationToken = verificationToken;
        
        // Use await to make sure it's saving properly to the database
        await user.save();

        // Send verification email
        const verificationLink = `http://localhost:3001/user/verify/${verificationToken}`;
        const message = `Please verify your email by clicking the following link: ${verificationLink}`;

        await transporter.sendMail({
            from: emailSender,
            to: user.email,
            subject: "CourseOwl Email Verification",
            text: message,
        });

        res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
        console.error("Error sending verification email:", error);
        res.status(500).json({ message: "Failed to send verification email" });
    }
};


// Handle verifying user from link
// Handle verifying user from link
export const verifyUser = async (req, res) => {
    const { token } = req.params; // Correctly extract the token
    console.log("Verification token:", token);  // For debugging
    const strippedToken = token.trim();
    console.log("after trim token:", strippedToken);

    try {
        const user = await UserModel.findOne({ verificationToken: strippedToken });
        console.log(user)

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Verify the user
        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token after verification
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Verification failed" });
    }
};






