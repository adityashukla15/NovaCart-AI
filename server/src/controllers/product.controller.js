const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Review = require("../models/review.model");

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
        sizes,
        colors,
        isFeatured,
    } = req.body;

    // Required Fields
    if (
        !title ||
        !description ||
        !category ||
        price === undefined ||
        stock === undefined
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    // Check Category
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
        throw new ApiError(404, "Category not found");
    }

    // Validate Price
    if (Number(price) <= 0) {
        throw new ApiError(400, "Price must be greater than 0");
    }

    // Validate Discount
    if (
        discountPrice &&
        Number(discountPrice) >= Number(price)
    ) {
        throw new ApiError(
            400,
            "Discount price must be less than actual price"
        );
    }

    // Validate Stock
    if (Number(stock) < 0) {
        throw new ApiError(
            400,
            "Stock cannot be negative"
        );
    }

    // Generate Slug
    const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

    // Duplicate Product
    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
        throw new ApiError(
            400,
            "Product already exists"
        );
    }

    // Cloudinary Images
    const imageUrls = req.files
        ? req.files.map(file => file.path)
        : [];

    // Sizes
    const parsedSizes = sizes
        ? Array.isArray(sizes)
            ? sizes
            : sizes.split(",").map(item => item.trim())
        : [];

    // Colors
    const parsedColors = colors
        ? Array.isArray(colors)
            ? colors
            : colors.split(",").map(item => item.trim())
        : [];

    const product = await Product.create({

        title,

        slug,

        description,

        category,

        brand,

        price,

        discountPrice,

        stock,

        images: imageUrls,

        sizes: parsedSizes,

        colors: parsedColors,

        isFeatured:
            isFeatured === true ||
            isFeatured === "true",

        averageRating: 0,

        totalReviews: 0,

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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
        search,
        category,
        featured,
        minPrice,
        maxPrice,
        minRating,
        inStock,
        sort,
    } = req.query;

    let filter = {isDeleted: false,};

    // Search by title & brand
    if (search) {

        filter.$or = [

            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                brand: {
                    $regex: search,
                    $options: "i",
                },
            },

        ];

    }

    // Category
    if (category) {

        filter.category = category;

    }

    // Featured
    if (featured !== undefined) {

        filter.isFeatured = featured === "true";

    }

    // Price Range
    if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice)
            filter.price.$gte = Number(minPrice);

        if (maxPrice)
            filter.price.$lte = Number(maxPrice);

    }

    // Rating Filter
    if (minRating) {

        filter.averageRating = {

            $gte: Number(minRating),

        };

    }

    // Stock Filter
    if (inStock === "true") {

        filter.stock = {

            $gt: 0,

        };

    }

    let sortOption = {
        createdAt: -1,
    };

    switch (sort) {

        case "priceLow":
            sortOption = {
                price: 1,
            };
            break;

        case "priceHigh":
            sortOption = {
                price: -1,
            };
            break;

        case "rating":
            sortOption = {
                averageRating: -1,
            };
            break;

        case "oldest":
            sortOption = {
                createdAt: 1,
            };
            break;

        default:
            sortOption = {
                createdAt: -1,
            };

    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)

        .populate("category", "name slug image")

        .populate("createdBy", "name email")

        .sort(sortOption)

        .skip(skip)

        .limit(limit)

        .lean();

    const updatedProducts = products.map(product => ({

        ...product,

        discountPercentage:

            product.discountPrice

                ? Math.round(

                      ((product.price - product.discountPrice) /

                          product.price) *

                          100

                  )

                : 0,

        stockStatus:

            product.stock > 0

                ? "In Stock"

                : "Out Of Stock",

    }));

    return res.status(200).json(

        new ApiResponse(

            200,

            "Products fetched successfully",

            {

                products: updatedProducts,

                currentPage: page,

                totalPages: Math.ceil(totalProducts / limit),

                totalProducts,

                hasNextPage:

                    page < Math.ceil(totalProducts / limit),

                hasPrevPage: page > 1,

            }

        )

    );

});

