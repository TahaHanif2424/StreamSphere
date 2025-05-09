const express=require("express");
const Video=require("../Model/Video");
const {PutObjectCommand,GetObjectCommand,DeleteObjectCommand}=require('@aws-sdk/client-s3');
const S3=require('../AWS/AWSConfig');
const router=express.Router();
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const crypto=require('crypto');
const bucketName=process.env.BUCKET_NAME;
const sharp=require('sharp');
const { getSignedUrl } =require ("@aws-sdk/s3-request-presigner");

//Get all Videos
//URL http://localhost:5000/video/get-all
// router.get("/get-all", async(req,res)=>{
//     try{
//         const videos= await Video.find().populate("user_id", "channelName");;
//         for(const video of videos){
//             if (!video.videoName) continue;
//             const getObjectParams=({
//                 Bucket:bucketName,
//                 Key:video.videoName
//             });

//             const command = new GetObjectCommand(getObjectParams);
//             const url = await getSignedUrl(S3, command, { expiresIn: 3600 });
//             video.URL=url;
//             await video.save();
//         }
//         res.status(200).send(videos);
//     }catch(err){
//         return res.status(400).send({error:"InValid Request"})
//     }
// });
router.get("/get-all", async (req, res) => {
    try {
        const videos = await Video.find().populate("user_id", "channelName channelImageURL");

        const signedVideos = await Promise.all(
            videos.map(async (video) => {
                if (!video.videoName) return video;

                const getObjectParams = {
                    Bucket: bucketName,
                    Key: video.videoName,
                };

                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(S3, command, { expiresIn: 3600 });

                return {
                    ...video.toObject(),
                    URL: url,
                    channelName: video.user_id?.channelName || "Default",
                    channelImageURL: video.user_id?.channelImageURL || "",
                  };
                  
            })
        );

        res.status(200).send(signedVideos);
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: "Invalid Request" });
    }
});



//Find all videos of USER
//URL http://localhost:5000/video/get

router.get("/get", async(req,res)=>{
    try{
        const user_id=req.body.user_id;
        const video= await Video.find({user_id});
        res.status(200).send({video});
    }catch(err){
        return res.status(400).send({error:"InValid Request"})
    }
});



//Add Video
//URL http://localhost:5000/video/add
router.post("/add", upload.single("image"), async (req, res) => {
    try {

      const videoData = JSON.parse(req.body.data);
  
        
    //   const buffer=await sharp(req.file.buffer).resize({height:1080,width:1920,fit:'contain'}).toBuffer();
      const randomName= (bytes=32)=>crypto.randomBytes(bytes).toString('hex');
      const videoName=randomName();
      const params = {
        Bucket: bucketName,
        Key: videoName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype, 
      };
  
      const command = new PutObjectCommand(params);
      await S3.send(command);

      const video = new Video(videoData);
      video.videoName=videoName;
      await video.save();

      res.status(200).send(video);

    } catch (err) {
      console.error(err);
      return res.status(400).send({ error: "Bad request", message: err.message });
    }
  });
  


//Delete Video
//URL http://localhost:5000/video/delete:id
router.delete("/delete/:id", async(req,res)=>{
    try{
    const video_id= req.params.id;
    const deleteVideo=await Video.findById(video_id);
    const params={
        Bucket: bucketName,
        Key:deleteVideo.videoName,
    };
    const command=new DeleteObjectCommand(params);
    await S3.send(command);
    await Video.deleteOne({_id:video_id});
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