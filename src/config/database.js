const mongoose = require('mongoose');

const connectdb = async ()=>{
    await mongoose.connect("mongodb+srv://admin:lmaomongo78@mymongo.kndbu.mongodb.net/devTinder");
};

module.exports = connectdb;