const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async(req,res,next)=>{
    try {
        const{ token } = req.cookies;
        if(!token){
            throw new Error("Token not valid!!");
        }
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user){
            res.clearCookie("token");
            throw new Error("User Not Found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.status(401).json({error: error.message });
    }
}

module.exports = {userAuth}
