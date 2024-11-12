const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    title: { type: String },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);