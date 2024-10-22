import connectMongo from "../connection.js"
import Forum from "../models/Forums.js";
import mongoose from 'mongoose';
import User from "../models/User.js";

mongoose.set('strictQuery', false);
connectMongo();

export const getForumInfo = async (req, res) => {
    try {
        const {forumId} = req.query;
        const forum = await Forum.findById(forumId);
        if (forum != null) {
            return res.json(forum);
        } else {
            return res.status(404).json({ status: 'Forum not found' });
        }
    } catch (error) {
        console.log("Error in getForumInfo:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}

export const getUserName = async (req, res) => {
    try {
        const {userId} = req.query;
        const user = await User.findById(userId);
        if (user != null) {
            return res.json(user.name);
        } else {
            return res.status(404).json({ status: 'user not found' });
        }
    } catch (error) {
        console.log("Error in getUserName:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, body, anon, chosenTag, userId, forumId} = req.query;
        const post = {title, body, anon, tag: chosenTag, author: userId, comments: []};
        const forum = await Forum.findOneAndUpdate({_id: forumId}, {$push: {posts: post}}, {new: true});
        if (forum != null) {
            return res.json(forum);
        } else {
            return res.status(404).json({ status: 'forum not found' });
        }
    } catch (error) {
        console.log("Error in createPost:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}