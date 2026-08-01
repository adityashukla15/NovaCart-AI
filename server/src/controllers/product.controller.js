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
        isFeatured,
    } = req.body;

    if (
        !title ||
        !description ||
        !category ||
        price === undefined ||
        stock === undefined
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
        throw new ApiError(404, "Category not found");
    }

    const slug = title
        .trim()
        .toLowerCase()
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

    const populatedProduct = await Product.findById(product._id)

        .populate("category", "name slug image")

        .populate("createdBy", "name email");

    return res.status(201).json(

        new ApiResponse(

            201,

            "Product created successfully",

            populatedProduct

        )

    );

});



// ==============================
// GET ALL PRODUCTS
// ==============================

const getAllProducts = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const category = req.query.category || "";

    const featured = req.query.featured;

    const minPrice = Number(req.query.minPrice) || 0;

    const maxPrice = Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

    const sort = req.query.sort || "-createdAt";


    let filter = {};

    if (search) {

        filter.title = {

            $regex: search,

            $options: "i",

        };

    }

    if (category) {

        filter.category = category;

    }

    if (featured !== undefined) {

        filter.isFeatured = featured === "true";

    }

    filter.price = {

        $gte: minPrice,

        $lte: maxPrice,

    };

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)

        .populate("category", "name slug image")

        .populate("createdBy", "name email")

        .sort(sort)

        .skip(skip)

        .limit(limit);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Products fetched successfully",

            {

                products,

                currentPage: page,

                totalPages: Math.ceil(totalProducts / limit),

                totalProducts,

                hasNextPage: page < Math.ceil(totalProducts / limit),

                hasPrevPage: page > 1,

            }

        )

    );

});



// ==============================
// GET PRODUCT BY ID
// ==============================

const getProductById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id)

        .populate("category", "name slug image")

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



// ==============================
// UPDATE PRODUCT
// ==============================

const updateProduct = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (req.body.category) {

        const category = await Category.findById(req.body.category);

        if (!category) {

            throw new ApiError(404, "Category not found");

        }

    }

    if (req.body.title) {

        req.body.slug = req.body.title

            .trim()

            .toLowerCase()

            .replace(/\s+/g, "-");

    }

    const updatedProduct = await Product.findByIdAndUpdate(

        id,

        req.body,

        {

            new: true,

            runValidators: true,

        }

    )

        .populate("category", "name slug image")

        .populate("createdBy", "name email");

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



// ==============================
// DELETE PRODUCT
// ==============================

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