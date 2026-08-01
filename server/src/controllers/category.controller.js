const Category=require('../models/category.model')

const ApiError=require('../utils/apiError')
const ApiResponse=require('../utils/apiResponse')
const asyncHandler=require('../utils/asyncHandler')

const createCategory = asyncHandler(async (req, res) => {

    const { name, image } = req.body;

    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    const existingCategory = await Category.findOne({ slug });

    if (existingCategory) {
        throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({
        name,
        slug,
        image,
        createdBy: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Category created successfully",
            category
        )
    );

});


// GET ALL CATEGORIES
const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Categories fetched successfully",
            categories
        )
    );

});


// GET CATEGORY BY ID
const getCategoryById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const category = await Category.findById(id)
        .populate("createdBy", "name email");

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category fetched successfully",
            category
        )
    );

});


// UPDATE CATEGORY
const updateCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const updateData = { ...req.body };

    if (updateData.name) {
        updateData.slug = updateData.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");
    }

    const category = await Category.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category updated successfully",
            category
        )
    );

});


// DELETE CATEGORY
const deleteCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category deleted successfully"
        )
    );

});


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};

