const express=require("express");
const bcrypt=require("bcrypt"); 
const User =require("../Model/User");
const {GenerateAccessToken,GenerateRefreshToken}=require("../Auth/GenerateToken");
const router=express.Router();

//Get All User 
//URL: https://localhost:5000/user/
router.get("/" ,(req, res) => {
    res.send({message:"Connected...."});
});

// User Signup
//URL http://localhost:5000/user/signup
router.post("/signup", async (req, res) => {
    try {
        const salt= await bcrypt.genSalt();
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        const user = new User(req.body);
        user.password=hashedPassword;
        console.log(user);
        await user.save();
        res.status(201).send({ message: "User created successfully" });
    } catch (err) {
        console.error("Error saving user:", err);
        if (err.name === "ValidationError") {
            return res.status(400).send({ error: err.message });
        }
        res.status(500).send({ error: "Failed to create user" });
    }
});


//User Login
//URL  http://localhost:5000/user/login

router.post("/login", async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
        res.status(400).send({ error: "Invalid Username and Password" });
        }
    
        const login=await bcrypt.compare(password,user.password);
        if(login){

            const accessToken=GenerateAccessToken(email);
            const refreshToken=GenerateRefreshToken(email);
            user.refreshToken = refreshToken;
            await user.save();
            res.cookie('jwt',refreshToken,{httpOnly:true,maxAge:24*60*60*1000, sameSite:'none'});
            
           return res.status(201).send({ message: "Logged in successfully", accessToken,refreshToken });
        }else{
        res.status(400).send({ error: "Invalid Username and Password" });
        }
    }catch(err){
        res.status(500).send({ error: "Login Failed",err:err });
        
    }
})



//Forgot Password
//URL http://localhost:5000/user/update
router.put("/update", async (req,res)=>{
    try {
        const {email, NewPassword, ConfirmPassword}=req.body;
        if(!email || !NewPassword || !ConfirmPassword){
            console.log("Error while updating password....");
            res.status(500).send({ error: "Failed to update user" });
        }
        else if(NewPassword!=ConfirmPassword){
            console.log("New password does not match")
            res.status(500).send({ error: "New Password Does not match" });
        }
        else{
            const user= await User.findOneAndUpdate({
                email:email,
                password:NewPassword,
            });
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
    
            res.status(200).send({ message: "Password updated successfully" });
        }

    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).send({ error: "Failed to Update Password....." });
    }
})

module.exports=router;