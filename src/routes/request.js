const express = require('express')
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');

requestRouter.get("/request",userAuth,(req,res)=>{
const user = req.user;
res.send(user.firstName + " sent the connect request");
});

module.exports = requestRouter;