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

module.exports = { validateSignupData };
