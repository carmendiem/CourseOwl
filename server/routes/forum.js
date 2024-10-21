import express from "express";
import {getForumInfo, getForumSearch} from "../controllers/forum.js";

const router = express.Router();

router.get("/getForum", getForumInfo);
router.get("/getForumSearch", getForumSearch);

export default router;