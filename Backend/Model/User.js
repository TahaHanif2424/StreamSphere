const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema= new Schema({
    "channelName":{
        type:String,
        required:true
    },
    "email":{
        type:String,
        required:true
    },
    "password":{
        type:String,
        required:true
    },
    "isVerified":{
        type:Boolean,
        default:false
    },
    "refreshToken": {
         type: String
     },
    "subscriber": {
         type: Number
     },
});
module.exports= mongoose.model('User', UserSchema);