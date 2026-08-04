const Review = require("../models/review.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");


// ======================================
// UPDATE PRODUCT RATING
// ======================================

const updateProductRating = async (productId) => {

    const reviews = await Review.find({ product: productId });

    const totalReviews = reviews.length;

    let averageRating = 0;

    if (totalReviews > 0) {

        const totalRating = reviews.reduce(

            (sum, review) => sum + review.rating,

            0

        );

        averageRating = Number(
            (totalRating / totalReviews).toFixed(1)
        );
    }

    await Product.findByIdAndUpdate(productId, {

        averageRating,

        totalReviews,

    });

};


// ======================================
// CREATE REVIEW
// ======================================

const createReview = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const { rating, review } = req.body;

    if (!rating) {

        throw new ApiError(400, "Rating is required");

    }

    const product = await Product.findById(productId);

    if (!product) {

        throw new ApiError(404, "Product not found");

    }

    // Purchased or not
    const purchased = await Order.findOne({

        user: req.user._id,

        "items.product": productId,

    });

    if (!purchased) {

        throw new ApiError(

            400,

            "Purchase this product before reviewing."

        );

    }

    const alreadyReviewed = await Review.findOne({

        user: req.user._id,

        product: productId,

    });

    if (alreadyReviewed) {

        throw new ApiError(

            400,

            "You already reviewed this product"

        );

    }

    const newReview = await Review.create({

        product: productId,

        user: req.user._id,

        rating,

        review,

    });

    await updateProductRating(productId);

    const populatedReview = await Review.findById(newReview._id)

        .populate("user", "name email")

        .populate("product", "title");

    return res.status(201).json(

        new ApiResponse(

            201,

            "Review added successfully",

            populatedReview

        )

    );

});


// ======================================
// GET PRODUCT REVIEWS
// ======================================

const getProductReviews = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const reviews = await Review.find({

        product: productId,

    })

        .populate("user", "name")

        .sort({

            createdAt: -1,

        });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Reviews fetched successfully",

            reviews

        )

    );

});


// ======================================
// UPDATE REVIEW
// ======================================

const updateReview = asyncHandler(async (req, res) => {

    const { reviewId } = req.params;

    const { rating, review } = req.body;

    const existingReview = await Review.findOne({

        _id: reviewId,

        user: req.user._id,

    });

    if (!existingReview) {

        throw new ApiError(404, "Review not found");

    }

    if (rating) {

        existingReview.rating = rating;

    }

    if (review) {

        existingReview.review = review;

    }

    await existingReview.save();

    await updateProductRating(existingReview.product);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Review updated successfully",

            existingReview

        )

    );

});


// ======================================
// DELETE REVIEW
// ======================================

const deleteReview = asyncHandler(async (req, res) => {

    const { reviewId } = req.params;

    const review = await Review.findOne({

        _id: reviewId,

        user: req.user._id,

    });

    if (!review) {

        throw new ApiError(404, "Review not found");

    }

    const productId = review.product;

    await review.deleteOne();

    await updateProductRating(productId);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Review deleted successfully"

        )

    );

});

module.exports = {

    createReview,

    getProductReviews,

    updateReview,

    deleteReview,

};