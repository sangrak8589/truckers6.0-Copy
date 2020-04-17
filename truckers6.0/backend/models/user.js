const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  username: { type: String, required: true },
  role: { type: String, required: true },
  companyId: { type: String, required: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
