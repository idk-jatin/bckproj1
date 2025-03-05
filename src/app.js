const express = require('express');
const connectdb = require('./config/database');
const app = express();

connectdb().then(()=>{
    console.log('connection successfull');  
    app.listen(7777,()=>{
        console.log('listening bro');
    });  
})
.catch((err)=>{
console.log(err);
});
