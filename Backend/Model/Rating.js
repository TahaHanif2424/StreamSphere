const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    "rating_id": {
        type: mongoose.Types.ObjectId,
        required: true
    },
    "video_id": {
        type: mongoose.Types.ObjectId,
        required: true
    },
    "user_id": {
        type: mongoose.Types.ObjectId,
        required: true
    },
    "count": {
        type: Number,
    },
});
module.exports = mongoose.model('Rating', RatingSchema);