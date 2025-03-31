const mongoose = require('mongoose');

const connectdb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.error("Failed to Connect" + err.message);
        throw new Error("Failed to Connect Db!!");
    }
    
};

module.exports = connectdb;