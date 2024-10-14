import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    reviewId: Schema.ObjectId,  
    professorAlias: {
        type: String,   
        required: true  
    },
    userName: {
        type: String,   
        required: true,
    },
    content: {
        type: String,   
        required: true  
    },
    upvotes: {
        type: Number,   
        default: 0    
    },
    date: {
        type: Date, 
        default: Date.now  
    },
    isVerified: {
        type: Boolean,  
        default: false  
    }
}, { collection: 'reviews' });  

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;