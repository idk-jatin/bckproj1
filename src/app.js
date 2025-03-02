const express = require('express');
const app = express();

app.get("/",(req,res)=>{
    res.send('Starting Page');
});
app.get("/test",(req,res)=>{
    res.send('Testing Page');
});
app.get("/new",(req,res)=>{
    res.send('New3 Page');
});

app.listen(7777,()=>{
    console.log('listening bro');
});