import express from "express";
import {getForumInfo, getUserNameVerification, createPost, getForumSearch, getPost, createComment} from "../controllers/forum.js";

const router = express.Router();

router.get("/getForum", getForumInfo);
router.get("/getUserNameVerification", getUserNameVerification);
router.post("/createPost", createPost);
router.post("/createComment", createComment);
router.get("/getForumSearch", getForumSearch);
router.get("/getPost", getPost);

export default router;