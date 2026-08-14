const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Address = require("../models/address.model");
const Coupon = require("../models/coupon.model");

const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createNotification = require("../utils/createNotfication");

// ======================================
// CREATE ORDER
// ======================================

const createOrder = asyncHandler(async (req, res) => {
    const { couponCode } = req.body;

    // ======================================
    // 1. GET CART
    // ======================================

    const cart = await Cart.findOne({
        user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    // ======================================
    // 2. GET DEFAULT ADDRESS
    // ======================================

    const address = await Address.findOne({
        user: req.user._id,
        isDefault: true,
    });

    if (!address) {
        throw new ApiError(
            404,
            "Default address not found. Please add an address first."
        );
    }

    // ======================================
    // 3. CALCULATE CART TOTAL
    // ======================================

    let subtotal = 0;

    const orderItems = [];

    for (const item of cart.items) {
        const product = await Product.findById(
            item.product._id
        );

        if (!product) {
            throw new ApiError(
                404,
                `${item.product.title} not found`
            );
        }

        // Check stock
        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `${product.title} has only ${product.stock} item(s) left`
            );
        }

        // Use actual product price from DB
        const itemSubtotal =
            Number(product.price) * Number(item.quantity);

        orderItems.push({
            product: product._id,
            title: product.title,
            slug: product.slug,
            image: product.images?.[0] || "",
            price: product.price,
            quantity: item.quantity,
            subtotal: itemSubtotal,
        });

        subtotal += itemSubtotal;
    }

    subtotal = Math.round(subtotal);

    // ======================================
    // 4. APPLY COUPON
    // ======================================

    let discount = 0;
    let appliedCouponCode = "";

    // Normalize coupon code
    const normalizedCouponCode =
        typeof couponCode === "string"
            ? couponCode.trim().toUpperCase()
            : "";

    // Only validate coupon if a coupon was actually sent
    if (normalizedCouponCode) {
        const coupon = await Coupon.findOne({
            code: normalizedCouponCode,
        });

        // --------------------------------------
        // Coupon does not exist
        // --------------------------------------

        if (!coupon) {
            throw new ApiError(
                404,
                "Invalid coupon code"
            );
        }

        // --------------------------------------
        // Active check
        // --------------------------------------

        if (!coupon.isActive) {
            throw new ApiError(
                400,
                "Coupon is inactive"
            );
        }

        // --------------------------------------
        // Expiry check
        // --------------------------------------

        if (
            !coupon.expiryDate ||
            new Date() > new Date(coupon.expiryDate)
        ) {
            throw new ApiError(
                400,
                "Coupon has expired"
            );
        }

        // --------------------------------------
        // Usage limit
        // --------------------------------------

        if (
            coupon.usageLimit > 0 &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            throw new ApiError(
                400,
                "Coupon usage limit reached"
            );
        }

        // --------------------------------------
        // Minimum order amount
        // --------------------------------------

        if (
            subtotal <
            Number(coupon.minOrderAmount || 0)
        ) {
            throw new ApiError(
                400,
                `Minimum order amount should be ₹${coupon.minOrderAmount}`
            );
        }

        // --------------------------------------
        // Calculate discount
        // --------------------------------------

        if (
            coupon.discountType === "percentage"
        ) {
            discount =
                (subtotal *
                    Number(coupon.discountValue)) /
                100;

            // Maximum discount
            if (
                Number(coupon.maxDiscount) > 0 &&
                discount >
                    Number(coupon.maxDiscount)
            ) {
                discount = Number(
                    coupon.maxDiscount
                );
            }
        } else if (
            coupon.discountType === "fixed"
        ) {
            discount = Number(
                coupon.discountValue
            );
        } else {
            throw new ApiError(
                400,
                "Invalid coupon discount type"
            );
        }

        // Discount cannot be greater than subtotal
        if (discount > subtotal) {
            discount = subtotal;
        }

        discount = Math.round(discount);

        appliedCouponCode = coupon.code;
    }

    // ======================================
    // 5. FINAL AMOUNT
    // ======================================

    const totalAmount =
        subtotal - discount;

    // ======================================
    // 6. GENERATE ORDER ID
    // ======================================

    const orderId =
        `NC-${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000
        )}`;

    // ======================================
    // 7. CREATE ORDER
    // ======================================

    const order = await Order.create({
        orderId,

        user: req.user._id,

        items: orderItems,

        shippingAddress: {
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
        },

        subtotal,

        discount,

        couponCode: appliedCouponCode,

        totalAmount,

        paymentMethod: "COD",

        paymentStatus: "Pending",

        orderStatus: "Pending",
    });
    

    // ======================================
    // 8. REDUCE PRODUCT STOCK
    // ======================================

    for (const item of cart.items) {
        await Product.findByIdAndUpdate(
            item.product._id,
            {
                $inc: {
                    stock: -item.quantity,
                },
            }
        );
    }

    // ======================================
    // 9. INCREASE COUPON USAGE
    // ======================================

    if (appliedCouponCode) {
        await Coupon.findOneAndUpdate(
            {
                code: appliedCouponCode,
            },
            {
                $inc: {
                    usedCount: 1,
                },
            }
        );
    }

    // ======================================
    // 10. CLEAR CART
    // ======================================

    cart.items = [];

    await cart.save();

    // ======================================
    // 11. CREATE NOTIFICATION
    // ======================================

    await createNotification({
        user: req.user._id,

        title: "Order Placed 🎉",

        message:
            `Your order ${order.orderId} has been placed successfully.`,

        type: "order",

        relatedOrder: order._id,
    });

    // ======================================
    // 12. POPULATE ORDER
    // ======================================

    const populatedOrder =
        await Order.findById(order._id)
            .populate("user", "name email");

    // ======================================
    // 13. RESPONSE
    // ======================================

    return res.status(201).json(
        new ApiResponse(
            201,
            "Order placed successfully",
            populatedOrder
        )
    );
});

