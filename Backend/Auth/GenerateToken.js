const jwt= require("jsonwebtoken");

function GenerateAccessToken(user_id) {
    if (!process.env.ACCESS_SECRET_TOKEN) {
        throw new Error("ACCESS_SECRET_TOKEN is not defined in environment variables");
    }

    return jwt.sign(
        { user_id: user_id },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: '45s' }
    );
}
function GenerateRefreshToken(user_id) {
    if (!process.env.REFRESH_SECRET_TOKEN) {
        throw new Error("REFRESH_SECRET_TOKEN is not defined in environment variables");
    }

    return jwt.sign(
        { user_id: user_id },
        process.env.REFRESH_SECRET_TOKEN,
        { expiresIn: '1d' }
    );
}

module.exports={GenerateAccessToken,GenerateRefreshToken};