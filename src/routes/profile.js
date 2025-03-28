const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateProfileData} = require('../utils/validation')
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validator = require('validator')

profileRouter.get("/profile/view",userAuth,async (req, res) => {
    try {
      const {firstName,lastName,age,gender,about,skills,likes,experience,githubUsername,linkedinProfile} = req.user;
      res.send({firstName,lastName,age,gender,about,skills,likes,experience,githubUsername,linkedinProfile});
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  });

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
  try {
 validateProfileData (req);
    const loggedInUser = req.user;
      Object.keys(req.body).forEach(key => loggedInUser[key]=req.body[key]);
     await loggedInUser.save();
      res.json({message:`${loggedInUser.firstName}, Your profile updated successfully`});

  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }

});

profileRouter.patch("/profile/edit/password",userAuth,async (req,res)=>{
  try {
    const loggedInUser = req.user;
    const {currPassword, newPassword} = req.body;
    const isPassValid = await loggedInUser.validatePassword(currPassword);
    if(!isPassValid){
     return res.status(403).json({ error : "Invalid Current PassWord"})
    }
    if (!newPassword || !validator.isStrongPassword(newPassword, { minLength: 8, minNumbers: 1, minSymbols: 1 })) {
      return res.status(400).json({ error : "Invalid new password! Must contain a symbol and a number!"})
    }
    const isSamePassword = await bcrypt.compare(newPassword, loggedInUser.password);
    if (isSamePassword) {
      return res.status(400).json({ error: "New password is same as old password!" });
    }
    const hashedNewPass = await bcrypt.hash(newPassword,10);
    loggedInUser.password = hashedNewPass;
    await loggedInUser.save();
    res.json({message : "Password updated successfully!"})

  } catch (err) {
    res.status(400).json({error : "Error updating password!"});
  }
});



  module.exports = profileRouter;
  