import express from "express";
import {getUserForums, getForumInfo, getUserNameVerification, joinOrLeaveForum, createPost, getForumSearch, getPost, createComment, upvotePost, removeUpvote, getPostById, bookmarkPost, getSortedPosts, reportPost, deletePost, deleteComment} from "../controllers/forum.js";

const router = express.Router();

router.get("/getUserForum", getUserForums);
router.get("/getForum", getForumInfo);
router.get("/getUserNameVerification", getUserNameVerification);
router.post("/joinLeaveForum", joinOrLeaveForum);
router.post("/createPost", createPost);
router.post("/deletePost", deletePost);
router.post("/createComment", createComment);
router.post("/deleteComment", deleteComment);
router.get("/getForumSearch", getForumSearch);
router.get("/getPost", getPost);
router.get("/getPostById", getPostById);
router.post("/upvotePost", upvotePost);
router.post("/removeUpvote", removeUpvote);
router.post("/bookmarkPost", bookmarkPost);
router.get("/getSortedPosts", getSortedPosts)
router.post("/reportPost", reportPost)

export default router;