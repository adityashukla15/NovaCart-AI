const Coupon=require('../models/coupon.model')

const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");


const createCoupon = asyncHandler(async (req, res) => {

    const {
        code,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscount,
        expiryDate,
        usageLimit,
    } = req.body;


    if (
        !code ||
        !discountType ||
        discountValue === undefined ||
        !expiryDate
    ) {
        throw new ApiError(
            400,
            "Code, discount type, discount value and expiry date are required"
        );
    }


    if (!["percentage", "fixed"].includes(discountType)) {

        throw new ApiError(
            400,
            "Discount type must be percentage or fixed"
        );

    }


    if (discountValue <= 0) {

        throw new ApiError(
            400,
            "Discount value must be greater than 0"
        );

    }


    // Percentage validation
    if (
        discountType === "percentage" &&
        discountValue > 100
    ) {

        throw new ApiError(
            400,
            "Percentage discount cannot exceed 100"
        );

    }


    // Check duplicate coupon
    const existingCoupon = await Coupon.findOne({
        code: code.toUpperCase().trim(),
    });


    if (existingCoupon) {

        throw new ApiError(
            409,
            "Coupon already exists"
        );

    }


    // Check expiry
    if (new Date(expiryDate) <= new Date()) {

        throw new ApiError(
            400,
            "Expiry date must be in the future"
        );

    }


    const coupon = await Coupon.create({

        code: code.toUpperCase().trim(),

        discountType,

        discountValue,

        minOrderAmount: minOrderAmount || 0,

        maxDiscount: maxDiscount || 0,

        expiryDate,

        usageLimit: usageLimit || 0,

        createdBy: req.user._id,

    });


    return res.status(201).json(

        new ApiResponse(

            201,

            "Coupon created successfully",

            coupon

        )

    );

});


// =====================================================
// GET ALL COUPONS - ADMIN
// =====================================================

const getAllCoupons = asyncHandler(async (req, res) => {

    const coupons = await Coupon.find()

        .populate("createdBy", "name email")

        .sort({ createdAt: -1 });


    return res.status(200).json(

        new ApiResponse(

            200,

            "Coupons fetched successfully",

            coupons

        )

    );

});


// =====================================================
// GET SINGLE COUPON - ADMIN
// =====================================================

const getSingleCoupon = asyncHandler(async (req, res) => {

    const { id } = req.params;


    const coupon = await Coupon.findById(id)

        .populate("createdBy", "name email");


    if (!coupon) {

        throw new ApiError(
            404,
            "Coupon not found"
        );

    }


    return res.status(200).json(

        new ApiResponse(

            200,

            "Coupon fetched successfully",

            coupon

        )

    );

});


// =====================================================
// UPDATE COUPON - ADMIN
// =====================================================

const updateCoupon = asyncHandler(async (req, res) => {

    const { id } = req.params;


    const coupon = await Coupon.findById(id);


    if (!coupon) {

        throw new ApiError(
            404,
            "Coupon not found"
        );

    }


    const {
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscount,
        expiryDate,
        usageLimit,
    } = req.body;


    if (discountType !== undefined) {

        if (
            !["percentage", "fixed"].includes(discountType)
        ) {

            throw new ApiError(
                400,
                "Invalid discount type"
            );

        }

        coupon.discountType = discountType;

    }


    if (discountValue !== undefined) {

        if (discountValue <= 0) {

            throw new ApiError(
                400,
                "Discount value must be greater than 0"
            );

        }


        if (
            coupon.discountType === "percentage" &&
            discountValue > 100
        ) {

            throw new ApiError(
                400,
                "Percentage discount cannot exceed 100"
            );

        }


        coupon.discountValue = discountValue;

    }


    if (minOrderAmount !== undefined) {

        coupon.minOrderAmount = minOrderAmount;

    }


    if (maxDiscount !== undefined) {

        coupon.maxDiscount = maxDiscount;

    }


    if (expiryDate !== undefined) {

        if (new Date(expiryDate) <= new Date()) {

            throw new ApiError(
                400,
                "Expiry date must be in the future"
            );

        }

        coupon.expiryDate = expiryDate;

    }


    if (usageLimit !== undefined) {

        coupon.usageLimit = usageLimit;

    }


    await coupon.save();


    return res.status(200).json(

        new ApiResponse(

            200,

            "Coupon updated successfully",

            coupon

        )

    );

});


// =====================================================
// TOGGLE COUPON - ADMIN
// =====================================================

const toggleCoupon = asyncHandler(async (req, res) => {

    const { id } = req.params;


    const coupon = await Coupon.findById(id);


    if (!coupon) {

        throw new ApiError(
            404,
            "Coupon not found"
        );

    }


    coupon.isActive = !coupon.isActive;


    await coupon.save();


    return res.status(200).json(

        new ApiResponse(

            200,

            coupon.isActive
                ? "Coupon activated successfully"
                : "Coupon deactivated successfully",

            coupon

        )

    );

});


// =====================================================
// DELETE COUPON - ADMIN
// =====================================================

const deleteCoupon = asyncHandler(async (req, res) => {

    const { id } = req.params;


    const coupon = await Coupon.findById(id);


    if (!coupon) {

        throw new ApiError(
            404,
            "Coupon not found"
        );

    }


    await Coupon.findByIdAndDelete(id);


    return res.status(200).json(

        new ApiResponse(

            200,

            "Coupon deleted successfully",

            null

        )

    );

});


// =====================================================
// APPLY COUPON - USER
// =====================================================

const applyCoupon = asyncHandler(async (req, res) => {

    const { code, cartTotal } = req.body;

    if (!code) {
        throw new ApiError(400, "Coupon code is required");
    }

    if (cartTotal === undefined || Number(cartTotal) < 0) {
        throw new ApiError(400, "Valid cart total is required");
    }

    const coupon = await Coupon.findOne({
        code: code.toUpperCase().trim(),
    });

    if (!coupon) {
        throw new ApiError(404, "Invalid coupon code");
    }

    // Active check
    if (!coupon.isActive) {
        throw new ApiError(400, "Coupon is inactive");
    }

    // Expiry check
    if (new Date() > new Date(coupon.expiryDate)) {
        throw new ApiError(400, "Coupon has expired");
    }

    // Usage limit
    if (
        coupon.usageLimit > 0 &&
        coupon.usedCount >= coupon.usageLimit
    ) {
        throw new ApiError(400, "Coupon usage limit reached");
    }

    const subtotal = Number(cartTotal);

    // Minimum order check
    if (subtotal < coupon.minOrderAmount) {
        throw new ApiError(
            400,
            `Minimum order amount should be ₹${coupon.minOrderAmount}`
        );
    }

    // Calculate discount
    let discount = 0;

    if (coupon.discountType === "percentage") {

        discount =
            (subtotal * coupon.discountValue) / 100;

        // Maximum discount
        if (
            coupon.maxDiscount > 0 &&
            discount > coupon.maxDiscount
        ) {
            discount = coupon.maxDiscount;
        }

    } else {

        discount = coupon.discountValue;

    }

    // Discount cannot exceed cart total
    if (discount > subtotal) {
        discount = subtotal;
    }

    discount = Math.round(discount);

    const finalAmount = subtotal - discount;

    return res.status(200).json(

        new ApiResponse(

            200,

            "Coupon applied successfully",

            {
                coupon: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                subtotal,
                discount,
                finalAmount,
            }

        )

    );

});

module.exports = {

    createCoupon,

    getAllCoupons,

    getSingleCoupon,

    updateCoupon,

    toggleCoupon,

    deleteCoupon,

    applyCoupon,

};