const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  let errors = [];

  if (!firstName || firstName.length < 3 || firstName.length > 40) {
    errors.push("First Name should be between 3-40 characters.");
  }
  if (!lastName || lastName.length < 3 || lastName.length > 40) {
    errors.push("Last Name should be between 3-40 characters.");
  }

  if (!emailId || !validator.isEmail(emailId)) {
    errors.push("Invalid email format.");
  }

  if (!password || !validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minSymbols: 1 })) {
    errors.push("Password must be at least 8 characters long and include at least one number and one special character.");
  }
  if (errors.length > 0) {
    throw new Error(errors.join(" | "));
  }
};


const validateProfileData = (req)=>{
  let errors = [];
  const validFields = ["firstName","lastName","age","about","photoUrl","gender","skills"]
  const isDataValid = Object.keys(req.body).every(field => validFields.includes(field));
  if(!isDataValid) errors.push("Invalid Edit Fields!!");

  if ( req.body.firstName && (req.body.firstName.length < 3 || req.body.firstName.length > 40)) {
    errors.push("First Name should be between 3-40 characters.");
  }
  if (req.body.lastName && (req.body.lastName.length < 3 || req.body.lastName.length > 40)) {
    errors.push("Last Name should be between 3-40 characters.");
  }
  if(req.body.gender && !["Male","Female","Others"].includes(req.body.gender)){
    errors.push("Genders can be Male/Female or Others");
  }
  if (req.body.about && req.body.about.length > 100) {
    errors.push("About max length is 100 chars");
  }
  if(req.body.photoUrl && !validator.isURL(req.body.photoUrl)){
    errors.push("Not a valid URL");
  }
  if(req.body.skills && (!Array.isArray(req.body.skills) || req.body.skills.length > 10)){
    errors.push("Skills can be maximum 10");
  }
  if (errors.length >0){
    throw new Error(errors.join(' | '));
  }
}

module.exports = { validateSignupData , validateProfileData};
