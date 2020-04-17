const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userCompanyRelationshipSchema = mongoose.Schema({
  userId: { type: String, require: true },
  companyId: { type: String, require: true },
  userName: { type: String, require: true },
  companyName: {type: String, require: true},
  points: { type: Number, require: true }
});

userCompanyRelationshipSchema.index({"userId": 1, "companyId": 1}, {"unique": true});

userCompanyRelationshipSchema.plugin(uniqueValidator);

module.exports = mongoose.model(
  "userCompanyRelationship",
  userCompanyRelationshipSchema
);
