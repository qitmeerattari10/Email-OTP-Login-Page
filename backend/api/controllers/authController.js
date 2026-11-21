
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const {
    generateOtp,
    hashOtp,
    isOtpMatch,
    OTP_TTL_MS
} = require('../utils/otp');

const { sendOtpEmail } = require('../services/emailService');

const sendResponse = require('../utils/sendResponse');

// Send OTP
async function sendOtp(req, res) {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string') {
            return sendResponse(res, 400, {
                error: 'Valid email is required.'
            });
        }

        const userEmail = email.trim().toLowerCase();

        const otp = generateOtp();
        const otpHash = hashOtp(userEmail, otp);

        const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

        await User.findOneAndUpdate(
            { email: userEmail },
            {
                email: userEmail,
                otpHash,
                otpExpiresAt,
                isVerified: false
            },
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );

        await sendOtpEmail(userEmail, otp);

        return sendResponse(res, 200, {
            message: 'OTP sent successfully.',
            email: userEmail
        });

    } catch (error) {
        console.log('Send OTP Error:', error);

        return sendResponse(res, 500, {
            error: 'Unable to send OTP.'
        });
    }
}

// Verify OTP
async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (
            !email ||
            typeof email !== 'string' ||
            !otp ||
            typeof otp !== 'string' ||
            !/^\d{6}$/.test(otp)
        ) {
            return sendResponse(res, 400, {
                error: 'Valid email and 6-digit OTP are required.'
            });
        }

        const userEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: userEmail
        });

        if (!user || !user.otpHash || !user.otpExpiresAt) {
            return sendResponse(res, 400, {
                error: 'Please request a new OTP.'
            });
        }

        if (user.otpExpiresAt < new Date()) {
            return sendResponse(res, 400, {
                error: 'OTP has expired. Please request a new OTP.'
            });
        }

        const actualHash = hashOtp(userEmail, otp);

        if (!isOtpMatch(user.otpHash, actualHash)) {
            return sendResponse(res, 400, {
                error: 'Invalid OTP. Please try again.'
            });
        }

        user.isVerified = true;
        user.otpHash = null;
        user.otpExpiresAt = null;

        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        return sendResponse(res, 200, {
            message: 'Email verified successfully.',
            email: user.email,
            isVerified: true,
            token
        });

    } catch (error) {
        console.log('Verify OTP Error:', error);

        return sendResponse(res, 500, {
            error: 'Unable to verify OTP.'
        });
    }
}

module.exports = {
    sendOtp,
    verifyOtp
};
