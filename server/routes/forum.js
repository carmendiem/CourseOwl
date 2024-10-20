import express from "express";
import {getForumInfo} from "../controllers/forum.js";

const router = express.Router();

router.get("/getForum", getForumInfo);

export default router;