// ======================================
// GET MY ORDERS
// ======================================

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        user: req.user._id,
    }).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Orders fetched successfully",
            orders
        )
    );
});

// ======================================
// GET ORDER BY ID
// ======================================

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({
        _id: id,
        user: req.user._id,
    }).populate("items.product");

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Order fetched successfully",
            order
        )
    );
});

// ======================================
// UPDATE ORDER STATUS - ADMIN
// ======================================

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // ======================================
    // ALLOWED STATUS
    // ======================================

    const allowedStatus = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];

    if (!allowedStatus.includes(orderStatus)) {
        throw new ApiError(
            400,
            "Invalid order status"
        );
    }

    // ======================================
    // FIND ORDER
    // ======================================

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    const currentStatus =
        order.orderStatus;

    // ======================================
    // SAME STATUS
    // ======================================

    if (currentStatus === orderStatus) {
        throw new ApiError(
            400,
            `Order is already ${currentStatus}`
        );
    }

    // ======================================
    // CANCELLED ORDER
    // ======================================

    if (currentStatus === "Cancelled") {
        throw new ApiError(
            400,
            "Cancelled order cannot be updated"
        );
    }

    // ======================================
    // DELIVERED ORDER
    // ======================================

    if (currentStatus === "Delivered") {
        throw new ApiError(
            400,
            "Delivered order cannot be updated"
        );
    }

    // ======================================
    // VALID STATUS TRANSITIONS
    // ======================================

    const validTransitions = {
        Pending: ["Confirmed"],
        Confirmed: ["Packed"],
        Packed: ["Shipped"],
        Shipped: ["Delivered"],
        Delivered: [],
        Cancelled: [],
    };

    if (
        !validTransitions[currentStatus]?.includes(
            orderStatus
        )
    ) {
        throw new ApiError(
            400,
            `Cannot change order status from ${currentStatus} to ${orderStatus}`
        );
    }

    // ======================================
    // UPDATE STATUS
    // ======================================

    order.orderStatus = orderStatus;

    await order.save();

    // ======================================
    // STATUS NOTIFICATION
    // ======================================

    let notificationTitle =
        "Order Status Updated";

    let notificationMessage =
        `Your order ${order.orderId} is now ${orderStatus}.`;

    let notificationType = "order";

    if (orderStatus === "Confirmed") {
        notificationTitle =
            "Order Confirmed ✅";

        notificationMessage =
            `Your order ${order.orderId} has been confirmed.`;
    }

    if (orderStatus === "Packed") {
        notificationTitle =
            "Order Packed 📦";

        notificationMessage =
            `Your order ${order.orderId} has been packed and is ready for shipping.`;
    }

    if (orderStatus === "Shipped") {
        notificationTitle =
            "Order Shipped 🚚";

        notificationMessage =
            `Your order ${order.orderId} has been shipped and is on the way.`;

        notificationType = "shipping";
    }

    if (orderStatus === "Delivered") {
        notificationTitle =
            "Order Delivered 🎉";

        notificationMessage =
            `Your order ${order.orderId} has been delivered successfully.`;

        notificationType = "delivery";
    }

    await createNotification({
        user: order.user,

        title: notificationTitle,

        message: notificationMessage,

        type: notificationType,

        relatedOrder: order._id,
    });

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json(
        new ApiResponse(
            200,
            "Order status updated successfully",
            order
        )
    );
});

