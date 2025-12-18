const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  company: { type: String, required: false },
  expiryDate: { type: Date, required: false },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
