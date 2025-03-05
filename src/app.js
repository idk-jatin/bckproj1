const express = require('express');
const connectdb = require('./config/database');
const app = express();
const User = require('./models/user');

app.post("/signup",async (req,res)=>{
const userObj ={
    firstName: 'Anuj',
    lastName:'Kumar',
    emailId:'anuj@gmail.com',
    password:'anuj12345'
}
const user = new User(userObj);
try {
    await user.save();
res.send('User added succesfully!!');
} catch (error) {
    res.status(400).send("error saving in dbase:"+error.message);
}
});








connectdb().then(()=>{
    console.log('connection successfull');  
    app.listen(7777,()=>{
        console.log('listening bro');
    });  
})
.catch((err)=>{
console.log(err);
});
