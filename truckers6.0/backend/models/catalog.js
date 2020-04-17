const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const catalogSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  companyId: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  keyword: { type: String, required: true },
  description: { type: String, required: true }
});

catalogSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Catalog", catalogSchema);
