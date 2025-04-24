const express = require("express");
const connect = require("../DataBase/DataBaseConnection");
const userRouter=require("../Controller/UserController");

const app = express();

app.use(express.json());

//User Routes
app.use("/user",userRouter);


app.listen(5000, () => {
    console.log("Server connected..");
    connect();
})