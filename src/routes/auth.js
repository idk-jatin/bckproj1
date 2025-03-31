const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user");
const {validateSignupData}  = require("../utils/validation");



authRouter.post("/signup", async (req, res) => {
    try {
      //validn of data
      await validateSignupData(req.body);
      // pass encryption
      const {firstName, lastName, emailId, password} = req.body;
      const hashedPass = await bcrypt.hash(password,10);
      // creating a user instance of User model and saving in db
      const user = new User({firstName, lastName, emailId, password:hashedPass});
      await user.save({runValidators:true});
      res.json({ message: "User added successfully!" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  authRouter.post("/login", async (req, res) => {
  
    try {
      const {emailId,password} = req.body;

      if (!emailId || !password) {
        return res.status(400).json({ error: "Email/Password is required!" });
      }
      const user = await User.findOne({emailId: emailId});
      if(!user){
        throw new Error("Invalid Credentials");
      }
      const isPassValid = await user.validatePassword(password);
  
      if(!isPassValid){
        throw new Error("Invalid Credentials");
      }
      else{
     const token  = await user.getJWT();
  
      res.cookie("token",token,{
        expires:new Date(Date.now() + 7*24*3600000)
      });
      res.json({ message: "Login successful"});
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

authRouter.post("/logout",(req,res)=>{

  res.cookie('token',null,{expires: new Date(Date.now())});
  res.json({message:"Logout Successful"});

})
  

module.exports = authRouter;