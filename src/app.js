const express = require('express');
const app = express();

app.use('/user',(req,res,next)=>{
    console.log('route handler 1');
    next();
},
(req,res,next)=>{
    console.log('route handler 2');
    next();
},
(req,res,next)=>{
    console.log('route handler 3');
    next();
},
(req,res)=>{
    console.log('route handler 4');
    res.send('gotacha')
},
);

app.listen(7777,()=>{
    console.log('listening bro');
});