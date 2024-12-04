import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        
        // Hash the password and create the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword, courses: [] });
        const savedUser = await newUser.save();

        // Send a welcome email to the user
        const message = `Hello ${name},\n\nWelcome to CourseOwl! Your account has been successfully created.\n\nBest,\nCourseOwl Team`;
        await transporter.sendMail({
            from: emailSender,
            to: email,
            subject: "Welcome to CourseOwl",
            text: message,
        });

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email, courses: user.courses, isVerified: user.isVerified, upvotedReviews: user.upvotedReviews, year_in_school: user.year_in_school, major: user.major, enrollment_status: user.enrollment_status};
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

export const getUser = (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
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
            year_in_school: user.year_in_school,
            notifPreference: user.notifPreference,
            savedForums: user.savedForums,
            enrollment_status: user.enrollment_status,
            upvotedPosts: user.upvotedPosts,
            savedPosts: user.savedPosts,
            wishlist: user.wishlist
        };
 
        res.json({ user: req.session.user });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user from the database' });
    }
 
};

// Utility function to send account update notification email
const sendAccountUpdateEmail = async (user, updatedFields) => {
    const changes = updatedFields.map(field => `- ${field}`).join("\n");
    const message = `Hello ${user.name},\n\nThe following changes were made to your account:\n\n${changes}\n\nIf you did not make these changes, please contact support immediately.\n\nBest,\nCourseOwl Team`;

    await transporter.sendMail({
        from: emailSender,
        to: user.email,
        subject: "CourseOwl Account Update Notification",
        text: message,
    });
};

// Handle updating user details (year in school, major)
export const updateUserDetails = async (req, res) => {
    const { year_in_school, major, name, email, notifPreference, enrollment_status } = req.body;

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

        // Debugging logs
        console.log("Received notifPreference:", notifPreference);
        console.log("Current user notifPreference:", user.notifPreference);

        // Update fields only if they have changed
        const updatedFields = [];

        if (name && name !== user.name) {
            user.name = name;
            updatedFields.push("Name");
        }
        if (email && email !== user.email) {
            user.email = email;
            user.isVerified = false; // Reset verification status if email changes
            updatedFields.push("Email");
        }
        if (year_in_school && year_in_school !== user.year_in_school) {
            user.year_in_school = year_in_school;
            updatedFields.push("Year in School");
        }
        if (major && major !== user.major) {
            user.major = major;
            updatedFields.push("Major");
        }

        if (enrollment_status && enrollment_status != user.enrollment_status) {
            user.enrollment_status = enrollment_status;
            updatedFields.push("Enrollment Status");
        }

        user.notifPreference = notifPreference || user.notifPreference;

        // Save updated user details
        const updatedUser = await user.save();

        // Update session data with updated user info
        req.session.user = {
            ...req.session.user,
            name: updatedUser.name,
            email: updatedUser.email,
            year_in_school: updatedUser.year_in_school,
            major: updatedUser.major,
            isVerified: updatedUser.isVerified,
            enrollment_status: updatedUser.enrollment_status,
            notifPreference: updatedUser.notifPreference
        };

        if (updatedFields.length > 0) {
            await sendAccountUpdateEmail(updatedUser, updatedFields);
        }

        res.status(200).json({ message: "User details updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error in updateUserDetails:", error); // Add this line to catch errors
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

export const sendTestEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const message = `Hello ${user.name},\n\nThis is a test email to confirm that your email alerts have been set up correctly.\n\nBest,\nCourseOwl Team`;

        await transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: "CourseOwl Email Alert Test",
            text: message,
        });

        res.status(200).json({ message: "Test email sent successfully" });
    } catch (error) {
        console.error("Error sending test email:", error);
        res.status(500).json({ message: "Failed to send test email" });
    }
};

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
        const verificationLink = `http://localhost:3000/user/verify/${verificationToken}`;
        const message = `Please verify your email by clicking the following link: ${verificationLink}`;

        await transporter.sendMail({
            from: emailSender,
            to: user.email,
            subject: "CourseOwl Email Verification",
            text: message,
        });

        res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send verification email" });
    }
};


// Handle verifying user from link
// Handle verifying user from link
export const verifyUser = async (req, res) => {
    const { token } = req.params; // Correctly extract the token
    const strippedToken = token.trim();

    try {
        const user = await UserModel.findOne({ verificationToken: strippedToken });

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

// Handle forgot password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    await user.save();
    const resetLink = `http://localhost:3000/user/reset-password/${resetToken}`;
    const message = `To reset your password, please click here: ${resetLink}`;

    await transporter.sendMail({
        from: emailSender,
        to: user.email,
        subject: "Password Reset Request",
        text: message,
    });

    res.json({ message: "Password reset email sent" });
};

// Handle resetting the password
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await UserModel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    // Send email notification for password change
    const message = `Hello ${user.name},\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact support immediately.\n\nBest,\nCourseOwl Team`;
    await transporter.sendMail({
        from: emailSender,
        to: user.email,
        subject: "Password Change Confirmation",
        text: message,
    });

    res.status(200).json({ message: "Password has been reset successfully" });
};

export const getUserFromDB = async (req, res) => {
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
            upvotedReviews: user.upvotedReviews,
            notifPreference: user.notifPreference
        };

        res.json({ user: req.session.user });
    } catch (error) {
        console.error('Error fetching user from DB:', error);
        res.status(500).json({ error: 'Error fetching user from the database' });
    }
};

