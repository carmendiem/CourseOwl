import express from "express";
import getProfessorByAlias from "../controllers/professor.js";
const router = express.Router();
router.get("/:alias", getProfessorByAlias);  // Get professor by alias
export default router;
