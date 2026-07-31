const  ApiError=require("../utils/apiError");
const asyncHandler=require("../utils/asyncHandler");


const adminMiddleware = asyncHandler(async (req, res, next) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin only.");
    }

    next();

});

module.exports = adminMiddleware;