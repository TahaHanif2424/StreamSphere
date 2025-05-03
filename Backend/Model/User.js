const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema= new Schema({
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
    refreshToken: {
         type: String
     }
});
module.exports= mongoose.model('User', UserSchema);