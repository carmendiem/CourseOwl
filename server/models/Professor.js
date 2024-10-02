
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const professorSchema = new Schema({
    NAME: {
        type: String,
        required: true
    },
    ALIAS: {
        type: String,
        required: true,
        unique: true
    },
    EMAIL: {
        type: String
    },
    href: {
        type: String
    },
    negative_percentage: {
        type: Number,
        default: 0
    },
    positive_percentage: {
        type: Number,
        default: 0
    },
    rating: {
        type: String
    },
    tags: {
        type: Object,
        default: {}
    },
    total_reviews: {
        type: Number,
        default: 0
    }
}, {
    collection: 'professors5',
    strict: false   // Allow additional, arbitrary fields in the document
});
const Professor = mongoose.models.Professor || mongoose.model('Professor', professorSchema);
export default Professor;
