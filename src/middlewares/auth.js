const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async(req,res,next)=>{
    try {
        const{ token } = req.cookies;
        if(!token){
            throw new Error("Token not valid!!");
        }
        const decodedObj = jwt.verify(token,"dev_8tind@r");
        const {_id} = decodedObj;
        const user = User.findById(_id);
        if(!user){
            throw new Error("User Not Found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).JSON({"ERROR: ": error.message});
    }
}

module.exports = {userAuth}
