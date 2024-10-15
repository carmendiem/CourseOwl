import express from "express";
import getProfessorByAlias from "../controllers/professor.js";
import { getReviewsByAlias, addReview, upvoteReview, removeUpvote, deleteReview } from "../controllers/review.js"; // Assuming controllers are properly set up for review handling

const router = express.Router();

router.get("/:alias", getProfessorByAlias);

router.get("/:alias/reviews", getReviewsByAlias);

router.post("/:alias/reviews", addReview);

router.post("/reviews/:reviewId/upvote", upvoteReview);
router.post('/reviews/:reviewId/remove-upvote', removeUpvote);

router.delete('/reviews/:reviewId', deleteReview);

export default router;
