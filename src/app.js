const express = require("express");
const app = express();
const connectdb = require("./config/database");
const bcrypt = require('bcrypt');
const User = require("./models/user");
const {validateSignupData}  = require("./utils/validation.js");

app.use(express.json());


app.post("/signup", async (req, res) => {
  
  try {
    //validn of data
    validateSignupData(req);
    // pass encryption
    const {firstName, lastName, emailId, password} = req.body;
    const hashedPass = await bcrypt.hash(password,10);
    // creating a user instance of User model and saving in db
    const user = new User({firstName, lastName, emailId, password:hashedPass});
    await user.save({runValidators:true});
    res.send("User added succesfully!!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

app.post("/login", async (req, res) => {

  try {
    const {emailId,password} = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("Invalid Credential");
    }
    const isPassValid = await bcrypt.compare(password,user.password);
    if(!isPassValid){
      throw new Error("Invalid Credentials");
    }
    else{
      res.send('Login Successfull');
      
    }
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});


app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("users not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("error finding in dbase:" + error.message);
  }
});

app.get("/user", async (req, res) => {
    try {
      const user = await User.find({emailId: req.body.emailId});
      if (user.length === 0) {
        res.status(404).send("user not found");
      } else {
        res.send(user);
      }
    } catch (error) {
      res.status(400).send("error finding in dbase:" + error.message);
    }
  });

  app.delete("/user", async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.body.userId);
        res.send(`user ${user.firstName} deleted`);
      }
    catch (error) {
      res.status(400).send("error deleting in dbase:" + error.message);
    }
  });

app.patch("/user", async (req,res) =>{
  try {
    await User.findByIdAndUpdate(req.body.userId,req.body,{new:true,runValidators:true});
    res.send("User updated succesfully");
  } catch (error) {
    res.status(400).send("error updating in dbase:" + error.message);
  }
});


connectdb()
  .then(() => {
    console.log("connection successfull");
    app.listen(7777, () => {
      console.log("listening bro");
    });
  })
  .catch((err) => {
    console.log(err);
  });
