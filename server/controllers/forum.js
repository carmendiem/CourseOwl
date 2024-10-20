import connectMongo from "../connection.js"
import Forum from "../models/Forums.js";
import mongoose from 'mongoose';

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