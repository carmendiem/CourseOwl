import Review from '../models/Review.js';
import Professor from '../models/Professor.js';
import User from '../models/User.js';

export const getReviewsByAlias = async (req, res) => {
    const alias = req.params.alias;
    try {
        const reviews = await Review.find({ professorAlias: alias });
        
        if (!reviews || reviews.length === 0) {
            return res.status(200).json([]); 
        }
        
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};


export const addReview = async (req, res) => {
    const alias = req.params.alias;    

    const { userName, content, isVerified } = req.body;
    try {
        const professor = await Professor.findOne({ ALIAS: alias });
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        const newReview = new Review({
            professorAlias: alias,
            userName,
            content,
            date: new Date(),
            isVerified: isVerified,
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error posting review:', error);
        res.status(500).json({ message: 'Error posting review' });
    }
};

export const upvoteReview = async (req, res) => {
    const { reviewId } = req.params;
    const { user } = req.body;
    const userId = user.id; 
  
    try {
      const review = await Review.findById(reviewId);
      const user = await User.findById(userId);
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      if (!user.upvotedReviews) {
        user.upvotedReviews = [];
      }
  
      if (!user.upvotedReviews.includes(reviewId)) {
        review.upvotes += 1;
        user.upvotedReviews.push(reviewId);
        
      } else {
        return res.status(400).json({ message: 'Review already upvoted' });
      }
  
      await review.save();
      await user.save();
  
      res.json({ review, upvotedReviews: user.upvotedReviews });
    } catch (error) {
      console.error('Error upvoting review:', error);
      res.status(500).json({ message: 'Error upvoting review' });
    }
  };
  
  export const removeUpvote = async (req, res) => {
    const { reviewId } = req.params;
    const { user } = req.body;
    const userId = user.id;
  
    try {
      const review = await Review.findById(reviewId);
      const user = await User.findById(userId);
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      if (!user.upvotedReviews) {
        user.upvotedReviews = [];
      }
  
      if (user.upvotedReviews.includes(reviewId)) {
        review.upvotes -= 1;
        user.upvotedReviews = user.upvotedReviews.filter(id => id.toString() !== reviewId);
        
      } else {
        return res.status(400).json({ message: 'Review not upvoted yet' });
      }
  
      await review.save();
      await user.save();
  
      res.json({ review, upvotedReviews: user.upvotedReviews });
    } catch (error) {
      console.error('Error removing upvote:', error);
      res.status(500).json({ message: 'Error removing upvote' });
    }
  };
  
  

export const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await Review.findByIdAndDelete(reviewId);
    await User.updateMany(
        { upvotedReviews: reviewId },
        { $pull: { upvotedReviews: reviewId } }
      );
    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ message: 'Error deleting review' });
  }
};

