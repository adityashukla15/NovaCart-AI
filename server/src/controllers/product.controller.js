const Product = require("../models/product.model");

const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");


// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        category,
        brand,
        price,
        discountPrice,
        stock,
        images,
        sizes,
        colors,
        isFeatured
    } = req.body;

    if (
        !title ||
        !description ||
        !category ||
        !price ||
        stock === undefined
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    const slug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
        throw new ApiError(400, "Product already exists");
    }

    const product = await Product.create({

        title,

        slug,

        description,

        category,

        brand,

        price,

        discountPrice,

        stock,

        images,

        sizes,

        colors,

        isFeatured,

        createdBy: req.user._id,

    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Product created successfully",
            product
        )
    );

});


// GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {

    const products = await Product.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Products fetched successfully",

            products

        )

    );

});


// GET SINGLE PRODUCT
const getProductById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id)
        .populate("createdBy", "name email");

    if (!product) {

        throw new ApiError(404, "Product not found");

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product fetched successfully",

            product

        )

    );

});


// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(

        id,

        req.body,

        {
            new: true,
            runValidators: true,
        }

    );

    if (!updatedProduct) {

        throw new ApiError(404, "Product not found");

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product updated successfully",

            updatedProduct

        )

    );

});


// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {

        throw new ApiError(404, "Product not found");

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product deleted successfully"

        )

    );

});


module.exports = {

    createProduct,

    getAllProducts,

    getProductById,

    updateProduct,

    deleteProduct,

};