const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  gstNumber: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  secondPhone: { type: String },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  userType: { type: String, default: "user" },
});

module.exports = mongoose.model("Company", CompanySchema);
