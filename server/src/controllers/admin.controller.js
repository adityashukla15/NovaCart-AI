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
    orderStatus: { $ne: "Cancelled" },
}
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


const getOrderAnalytics = asyncHandler(async (req, res) => {

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

    const { userId } = req.params;
    const { role } = req.body;

    // Check user ID
    if (!userId) {
        throw new ApiError(
            400,
            "User ID is required"
        );
    }

    // Check role
    if (!role) {
        throw new ApiError(
            400,
            "Role is required"
        );
    }

    // Validate role
    if (!["user", "admin"].includes(role)) {
        throw new ApiError(
            400,
            "Invalid role"
        );
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
        userId,
        {
            role: role,
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");

    // User not found
    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
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

// ======================================
// UPDATE RETURN STATUS (ADMIN)
// ======================================
const updatePaymentStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { paymentStatus } = req.body;

    const allowed = [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
    ];

    if (!allowed.includes(paymentStatus)) {
        throw new ApiError(
            400,
            "Invalid payment status"
        );
    }

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Payment status updated successfully",
            order
        )
    );

});

const updateReturnStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { returnStatus } = req.body;

    const allowedStatuses = [
        "Approved",
        "Rejected",
    ];

    if (!allowedStatuses.includes(returnStatus)) {
        throw new ApiError(
            400,
            "Invalid return status"
        );
    }

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (order.returnStatus !== "Requested") {
        throw new ApiError(
            400,
            "No pending return request"
        );
    }

    if (returnStatus === "Approved") {

        order.returnStatus = "Approved";

        order.refundStatus = "Pending";

        order.refundAmount =
            order.totalAmount;

    }

    if (returnStatus === "Rejected") {

        order.returnStatus = "Rejected";

        order.refundStatus =
            "Not Applicable";

        order.refundAmount = 0;

    }

    await order.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            `Return request ${returnStatus.toLowerCase()} successfully`,
            order
        )
    );

});

// ======================================
// PROCESS REFUND (ADMIN)
// ======================================

const processRefund = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (order.returnStatus !== "Approved") {
        throw new ApiError(
            400,
            "Return must be approved first"
        );
    }

    if (order.refundStatus === "Processed") {
        throw new ApiError(
            400,
            "Refund is already processed"
        );
    }

    order.refundStatus = "Processed";

    order.returnStatus = "Refunded";

    await order.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Refund processed successfully",
            order
        )
    );

});

module.exports = {
    getDashboard,getMonthlySales,getOrderAnalytics,getCategorySales,getAllUsers,updateUserRole,toggleUserStatus,getAllOrders,updateOrderStatus,getAdminProducts,toggleFeaturedProduct,restoreProduct,updateReturnStatus,processRefund,updatePaymentStatus,
};