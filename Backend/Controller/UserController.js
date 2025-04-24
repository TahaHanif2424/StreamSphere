const express=require("express");
const User =require("../Model/User");

const router=express.Router();


//Get All User 
//URL: https://localhost:5000/user/
router.get("/", (req, res) => {
    res.send({message:"Connected...."});
});

//Create User
//URL http://localhost:5000/user/create
router.post("/create", async (req, res) => {
    try {
        const user = new User(req.body);
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