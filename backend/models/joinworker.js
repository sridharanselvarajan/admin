    // models/joinedWorkerSchema.js
    const mongoose = require('mongoose');

    const joinedWorkerSchema = new mongoose.Schema({
    workerName: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    secondPhone: { type: String, required: false },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now }
    });

    const JoinedWorker = mongoose.model('JoinedWorker', joinedWorkerSchema);

    module.exports = JoinedWorker;
