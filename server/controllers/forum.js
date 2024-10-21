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