const express = require("express");
const Comment = require("../Model/Comments");

const router = express.Router();


//Like Video
// http://localhost:5000/comment/id
router.post("/:id", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const comment=req.body.comment;
        if(!comment)
            return res.status(400).send({ message: "Please add a comment" });
        const video_id = req.params.id;
        if(!video_id){
            return res.status(400).send({ message: "Invalid Video" });
        }
        const comments=new Comment({user_id,video_id,comment});
        await comments.save();
        return res.status(200).send({ message: "Comment added successfully" });
    } catch (err) {
        return res.status(500).send({ error: "Error while adding the comment" });
    }
});


//UN-Like Video
// http://localhost:5000/comment/delete/id
router.delete("/delete/:id", async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.body.user_id;
        const comment = await Comment.findOne({ _id: commentId, user_id: userId });
        if (!comment) {
            return res.status(404).send({ error: "Comment not found or not authorized" });
        }
        await Comment.deleteOne({ _id: commentId });
        return res.status(200).send({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Error while deleting comment" });
    }
});

module.exports=router;