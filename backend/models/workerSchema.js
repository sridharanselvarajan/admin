    const mongoose = require("mongoose");

    const workerSchema = new mongoose.Schema({
    workerName: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    secondPhone: { type: String },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    });

    module.exports = mongoose.model("Worker", workerSchema);
