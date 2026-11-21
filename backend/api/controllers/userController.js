
const User = require('../models/User');

const sendResponse = require('../utils/sendResponse');

// Get User Profile
async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.userId)
            .select('-otpHash -otpExpiresAt');

        if (!user) {
            return sendResponse(res, 404, {
                error: 'User not found.'
            });
        }

        return sendResponse(res, 200, {
            message: 'Profile fetched successfully.',
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.log('Get Profile Error:', error);

        return sendResponse(res, 500, {
            error: 'Unable to fetch profile.'
        });
    }
}

module.exports = {
    getProfile
};
