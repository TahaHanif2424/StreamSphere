const express = require("express");
const connect = require("./DataBase/DataBaseConnection");
const userRouter=require("./Controller/UserController");
const videoRouter=require("./Controller/VideoController");
const playlistRouter=require("./Controller/PlaylistController");

const app = express();

app.use(express.json());

//User Routes
app.use("/user",userRouter);

//Video Router
app.use('/video', videoRouter);

//Playlist Router
app.use('/playlist', playlistRouter);

app.listen(5000, () => {
    console.log("Server connected..");
    connect();
})