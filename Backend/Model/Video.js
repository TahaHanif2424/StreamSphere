const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const VideoSchema=new Schema({
    URL:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }, 
    thumbnailURL:{
        type:String,
    },
    likes:{
        type:Number,
        default:0
    },
    comments:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required:true
    },
});
module.exports=mongoose.model('Video', VideoSchema);