const getProductById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const product = await Product.findOne({ _id: id, isDeleted: false })
        .populate("category", "name slug image")
        .populate("createdBy", "name email")
        .lean();

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Latest Reviews
    const reviews = await Review.find({
        product: id,
    })
        .populate("user", "name")
        .sort({
            createdAt: -1,
        })
        .limit(5);

    // Similar Products
    const similarProducts = await Product.find({

        category: product.category._id,

        _id: {
            $ne: product._id,
        },

    })

        .select(
            "title slug images price discountPrice averageRating totalReviews stock"
        )

        .limit(4)

        .lean();

    const updatedSimilarProducts = similarProducts.map(item => ({

        ...item,

        discountPercentage:
            item.discountPrice
                ? Math.round(
                    ((item.price - item.discountPrice) /
                        item.price) *
                    100
                )
                : 0,

        stockStatus:
            item.stock > 0
                ? "In Stock"
                : "Out Of Stock",

    }));

    // Product Discount
    product.discountPercentage =
        product.discountPrice
            ? Math.round(
                ((product.price - product.discountPrice) /
                    product.price) *
                100
            )
            : 0;

    // Stock Status
    product.stockStatus =
        product.stock > 0
            ? "In Stock"
            : "Out Of Stock";

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product fetched successfully",

            {

                product,

                reviews,

                similarProducts: updatedSimilarProducts,

            }

        )

    );

});



// ==============================
// UPDATE PRODUCT
// ==============================

const updateProduct = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const {
        title,
        description,
        category,
        brand,
        price,
        discountPrice,
        stock,
        sizes,
        colors,
        isFeatured,
    } = req.body;

    // Category Validation
    if (category) {

        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            throw new ApiError(404, "Category not found");
        }

        product.category = category;
    }

    // Price Validation
    if (price !== undefined) {

        if (Number(price) <= 0) {
            throw new ApiError(400, "Price must be greater than 0");
        }

        product.price = Number(price);
    }

    // Discount Validation
    if (discountPrice !== undefined) {

        const actualPrice = price
            ? Number(price)
            : product.price;

        if (Number(discountPrice) >= actualPrice) {

            throw new ApiError(
                400,
                "Discount price must be less than actual price"
            );

        }

        product.discountPrice = Number(discountPrice);
    }

    // Stock Validation
    if (stock !== undefined) {

        if (Number(stock) < 0) {

            throw new ApiError(
                400,
                "Stock cannot be negative"
            );

        }

        product.stock = Number(stock);
    }

    // Title & Slug
    if (title) {

        const slug = title
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        const existingSlug = await Product.findOne({
            slug,
            _id: { $ne: id },
        });

        if (existingSlug) {
            throw new ApiError(
                400,
                "Another product with same title already exists"
            );
        }

        product.title = title;
        product.slug = slug;
    }

    if (description) {
        product.description = description;
    }

    if (brand) {
        product.brand = brand;
    }

    // Cloudinary Images
    if (req.files && req.files.length > 0) {

        product.images = req.files.map(file => file.path);

    }

    // Sizes
    if (sizes) {

        product.sizes = Array.isArray(sizes)
            ? sizes
            : sizes.split(",").map(item => item.trim());

    }

    // Colors
    if (colors) {

        product.colors = Array.isArray(colors)
            ? colors
            : colors.split(",").map(item => item.trim());

    }

    // Featured
    if (isFeatured !== undefined) {

        product.isFeatured =
            isFeatured === true ||
            isFeatured === "true";

    }

    await product.save();

    const updatedProduct = await Product.findById(product._id)
        .populate("category", "name slug image")
        .populate("createdBy", "name email");

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

    const product = await Product.findById(id);

    if (!product) {

        throw new ApiError(

            404,

            "Product not found"

        );

    }

    if (product.isDeleted) {

        throw new ApiError(

            400,

            "Product already deleted"

        );

    }

    product.isDeleted = true;

    product.deletedAt = new Date();

    await product.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product deleted successfully"

        )

    );

});

const restoreProduct = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {

        throw new ApiError(

            404,

            "Product not found"

        );

    }

    product.isDeleted = false;

    product.deletedAt = null;

    await product.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product restored successfully",

            product

        )

    );

});


module.exports = {

    createProduct,

    getAllProducts,

    getProductById,

    updateProduct,

    deleteProduct,

    restoreProduct,

};