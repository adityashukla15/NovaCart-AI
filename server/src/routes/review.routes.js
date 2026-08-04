const express=require('express')

const router=express.Router()

const authMiddleware=require('../middlewares/auth.middleware.js')

const {

    createReview,
    getProductReviews,
    updateReview,
    deleteReview,

} = require("../controllers/review.controller");

router.post(
    "/:productId",
    authMiddleware,
    createReview
);

router.get(
    "/:productId",
    getProductReviews
);

router.patch(
    "/:reviewId",
    authMiddleware,
    updateReview
);

router.delete(
    "/:reviewId",
    authMiddleware,
    deleteReview
);

module.exports=router