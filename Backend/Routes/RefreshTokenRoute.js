const express=require("express");
const router=express.Router();
const RefreshToken=require("../Auth/RefreshTokenFunction");


//Refresh Access Token
// URL https://localhost:5000/refresh
router.get("/",RefreshToken);


module.exports=router;