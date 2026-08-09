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

    // ==========================================
    // 1. GET CART
    // ==========================================

    const cart = await Cart.findOne({
        user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }


    // ==========================================
    // 2. GET DEFAULT ADDRESS
    // ==========================================

    const address = await Address.findOne({
        user: req.user._id,
        isDefault: true,
    });

    if (!address) {
        throw new ApiError(404, "Default address not found");
    }


    // ==========================================
    // 3. CALCULATE CART TOTAL
    // ==========================================

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

        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `${product.title} has only ${product.stock} item(s) left`
            );
        }

        const itemSubtotal =
            product.price * item.quantity;

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


    // ==========================================
    // 4. APPLY COUPON
    // ==========================================

    let discount = 0;

    let appliedCouponCode = "";

    if (couponCode) {

        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase().trim(),
        });

        if (!coupon) {
            throw new ApiError(
                404,
                "Invalid coupon code"
            );
        }


        // Active
        if (!coupon.isActive) {
            throw new ApiError(
                400,
                "Coupon is inactive"
            );
        }


        // Expiry
        if (
            new Date() >
            new Date(coupon.expiryDate)
        ) {
            throw new ApiError(
                400,
                "Coupon has expired"
            );
        }


        // Usage limit
        if (
            coupon.usageLimit > 0 &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            throw new ApiError(
                400,
                "Coupon usage limit reached"
            );
        }


        // Minimum order
        if (
            subtotal < coupon.minOrderAmount
        ) {
            throw new ApiError(
                400,
                `Minimum order amount should be ₹${coupon.minOrderAmount}`
            );
        }


        // ======================================
        // CALCULATE DISCOUNT
        // ======================================

        if (
            coupon.discountType === "percentage"
        ) {

            discount =
                (subtotal * coupon.discountValue) /
                100;

            if (
                coupon.maxDiscount > 0 &&
                discount > coupon.maxDiscount
            ) {
                discount = coupon.maxDiscount;
            }

        } else {

            discount = coupon.discountValue;

        }


        // Discount cannot exceed subtotal

        if (discount > subtotal) {
            discount = subtotal;
        }

        discount = Math.round(discount);

        appliedCouponCode = coupon.code;
    }


    // ==========================================
    // 5. FINAL AMOUNT
    // ==========================================

    const totalAmount =
        subtotal - discount;


    // ==========================================
    // 6. GENERATE ORDER ID
    // ==========================================

    const orderId =
        `NC-${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000
        )}`;


    // ==========================================
    // 7. CREATE ORDER
    // ==========================================

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


    // ==========================================
    // 8. REDUCE STOCK
    // ==========================================

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


    // ==========================================
    // 9. INCREASE COUPON USAGE
    // ==========================================

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


    // ==========================================
    // 10. CLEAR CART
    // ==========================================

    cart.items = [];

    await cart.save();


    // ==========================================
    // 11. CREATE NOTIFICATION
    // ==========================================

    await createNotification({

        user: req.user._id,

        title: "Order Placed 🎉",

        message:
            `Your order ${order.orderId} has been placed successfully.`,

        type: "order",

        relatedOrder: order._id,

    });


    // ==========================================
    // 12. POPULATE ORDER
    // ==========================================

    const populatedOrder =
        await Order.findById(order._id)
            .populate("user", "name email");


    // ==========================================
    // 13. RESPONSE
    // ==========================================

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

    })
        .sort({
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

    })
        .populate("items.product");


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
// UPDATE ORDER STATUS (ADMIN)
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


    const currentStatus = order.orderStatus;


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

        Pending: [
            "Confirmed",
        ],

        Confirmed: [
            "Packed",
        ],

        Packed: [
            "Shipped",
        ],

        Shipped: [
            "Delivered",
        ],

        Delivered: [],

        Cancelled: [],

    };


    if (
        !validTransitions[currentStatus].includes(
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
// DELETE ORDER (ADMIN)
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
// CANCEL ORDER (USER)
// ======================================

const cancelOrder = asyncHandler(async (req, res) => {

    const { id } = req.params;


    // ==========================================
    // FIND USER'S ORDER
    // ==========================================

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


    // ==========================================
    // ALREADY CANCELLED
    // ==========================================

    if (order.orderStatus === "Cancelled") {

        throw new ApiError(
            400,
            "Order is already cancelled"
        );

    }


    // ==========================================
    // CANNOT CANCEL SHIPPED / DELIVERED
    // ==========================================

    if (
        order.orderStatus === "Shipped" ||
        order.orderStatus === "Delivered"
    ) {

        throw new ApiError(
            400,
            "Order cannot be cancelled at this stage"
        );

    }


    // ==========================================
    // RESTORE PRODUCT STOCK
    // ==========================================

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


    // ==========================================
    // ROLLBACK COUPON USAGE
    // ==========================================

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


    // ==========================================
    // UPDATE ORDER
    // ==========================================

    order.orderStatus = "Cancelled";

    await order.save();


    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    await createNotification({

        user: req.user._id,

        title: "Order Cancelled ❌",

        message:
            `Your order ${order.orderId} has been cancelled successfully.`,

        type: "cancel",

        relatedOrder: order._id,

    });


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json(

        new ApiResponse(

            200,

            "Order cancelled successfully",

            order

        )

    );

});


// ======================================
// REQUEST RETURN (USER)
// ======================================

const requestReturn = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { reason } = req.body;


    // ==========================================
    // VALIDATE REASON
    // ==========================================

    if (!reason || !reason.trim()) {

        throw new ApiError(
            400,
            "Return reason is required"
        );

    }


    // ==========================================
    // FIND ORDER
    // ==========================================

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


    // ==========================================
    // ONLY DELIVERED ORDERS
    // ==========================================

    if (order.orderStatus !== "Delivered") {

        throw new ApiError(
            400,
            "Only delivered orders can be returned"
        );

    }


    // ==========================================
    // CHECK EXISTING RETURN
    // ==========================================

    if (
        order.returnStatus !== "Not Requested"
    ) {

        throw new ApiError(
            400,
            "Return has already been requested"
        );

    }


    // ==========================================
    // UPDATE RETURN
    // ==========================================

    order.returnStatus = "Requested";

    order.returnReason = reason.trim();

    order.refundStatus = "Pending";

    order.refundAmount = order.totalAmount;


    await order.save();


    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    await createNotification({

        user: req.user._id,

        title: "Return Requested ↩️",

        message:
            `Your return request for order ${order.orderId} has been submitted successfully.`,

        type: "return",

        relatedOrder: order._id,

    });


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json(

        new ApiResponse(

            200,

            "Return request submitted successfully",

            order

        )

    );

});


module.exports = {

    createOrder,

    getMyOrders,

    getOrderById,

    cancelOrder,

    updateOrderStatus,

    deleteOrder,

    requestReturn,

};