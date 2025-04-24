const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const LikeSchema= new Schema({
    "like_id":{
        type:mongoose.Types.ObjectId,
        required:true
    },
    "video_id":{
        type:mongoose.Types.ObjectId,
        required:true
    },
    "user_id":{
        type:mongoose.Types.ObjectId,
        required:true
    },
    "date":{
        type:Date,
        default:Date.now
    },
});
module.exports= mongoose.model('Rating', LikeSchema);