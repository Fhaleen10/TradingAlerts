const mongoose = require('mongoose');

const alertCountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
});

// Compound index to ensure unique combination of userId and date
alertCountSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AlertCount', alertCountSchema);
