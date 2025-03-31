require('dotenv').config();

const express = require("express");
const app = express();
const connectdb = require("./config/database");
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 7777;

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
    app.listen(PORT, () => {
      console.log("listening bro");
    });
  })
  .catch((err) => {
    console.log(err);
  });
