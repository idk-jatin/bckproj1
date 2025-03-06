const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added succesfully!!");
  } catch (error) {
    res.status(400).send("error saving in dbase:" + error.message);
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
    await User.findByIdAndUpdate(req.body.userId,req.body,{returnDocument:'before'});
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
