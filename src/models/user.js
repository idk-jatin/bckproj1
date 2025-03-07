const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:3,
        maxLength: 40,
        trim:true
    },
    lastName: {
        type: String,
        maxLength:40,
        trim:true
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minLength:8,
        maxLength: 25,
        trim:true
    },
    age:{
        type:Number,
        min:18,
        max:100,
        trim:true
    },
    gender:{
        type:String,
        enum: ["Male", "Female", "Others"],
        default: "None",
        trim:true
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"This is the default about of the user.",
        trim:true
    },
    skills:{
        type:[String],
        lowercase:true,
        set: skills => Array.from(new Set(skills.map(skill => skill.toLowerCase())))
    }
},{
    timestamps: true
});

const userModel = mongoose.model("User",userSchema);
module.exports = userModel;