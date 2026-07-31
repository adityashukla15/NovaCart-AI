const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {

    // Cookie se token nikalo
    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, "Unauthorized. Please login first.");
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User fetch karo (password ke bina)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Request me user attach karo
    req.user = user;

    next();

});

module.exports = authMiddleware;