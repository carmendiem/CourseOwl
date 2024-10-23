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
        const {email} = req.query;
        const user = await User.findOne({email: email});
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
        const { title, body, anon, chosenTag, userEmail, forumId} = req.query;
        const post = {title, body, anon, tag: chosenTag, author: userEmail, comments:[]};
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

export const getPost = async (req, res) => {
    try {
        const { searchTerm, forumId } = req.query;
        const forum = await Forum.findOne({ _id: forumId });

        if (!forum) {
            throw new Error('Forum not found');
        }

        const matchingPosts = forum.posts.filter(post =>
            post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return res.json(matchingPosts);
    } catch (error) {
        console.log("Error in getPost: ", error);
        res.status(400).json({ status: 'Error getting post' });
    }
}

export const getForumSearch = async (req, res) => {
    try {
        const {searchTerm} = req.query;
        const forums = await Forum.find({
            $or: [
                { course_code: { $regex: new RegExp(`^${searchTerm}`, 'i') } },
                //{ course_name: { $regex: new RegExp(`^${searchTerm}`, 'i') } },
                { name: { $regex: new RegExp(searchTerm, 'i') } } //professor name
            ],
        }).limit(250)
        if (!forums || forums.length === 0) {
            return res.status(404).json({ status: 'Forum not found' });
        }
        return res.json(forums);
    } catch (error) {
        console.log("Error in getForum: ", error)
        res.status(400).json({status: 'Error searching for forum'})
    }
}