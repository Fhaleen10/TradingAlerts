const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    exchange: {
        type: String,
        default: 'Unknown'
    },
    status: {
        type: String,
        enum: ['triggered', 'failed'],
        default: 'triggered'
    },
    destinations: [{
        type: String
    }],
    triggeredAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Alert', alertSchema);
