const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    "comment_id": {
        type: mongoose.Types.ObjectId,
        required: true
    },
    "video_id": {
        type: mongoose.Types.ObjectId,
        required: true
    },
    "comment": {
        type: String,
    },
    "user_id": {
        type: mongoose.Types.ObjectId,
        required: true
    },
    "date": {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('Rating', CommentsSchema);