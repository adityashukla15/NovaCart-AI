const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Address = require("../models/address.model");

const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ======================================
// CREATE ORDER
// ======================================

const createOrder = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const address = await Address.findOne({
        user: req.user._id,
        isDefault: true,
    });

    if (!address) {
        throw new ApiError(404, "Default address not found");
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {

        const product = await Product.findById(item.product._id);

        if (!product) {
            throw new ApiError(404, `${item.product.title} not found`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `${product.title} has only ${product.stock} item(s) left`
            );
        }

        const subtotal = product.price * item.quantity;

        orderItems.push({

            product: product._id,

            title: product.title,

            slug: product.slug,

            image: product.images?.[0] || "",

            price: product.price,

            quantity: item.quantity,

            subtotal,

        });

        totalAmount += subtotal;
    }

    const orderId = `NC-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
    )}`;

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

        totalAmount,

        paymentMethod: "COD",

        paymentStatus: "Paid",

        orderStatus: "Pending",

    });

    // Reduce Stock
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

    // Clear Cart
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
        .populate("user", "name email");

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

        throw new ApiError(404, "Order not found");

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

    const allowedStatus = [

        "Pending",

        "Confirmed",

        "Packed",

        "Shipped",

        "Delivered",

        "Cancelled",

    ];

    if (!allowedStatus.includes(orderStatus)) {

        throw new ApiError(400, "Invalid order status");

    }

    const order = await Order.findById(id);

    if (!order) {

        throw new ApiError(404, "Order not found");

    }

    order.orderStatus = orderStatus;

    await order.save();

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

        throw new ApiError(404, "Order not found");

    }

    await order.deleteOne();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Order deleted successfully"

        )

    );

});

module.exports = {

    createOrder,

    getMyOrders,

    getOrderById,

    updateOrderStatus,

    deleteOrder,

};