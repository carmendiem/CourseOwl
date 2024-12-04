import connectMongo from "../connection.js"
import Forum from "../models/Forums.js";
import mongoose from 'mongoose';
import User from "../models/User.js";
import nodemailer from 'nodemailer';

mongoose.set('strictQuery', false);
connectMongo();

export const getUserForums = async (req, res) => {
    try{
        const {userId} = req.query;
        const user = await User.findById(userId)
        if (!user.savedForums) {
            user.savedForums = [];
            return res.status(404).json({status: 'Forums not found'});
        }
        else {
            return res.json(user.savedForums);
        }
    } catch (error) {
        console.log("Error in getUserForums:", error);
        res.status(400).json({ status: 'Error fetching forums' });
    }
}

export const getForumInfo = async (req, res) => {
    try {
        const { forumId } = req.query;
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

export const getUserNameVerification = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User.findById(userId);
        if (user != null) {
            const nameAndVer = {name: user.name, verStatus: user.isVerified}
            return res.json(nameAndVer);
        } else {
            return res.status(404).json({ status: 'user not found' });
        }
    } catch (error) {
        console.log("Error in getUserNameVerification:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}

export const joinOrLeaveForum = async (req, res) => {
    try {
        const { userId, forumId } = req.query;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.savedForums) {
            user.savedForums = [];
        }
        if (!user.savedForums.includes(forumId)) {
            user.savedForums.push(forumId); //join forum
        } else {
            // leave forum
            user.savedForums = user.savedForums.filter(id => id.toString() !== forumId);
        }
        await user.save();
        res.json(user);
        console.log("User saved forums:", user);

    } catch (error) {
        console.error('Error joining forum:', error);
        res.status(500).json({ message: 'Error joining forum' });
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, body, anon, chosenTag, userId, forumId } = req.query;
        const post = { title, body, anon, tag: chosenTag, author: userId, comments: [] };
        const forum = await Forum.findOneAndUpdate({ _id: forumId }, { $push: { posts: post } }, { new: true });
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

export const editPost = async (req, res) => {
    try {
        const { title, body, anon, chosenTag, forumId, postId } = req.query;
        const forum = await Forum.findOne({ _id: forumId });
        if (!forum) {
            return res.status(404).json({ status: 'forum not found' });
        }
        const post = forum.posts.id(postId);
        if (!post) {
            return res.status(404).json({ status: 'post not found' });
        }
        console.log("tag:", chosenTag);
        post.title = title;
        post.body = body;
        post.anon = anon;
        post.tag = chosenTag;
        post.edited = true;
        await forum.save();
        return res.json(post);
    } catch (error) {
        console.log("Error in editPost:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { postId, forumId } = req.query;
        const forum = await Forum.findOneAndUpdate({ _id: forumId }, { $pull: { posts: { _id: postId } } }, { new: true });
        
        
        if (!forum) {
            return res.status(404).json({ status: 'forum not found' });
        } else {
            const users = await User.find({ savedPosts: postId });
            for (const user of users) {
                user.savedPosts.pull(postId);
                await user.save();
            }
            return res.json(forum);
        }
    } catch (error) {
        console.log("Error in deletePost:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}

export const createComment = async (req, res) => {
    try {
        const { body, anon, userId, forumId, postId } = req.query;
        const comment = { body, anon, author: userId };
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).json({ status: 'forum not found' });
        }
        const post = forum.posts.id(postId);
        if (!post) {
            return res.status(404).json({ status: 'post not found' });
        }
        post.comments.push(comment);
        await forum.save();
        return res.json(forum);
    } catch (error) {
        console.log("Error in createComment:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}

export const editComment = async (req, res) => {
    try {
        const { body, anon, forumId, postId, commentIdx } = req.query;
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).json({ status: 'forum not found' });
        }
        const post = forum.posts.id(postId);
        if (!post) {
            return res.status(404).json({ status: 'post not found' });
        }
        const comment = post.comments[commentIdx];
        comment.body = body;
        comment.anon = anon;
        comment.edited = true;
        post.comments.set(commentIdx, comment);
        await forum.save();
        return res.json(post);
    } catch (error) {
        console.log("Error in editComment:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { commentIdx, postId, forumId } = req.query;
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).json({ status: 'forum not found' });
        }
        const post = forum.posts.id(postId);
        if (!post) {
            return res.status(404).json({ status: 'post not found' });
        }
        post.comments.splice(commentIdx, 1);
        await forum.save();
        return res.json(post);
    } catch (error) {
        console.log("Error in deleteComment:", error);
        res.status(400).json({ status: 'Error fetching forum' });
    }
}

export const getPost = async (req, res) => {
    try {
        const { searchTerm, forumId, tag } = req.query;
        const forum = await Forum.findOne({ _id: forumId });

        if (!forum) {
            throw new Error('Forum not found');
        }

        const matchingPosts = forum.posts.filter(post => {
            const titleMatches = post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase());
            const tagMatches = tag !== "null" ? post.tag === tag : true;
            return titleMatches && tagMatches;
        });

        return res.json(matchingPosts);
    } catch (error) {
        console.log("Error in getPost: ", error);
        res.status(400).json({ status: 'Error getting post' });
    }
}

export const getPostById = async (req, res) => {
    try {
        const { forumId, postId } = req.query;
        console.log("forumId:", forumId, "postId:", postId);
        const forum = await Forum.findOne(
            { _id: forumId, "posts._id": postId },
            { "posts.$": 1 } 
        );

        if (forum && forum.posts.length > 0) {
            return res.json(forum.posts[0]); 
        } 

        return res.status(404).json({ status: 'Post not found' });
        
    } catch (error) {
        console.log("Error in getPostById: ", error);
        res.status(400).json({ status: 'Error getting post by id' });
    }
}

export const getForumSearch = async (req, res) => {
    try {
        const { searchTerm } = req.query;
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
        res.status(400).json({ status: 'Error searching for forum' })
    }
}

export const upvotePost = async (req, res) => {
    const { userId, postId, forumId } = req.body;

    try {
        const forum = await Forum.findOne(
            { _id: forumId, "posts._id": postId },
            { posts: { $elemMatch: { _id: postId } } }
        );
        const post = forum ? forum.posts[0] : null;
        const user = await User.findById(userId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log(userId, postId, forumId)
        if (!user.upvotedPosts) {
            user.upvotedPosts = [];
        }

        if (!user.upvotedPosts.includes(postId)) {
            post.upvotes += 1;
            user.upvotedPosts.push(postId);

        } else {
            return res.status(400).json({ message: 'Post already upvoted' });
        }

        await forum.save();
        await user.save();

        req.session.user = user;
        res.json({ post, user });
    } catch (error) {
        console.error('Error upvoting post:', error);
        res.status(500).json({ message: 'Error upvoting post' });
    }
};

export const removeUpvote = async (req, res) => {
    const { userId, postId, forumId } = req.body;

    try {
        const forum = await Forum.findOne(
            { _id: forumId, "posts._id": postId },
            { posts: { $elemMatch: { _id: postId } } }
        );
        const post = forum ? forum.posts[0] : null;
        const user = await User.findById(userId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (!user.upvotedPosts) {
            user.upvotedPosts = [];
        }
        if (user.upvotedPosts.includes(postId)) {
            post.upvotes -= 1;
            user.upvotedPosts = user.upvotedPosts.filter(id => id.toString() !== postId);

        } else {
            return res.status(400).json({ message: 'Post not upvoted yet' });
        }

        await forum.save();
        await user.save();

        res.json({ post, user });
    } catch (error) {
        console.error('Error removing upvote:', error);
        res.status(500).json({ message: 'Error removing upvote' });
    }
};

export const bookmarkPost = async (req, res) => {
    const { userId, postId, forumId } = req.body;

    try {
        const forum = await Forum.findOne(
            { _id: forumId, "posts._id": postId },
            { posts: { $elemMatch: { _id: postId } } }
        );
        const post = forum ? forum.posts[0] : null;
        const user = await User.findById(userId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.savedPosts) {
            user.savedPosts = [];
        }
        if (!user.savedPosts.includes(postId)) {
            user.savedPosts.push(postId);
        } else {
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
        }
        await user.save();
        res.json(user);

    } catch (error) {
        console.error('Error bookmarking post:', error);
        res.status(500).json({ message: 'Error bookmarking post' });
    }
};

export const getSortedPosts = async (req, res) => {
    const { type, forumId, savedPosts, searchTerm } = req.query;

    try {
        const forum = await Forum.findOne(
            { _id: forumId },
            { posts: 1 } 
        );

        if (!forum) {
            return res.status(404).json({ message: "Forum not found" });
        }

        let sortedPosts; 

        if (type === "likes") {
            sortedPosts = forum.posts
                .slice() 
                .sort((a, b) => b.upvotes - a.upvotes); 
        }
        else if (type === "saved") {
            sortedPosts = forum.posts.filter(post => {
                return savedPosts.indexOf(post._id.toString()) !== -1; 
            });
        }
        else if (type === "replies") {
            sortedPosts = forum.posts
                .slice() 
                .sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)); 
        }
        else if (type === "recent") {
            sortedPosts = forum.posts
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        else if (type === "none") {
            sortedPosts = forum.posts
        }

        if (searchTerm && searchTerm.trim() !== "") {
            const searchTermRegex = new RegExp(searchTerm, 'i'); 
            sortedPosts = sortedPosts.filter(post => searchTermRegex.test(post.title)); 
        }

        res.json(sortedPosts);
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ message: 'Error getting posts' });
    }
};

const smtpServer = "smtp.gmail.com";
const smtpPort = 587;
const emailSender = "courseowlapp@gmail.com";
const emailPassword = "nhgl juyg pacg jjpq"

const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {
        user: emailSender,
        pass: emailPassword,
    },
});

export const reportPost = async (req, res) => {
    const { postName, forumId, reportMessage, user } = req.body;

    try {
        const forum = await Forum.findOne({ _id: forumId });
        console.log(forum)
        const message = `Post '${postName}' was reported in forum ${forum.course_code} by user ${user.email}.\nReason for reporting: ${reportMessage}`;

        await transporter.sendMail({
            from: emailSender,
            to: "courseowlapp@gmail.com",
            subject: "User Report Alert",
            text: message,
        });
        res.status(200).json({ message: "Report sent" });
    } catch (error) {
        console.error('Error reporting post:', error);
        res.status(500).json({ message: 'Error reporting post' });
    }
};