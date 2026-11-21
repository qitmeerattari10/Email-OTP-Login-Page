
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    otpHash: {
        type: String,
        default: null
    },

    otpExpiresAt: {
        type: Date,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
