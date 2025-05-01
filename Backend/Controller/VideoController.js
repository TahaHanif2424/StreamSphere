const express=require("express");
const Video=require("../Model/Video");
const verifyJWT=require('../Middleware/verifyJWT');

const router=express.Router();


//Get all Videos
//URL http://localhost:5000/video/get-all
router.get("/get-all",verifyJWT, async(req,res)=>{
    try{
        const video= await Video.find();
        res.status(200).send({video});
    }catch(err){
        return res.status(400).send({error:"InValid Request"})
    }
});

//Add Video
//URL http://localhost:5000/video/add
router.post("/add", async(req,res)=>{
    try{
    const video= new Video(req.body);
    await video.save();
    res.status(200).send(video);
    }catch(err){
        return res.status(400).send({error:"Bad request"});
    }
});


//Delete Video
//URL http://localhost:5000/video/delete:id
router.delete("/delete/:id", async(req,res)=>{
    try{
    const video_id= req.params.id;
    const deleteVideo=await Video.findByIdAndDelete(video_id);
    if(deleteVideo){
        return res.status(200).send({message:"Video deleted successfully"});
    }
    else{
        return res.status(500).send({message:"Error while deleting video"});
    }
    }catch(err){
        return res.status(400).send({error:"Bad request"});
    }
});


//Update Video
//URL http://localhost:5000/video/update:id
router.put("/update/:id", async(req,res)=>{
    try{
    const video_id= req.params.id;
    const updatedparameter=req.body;
    const updatedVideo=await Video.findByIdAndUpdate(
        video_id,
        updatedparameter,
        {new:true,runValidators:true}
    );
    if(updatedVideo){
        return res.status(200).send({message:"Video updated successfully" ,
            data: updatedVideo});
    }
    else{
        return res.status(500).send({message:"Error while updating video"});
    }
    }catch(err){
        return res.status(400).send({error:"Bad request"});
    }
});

module.exports = router;