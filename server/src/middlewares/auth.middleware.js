const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {

    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new ApiError(
            401,
            "Unauthorized. Please login first."
        );
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
        .select("-password");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (user.isBlocked) {
        throw new ApiError(
            403,
            "Your account has been blocked by the admin."
        );
    }

    req.user = user;

    next();
});

module.exports = authMiddleware;