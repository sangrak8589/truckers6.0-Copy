const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const companySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

companySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Company", companySchema);
