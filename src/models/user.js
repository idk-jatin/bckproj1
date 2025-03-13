const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not an valid Email');
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim:true
    },
    age:{
        type:Number,
        min:18,
        max:100,
    },
    gender:{
        type:String,
        enum: ["Male", "Female", "Others"],
        default: "Others",
        trim:true
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Not an valid Url');
            }
        }
    },
    about:{
        type:String,
        default:"This is the default about of the user.",
        trim:true
    },
    skills:{
        type:[String],
        lowercase:true,
        length:10,
        set: skills => Array.from(new Set(skills.map(skill => skill.toLowerCase())))
    }
},{
    timestamps: true
});

userSchema.methods.getJWT = async function() {
   const user = this;
    const token = jwt.sign({_id:user._id},"dev_8tind@r",{expiresIn:"7d"});
    return token;
}
userSchema.methods.validatePassword = async function(userInputPassword){
   const user = this;
   const hashedPass = user.password;
   const isPassValid = await bcrypt.compare(userInputPassword,hashedPass);
   return isPassValid;
}

const userModel = mongoose.model("User",userSchema);
module.exports = userModel;