import express from "express";
import {getForumInfo, getUserName, createPost} from "../controllers/forum.js";

const router = express.Router();

router.get("/getForum", getForumInfo);
router.get("/getUserName", getUserName);
router.post("/creatPost", createPost);

export default router;