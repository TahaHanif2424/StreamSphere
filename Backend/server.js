const express = require("express");
const connect = require("./DataBase/DataBaseConnection");
const userRouter=require("./Controller/UserController");
const videoRouter=require("./Controller/VideoController");
const playlistRouter=require("./Controller/PlaylistController");
const SubscribedRouter=require("./Controller/SubscribeController");
const LikedRouter=require("./Controller/LikeController");
const CommentRouter=require("./Controller/CommentController");

const app = express();

app.use(express.json());

//User Routes
app.use("/user",userRouter);

//Video Router
app.use('/video', videoRouter);

//Playlist Router
app.use('/playlist', playlistRouter);

//Subscribe Router
app.use('/subscription',SubscribedRouter);

//Like Router
app.use('/like',LikedRouter);

//Comment Router
app.use('/comment',CommentRouter);

app.listen(5000, () => {
    console.log("Server connected..");
    connect();
})