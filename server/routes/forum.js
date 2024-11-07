import express from "express";
import {getForumInfo, getUserName, createPost, getForumSearch, getPost, createComment, upvotePost, removeUpvote, getPostById} from "../controllers/forum.js";

const router = express.Router();

router.get("/getForum", getForumInfo);
router.get("/getUserName", getUserName);
router.post("/createPost", createPost);
router.post("/createComment", createComment);
router.get("/getForumSearch", getForumSearch);
router.get("/getPost", getPost);
router.get("/getPostById", getPostById);
router.post("/upvotePost", upvotePost);
router.post("/removeUpvote", removeUpvote);

export default router;