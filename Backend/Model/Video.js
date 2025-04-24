const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const VideoSchema=new Schema({
    URL:{
        type:String,
        required:true
    },
    video_id:{
        type: Types.ObjectId,
        required:true
    },
    user_id:{
        type:Types.ObjectId,
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
    },
    Comments:{
        type:Number,
    },
    Views:{
        type:Number,
    },
    Category:{
        type:String,
        required:true
    },
});
module.exports=mongoose.model('Video', VideoSchema);