import express from "express";
import {getForumInfo, getUserNameVerification, createPost, getForumSearch, getPost, createComment, upvotePost, removeUpvote, getPostById, bookmarkPost, getSortedPosts, reportPost} from "../controllers/forum.js";

const router = express.Router();

router.get("/getForum", getForumInfo);
router.get("/getUserNameVerification", getUserNameVerification);
router.post("/createPost", createPost);
router.post("/createComment", createComment);
router.get("/getForumSearch", getForumSearch);
router.get("/getPost", getPost);
router.get("/getPostById", getPostById);
router.post("/upvotePost", upvotePost);
router.post("/removeUpvote", removeUpvote);
router.post("/bookmarkPost", bookmarkPost);
router.get("/getSortedPosts", getSortedPosts)
router.post("/reportPost", reportPost)

export default router;