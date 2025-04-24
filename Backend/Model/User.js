const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema= new Schema({
    "email":{
        type:String,
        require:true
    },
    "password":{
        type:String,
        require:true
    },
    "isVerified":{
        type:Boolean,
        default:false
    },
});
module.exports= mongoose.model('User', UserSchema);