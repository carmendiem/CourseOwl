import express from "express";
import {getForumInfo, getUserName, createPost, getForumSearch, getPost} from "../controllers/forum.js";

const router = express.Router();

router.get("/getForum", getForumInfo);
router.get("/getUserName", getUserName);
router.post("/createPost", createPost);
router.get("/getForumSearch", getForumSearch);
router.get("/getPost", getPost);

export default router;