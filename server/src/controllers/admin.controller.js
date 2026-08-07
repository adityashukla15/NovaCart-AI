const User = require("../models/user.model");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Order = require("../models/order.model");
const Review = require("../models/review.model");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");


const getDashboard = asyncHandler(async (req, res) => {

    // Counts

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments({
        isDeleted: false,
    });

    const totalCategories = await Category.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalReviews = await Review.countDocuments();

    // Revenue

    const revenue = await Order.aggregate([

        {
            $match: {
                paymentStatus: "Paid",
            },
        },

        {
            $group: {
                _id: null,
                total: {
                    $sum: "$totalAmount",
                },
            },
        },

    ]);

    const totalRevenue = revenue[0]?.total || 0;

    // Recent Orders

    const recentOrders = await Order.find()

        .populate("user", "name email")

        .sort({ createdAt: -1 })

        .limit(5);

    // Top Products

    const topProducts = await Product.find({

        isDeleted: false,

    })

        .sort({ totalReviews: -1 })

        .limit(5);

    // Low Stock

    const lowStockProducts = await Product.find({

        stock: {
            $lt: 10,
        },

        isDeleted: false,

    }).limit(5);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Dashboard fetched successfully",

            {

                totalUsers,

                totalProducts,

                totalCategories,

                totalOrders,

                totalRevenue,

                totalReviews,

                recentOrders,

                topProducts,

                lowStockProducts,

            }

        )

    );

});

const getMonthlySales = asyncHandler(async (req, res) => {

    const sales = await Order.aggregate([

        {
            $match: {
                paymentStatus: "Paid",
            },
        },

        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },

                revenue: {
                    $sum: "$totalAmount",
                },

                orders: {
                    $sum: 1,
                },
            },
        },

        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },

    ]);

    return res.status(200).json(

        new ApiResponse(
            200,
            "Monthly sales fetched",
            sales
        )

    );

});


const getOrderStatusAnalytics = asyncHandler(async (req, res) => {

    const data = await Order.aggregate([

        {
            $group: {

                _id: "$orderStatus",

                total: {
                    $sum: 1,
                },

            },
        },

    ]);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Order analytics",

            data

        )

    );

});


const getCategorySales = asyncHandler(async (req, res) => {

    const data = await Order.aggregate([

        {
            $unwind: "$items",
        },

        {
            $lookup: {

                from: "products",

                localField: "items.product",

                foreignField: "_id",

                as: "product",

            },

        },

        {
            $unwind: "$product",
        },

        {
            $lookup: {

                from: "categories",

                localField: "product.category",

                foreignField: "_id",

                as: "category",

            },

        },

        {
            $unwind: "$category",
        },

        {
            $group: {

                _id: "$category.name",

                revenue: {

                    $sum: "$items.subtotal",

                },

                sold: {

                    $sum: "$items.quantity",

                },

            },

        },

        {
            $sort: {

                revenue: -1,

            },

        },

    ]);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Category sales",

            data

        )

    );

});


const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Users fetched successfully",

            users

        )

    );

});


const updateUserRole = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {

        throw new ApiError(400, "Invalid role");

    }

    const user = await User.findByIdAndUpdate(

        id,

        { role },

        { new: true }

    ).select("-password");

    if (!user) {

        throw new ApiError(404, "User not found");

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            "Role updated successfully",

            user

        )

    );

});

const toggleUserStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {

        throw new ApiError(404, "User not found");

    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            `User ${user.isBlocked ? "Blocked" : "Unblocked"} Successfully`,

            user

        )

    );

});

const getAllOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find()

        .populate("user", "name email")

        .sort({ createdAt: -1 });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Orders fetched successfully",

            orders

        )

    );

});

const updateOrderStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { status } = req.body;

    const allowed = [

        "Pending",

        "Confirmed",

        "Packed",

        "Shipped",

        "Delivered",

        "Cancelled",

    ];

    if (!allowed.includes(status)) {

        throw new ApiError(

            400,

            "Invalid Order Status"

        );

    }

    const order = await Order.findById(id);

    if (!order) {

        throw new ApiError(

            404,

            "Order not found"

        );

    }

    order.orderStatus = status;

    await order.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Order Updated Successfully",

            order

        )

    );

});


const getAdminProducts = asyncHandler(async (req, res) => {

    const products = await Product.find()

        .populate("category", "name")

        .sort({ createdAt: -1 });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Products fetched",

            products

        )

    );

});


const toggleFeaturedProduct = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {

        throw new ApiError(

            404,

            "Product not found"

        );

    }

    product.isFeatured = !product.isFeatured;

    await product.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            product.isFeatured

                ? "Product Featured"

                : "Product Removed From Featured",

            product

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

            "Product Restored",

            product

        )

    );

});

module.exports = {
    getDashboard,getMonthlySales,getOrderStatusAnalytics,getCategorySales,getAllUsers,updateUserRole,toggleUserStatus,getAllOrders,updateOrderStatus,getAdminProducts,toggleFeaturedProduct,restoreProduct
};