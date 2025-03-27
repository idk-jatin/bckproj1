const express = require("express");
const app = express();
const connectdb = require("./config/database");
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)



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