// ======================================
// DELETE ORDER - ADMIN
// ======================================

const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    await order.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Order deleted successfully"
        )
    );
});

// ======================================
// CANCEL ORDER - USER
// ======================================

const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // ======================================
    // FIND USER'S ORDER
    // ======================================

    const order = await Order.findOne({
        _id: id,
        user: req.user._id,
    });

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    // ======================================
    // ALREADY CANCELLED
    // ======================================

    if (order.orderStatus === "Cancelled") {
        throw new ApiError(
            400,
            "Order is already cancelled"
        );
    }

    // ======================================
    // CANNOT CANCEL SHIPPED / DELIVERED
    // ======================================

    if (
        order.orderStatus === "Shipped" ||
        order.orderStatus === "Delivered"
    ) {
        throw new ApiError(
            400,
            "Order cannot be cancelled at this stage"
        );
    }

    // ======================================
    // RESTORE PRODUCT STOCK
    // ======================================

    for (const item of order.items) {
        await Product.findByIdAndUpdate(
            item.product,
            {
                $inc: {
                    stock: item.quantity,
                },
            }
        );
    }

    // ======================================
    // ROLLBACK COUPON USAGE
    // ======================================

    if (order.couponCode) {
        await Coupon.findOneAndUpdate(
            {
                code: order.couponCode,
                usedCount: {
                    $gt: 0,
                },
            },
            {
                $inc: {
                    usedCount: -1,
                },
            }
        );
    }

    // ======================================
    // UPDATE ORDER
    // ======================================

    order.orderStatus = "Cancelled";

    await order.save();

    // ======================================
    // CREATE NOTIFICATION
    // ======================================

    await createNotification({
        user: req.user._id,

        title: "Order Cancelled ❌",

        message:
            `Your order ${order.orderId} has been cancelled successfully.`,

        type: "cancel",

        relatedOrder: order._id,
    });

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json(
        new ApiResponse(
            200,
            "Order cancelled successfully",
            order
        )
    );
});

// ======================================
// REQUEST RETURN - USER
// ======================================

// ======================================
// REQUEST RETURN / EXCHANGE - USER
// ======================================

const requestReturn = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const {
        reason,
        description,
        returnType = "Return",
    } = req.body;


    // ======================================
    // VALIDATE RETURN TYPE
    // ======================================

    if (!["Return", "Exchange"].includes(returnType)) {

        throw new ApiError(
            400,
            "Invalid return type"
        );

    }


    // ======================================
    // VALIDATE REASON
    // ======================================

    if (!reason || !reason.trim()) {

        throw new ApiError(
            400,
            "Return reason is required"
        );

    }


    // ======================================
    // FIND ORDER
    // ======================================

    const order = await Order.findOne({
        _id: id,
        user: req.user._id,
    });


    if (!order) {

        throw new ApiError(
            404,
            "Order not found"
        );

    }


    // ======================================
    // ONLY DELIVERED ORDERS
    // ======================================

    if (order.orderStatus !== "Delivered") {

        throw new ApiError(
            400,
            "Only delivered orders can be returned or exchanged"
        );

    }


    // ======================================
    // CHECK EXISTING REQUEST
    // ======================================

    if (
        order.returnStatus &&
        order.returnStatus !== "Not Requested" &&
        order.returnStatus !== "Rejected"
    ) {

        throw new ApiError(
            400,
            "Return or exchange request already exists"
        );

    }


    // ======================================
    // UPDATE RETURN
    // ======================================

    order.returnStatus = "Requested";

    order.returnType = returnType;

    order.returnReason = reason.trim();

    order.returnDescription =
        description?.trim() || "";

    order.refundAmount =
        returnType === "Return"
            ? order.totalAmount
            : 0;

    order.refundStatus =
        returnType === "Return"
            ? "Pending"
            : "Not Applicable";

    order.returnRequestedAt = new Date();

    // Reset old timestamps if request was rejected earlier

    order.returnAcceptedAt = null;

    order.returnedAt = null;

    order.refundInitiatedAt = null;

    order.refundCompletedAt = null;

    order.exchangedAt = null;

    order.returnRejectedAt = null;


    await order.save();


    // ======================================
    // NOTIFICATION
    // ======================================

    await createNotification({

        user: req.user._id,

        title: `${returnType} Request Submitted ↩️`,

        message:
            `Your ${returnType.toLowerCase()} request for order ${order.orderId} has been submitted successfully.`,

        type: "return",

        relatedOrder: order._id,

    });


    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json(

        new ApiResponse(

            200,

            `${returnType} request submitted successfully`,

            order

        )

    );

});

// ======================================
// EXPORT
// ======================================

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    deleteOrder,
    requestReturn,
};