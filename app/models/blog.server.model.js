const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    blogUser: { type: String, required: true },
    blogTitle: { type: String, required: true },
    blogContent: { type: String, required: true },
    blogCreated: {
        type: Date,
        default: Date.now
    },
    blogComments: [{
        commentUser: { type: String, required: true },
        commentTitle: { type: String, required: true },
        commentContent: { type: String, required: true },
        commentCreated: {
            type: Date,
            default: Date.now
        }
    }]
})

mongoose.model("Blog", BlogSchema);