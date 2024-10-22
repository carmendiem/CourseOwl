import express from "express";
import {getForumInfo, getUserName, createPost, getForumSearch} from "../controllers/forum.js";

const router = express.Router();

router.get("/getForum", getForumInfo);
router.get("/getUserName", getUserName);
router.post("/createPost", createPost);
router.get("/getForumSearch", getForumSearch);

export default router;