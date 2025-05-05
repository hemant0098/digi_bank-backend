const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    name: {
        type: String,
        required: true // name is now required
    }
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
