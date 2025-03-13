const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateProfileData} = require('../utils/validation')

profileRouter.get("/profile/view",userAuth,async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
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
  module.exports = profileRouter;
  