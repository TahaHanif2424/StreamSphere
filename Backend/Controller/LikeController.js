const express = require("express");
const Likes = require("../Model/Likes");

const router = express.Router();


//Like Video
// http://localhost:5000/like/id
router.post("/:id", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const video_id = req.params.id;
        const like=new Likes({user_id,video_id});
        await like.save();
        return res.status(200).send({ message: "Video Liked successfully" })
    } catch (err) {
        return res.status(500).send({ error: "Error while Liking the video" });
    }
});


//UN-Like Video
// http://localhost:5000/like/unlike/id
router.delete("/unlike/:id", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const video_id = req.params.id;
        const like=await Likes.findOneAndDelete({user_id, video_id});
        return res.status(200).send({ message: "Video UnLiked successfully" })
    } catch (err) {
        return res.status(500).send({ error: "Error while unlvideoiking the " });
    }
});

module.exports=router;