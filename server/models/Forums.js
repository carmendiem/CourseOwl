import mongoose from 'mongoose';
import { ObjectId} from "bson";
const Schema = mongoose.Schema;

const forumSchema = new Schema({
    courseId:Schema.ObjectId,
    course_name: {
        type: String
    },
    course_code: {
        type: String
    },
    instructor: {
        type: String
    },
    tags: {
        type: [String]
    },
    posts: [{
        title: {
            type: String
        },
        body: {
            type: String
        },
        tag: {
            type: String
        },
        author: {
            type: ObjectId
        },
        anon: {
            type: Boolean
        },
        comments: [{
            author: {
                type: ObjectId
            },
            body: {
                type: String
            },
        }],
    }],
    
}, { collection: 'forum_test' });

const Forum = mongoose.models.Forum || mongoose.model('Forum', forumSchema);
export default Forum;