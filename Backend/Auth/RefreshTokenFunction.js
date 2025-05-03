const cookieParser=require("cookie-parser");
const jwt=require('jsonwebtoken');
const {GenerateAccessToken}=require("./GenerateToken");

 function handleRefreshToken(req,res){
    try{
        const cookie=req.cookies;
        if(!cookie?.jwt)return res.sendStatus(401);
        const refreshToken=cookie.jwt;
        jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_TOKEN,
            (err,decode)=>{
                if(err)return res.sendStatus(403);
                const email=decode.email;
                const accessToken=GenerateAccessToken(email);
                return res.status(200).json({ accessToken });
            }
        )
    }catch(err){
        return res.status(500).send({ error: "Could not refresh token", err });
        
    }
}

module.exports=handleRefreshToken;