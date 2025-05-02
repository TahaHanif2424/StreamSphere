const jwt= require("jsonwebtoken");
require("dotenv").config();

const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if(!authHeader)return res.status(401);
    console.log(authHeader);
    const token=authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Token is missing" });
    }
    jwt.verify(
        token,
        process.env.ACCESS_SECRET_TOKEN,
        (err,decode)=>{
            if(err)return res.status(403);
            req.user_id=decode.user_id;
            console.log(req.user_id);
            next();
        }
    )
}
module.exports=verifyJWT;