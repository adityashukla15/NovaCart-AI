const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const OTP = require("../models/otp.model");

const sendEmail = require("../utils/sendEmail");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler")


 const register = asyncHandler(async (req, res) => {

    const { name, email, password,role } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
    });

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
    };

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "User registered successfully",
                userData
            )
        );
});
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isBlocked) {
    throw new ApiError(
        403,
        "Your account has been blocked by the admin."
    );
}

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

   res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Login successful",
                userData
            )
        );
});
const logout = asyncHandler(async (req, res) => {

    res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Logout successful"
            )
        );
});
const me = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            "Current user fetched successfully",
            req.user
        )
    );

});

// ======================================
// FORGOT PASSWORD
// ======================================

const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(
            400,
            "Email is required"
        );
    }

    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    // Security: don't reveal whether account exists
    if (!user) {

        return res.status(200).json(

            new ApiResponse(
                200,
                "If an account exists, an OTP has been sent"
            )

        );

    }

    // Delete previous OTP
    await OTP.deleteMany({
        email: normalizedEmail,
        purpose: "forgot-password",
    });

    // Generate 6 digit OTP
    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 5 minutes
    const expiresAt = new Date(
        Date.now() + 5 * 60 * 1000
    );

    await OTP.create({

        email: normalizedEmail,

        otp,

        purpose: "forgot-password",

        expiresAt,

    });

    await sendEmail(

        normalizedEmail,

        "NovaCart - Password Reset OTP",

        `Your NovaCart password reset OTP is ${otp}.

This OTP is valid for 5 minutes.

If you did not request a password reset, please ignore this email.`

    );

    return res.status(200).json(

        new ApiResponse(
            200,
            "OTP sent successfully"
        )

    );

});

// ======================================
// VERIFY FORGOT PASSWORD OTP
// ======================================

const verifyForgotPasswordOTP = asyncHandler(
    async (req, res) => {

        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new ApiError(
                400,
                "Email and OTP are required"
            );
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: "forgot-password",
        }).sort({
            createdAt: -1,
        });

        if (!otpRecord) {
            throw new ApiError(
                400,
                "OTP not found or expired"
            );
        }

        // Check expiry
        if (
            new Date() >
            otpRecord.expiresAt
        ) {

            await otpRecord.deleteOne();

            throw new ApiError(
                400,
                "OTP has expired"
            );

        }

        // Check OTP
        if (otpRecord.otp !== otp.toString()) {

            throw new ApiError(
                400,
                "Invalid OTP"
            );

        }
        otpRecord.verified = true;

        await otpRecord.save();

        return res.status(200).json(

            new ApiResponse(
                200,
                "OTP verified successfully"
            )

        );

    }
);

// ======================================
// RESET PASSWORD
// ======================================

const resetPassword = asyncHandler(
    async (req, res) => {

        const {
            email,
            newPassword,
        } = req.body;

        if (!email || !newPassword) {
            throw new ApiError(
                400,
                "Email and new password are required"
            );
        }

        if (newPassword.length < 6) {
            throw new ApiError(
                400,
                "Password must be at least 6 characters"
            );
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: "forgot-password",
            verified: true,
        }).sort({
            createdAt: -1,
        });

        if (!otpRecord) {
            throw new ApiError(
                400,
                "Please verify OTP first"
            );
        }

        // Check expiry again
        if (
            new Date() >
            otpRecord.expiresAt
        ) {

            await otpRecord.deleteOne();

            throw new ApiError(
                400,
                "OTP has expired"
            );

        }

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        await user.save();

        // OTP can no longer be reused
        await otpRecord.deleteOne();

        return res.status(200).json(

            new ApiResponse(
                200,
                "Password reset successfully"
            )

        );

    }
    
);

// ======================================
// UPDATE PROFILE
// ======================================

const updateProfile = asyncHandler(async (req, res) => {

    const {
        name,
        avatar,
    } = req.body;

    if (!name || !name.trim()) {

        throw new ApiError(
            400,
            "Name is required"
        );

    }

    const user = await User.findById(
        req.user._id
    );

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );

    }

    user.name = name.trim();

    if (avatar !== undefined) {
        user.avatar = avatar;
    }

    await user.save();

    const userData = {

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        avatar: user.avatar,

        createdAt: user.createdAt,

    };

    return res.status(200).json(

        new ApiResponse(

            200,

            "Profile updated successfully",

            userData

        )

    );

});

module.exports = {
  register,
  login,
  logout,
  me,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  updateProfile,
};