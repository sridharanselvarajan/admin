    // models/joinedCompanySchema.js
    const mongoose = require('mongoose');

    const joinedCompanySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    gstNumber: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    secondPhone: { type: String, required: false },
    email: { type: String, required: false },
    date: { type: Date, required: true },
    });

    const JoinedCompany = mongoose.model('JoinedCompany', joinedCompanySchema);
    module.exports = JoinedCompany;
