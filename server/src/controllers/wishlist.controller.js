const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");

const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");


// ADD PRODUCT TO WISHLIST
const addToWishlist = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let wishlist = await Wishlist.findOne({
        user: req.user._id,
    });

    if (!wishlist) {

        wishlist = await Wishlist.create({

            user: req.user._id,

            products: [productId],

        });

    } else {

        if (wishlist.products.includes(productId)) {
            throw new ApiError(400, "Product already in wishlist");
        }

        wishlist.products.push(productId);

        await wishlist.save();

    }

    const populatedWishlist = await Wishlist.findById(wishlist._id)
        .populate("products")
        .populate("user", "name email");

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product added to wishlist",

            populatedWishlist

        )

    );

});



// GET WISHLIST
const getWishlist = asyncHandler(async (req, res) => {

    const wishlist = await Wishlist.findOne({

        user: req.user._id

    })

        .populate("products")

        .populate("user", "name email");

    return res.status(200).json(

        new ApiResponse(

            200,

            "Wishlist fetched successfully",

            wishlist || {}

        )

    );

});



// REMOVE PRODUCT
const removeFromWishlist = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({

        user: req.user._id

    });

    if (!wishlist) {

        throw new ApiError(404, "Wishlist not found");

    }

    wishlist.products = wishlist.products.filter(

        (item) => item.toString() !== productId

    );

    await wishlist.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product removed from wishlist",

            wishlist

        )

    );

});



// CLEAR WISHLIST
const clearWishlist = asyncHandler(async (req, res) => {

    const wishlist = await Wishlist.findOne({

        user: req.user._id

    });

    if (!wishlist) {

        throw new ApiError(404, "Wishlist not found");

    }

    wishlist.products = [];

    await wishlist.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Wishlist cleared successfully"

        )

    );

});

module.exports = {

    addToWishlist,

    getWishlist,

    removeFromWishlist,

    clearWishlist,

};