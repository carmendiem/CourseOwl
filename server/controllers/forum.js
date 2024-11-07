import connectMongo from "../connection.js"
import Forum from "../models/Forums.js";
import mongoose from 'mongoose';
import User from "../models/User.js";

mongoose.set('strictQuery', false);
connectMongo();

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

export const getUserName = async (req, res) => {
    try {
        const { userId } = req.query;
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

export const getPost = async (req, res) => {
    try {
        console.log("recieved?")
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
        console.log(userId, postId, forumId)
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

        req.session.user = user;
        res.json({ post, user });
    } catch (error) {
        console.error('Error removing upvote:', error);
        res.status(500).json({ message: 'Error removing upvote' });
    }
};