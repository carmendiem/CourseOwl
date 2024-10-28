import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

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

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email, courses: user.courses, isVerified: user.isVerified, upvotedReviews: user.upvotedReviews};
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
            year_in_school: user.year_in_school
        };
 
 
        res.json({ user: req.session.user });
    } catch (error) {
        console.error('Error fetching user from DB:', error);
        res.status(500).json({ error: 'Error fetching user from the database' });
    }
 
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