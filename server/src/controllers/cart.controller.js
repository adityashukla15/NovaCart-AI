const Cart=require("../models/cart.model");
const Product = require("../models/product.model");

const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");


const addToCart = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    // Check Product Exists
    const product = await Product.findById(productId);

    if (!product) {

        throw new ApiError(404, "Product not found");

    }

    // Check Stock
    if (product.stock <= 0) {

        throw new ApiError(400, "Product is out of stock");

    }

    // Find User Cart
    let cart = await Cart.findOne({

        user: req.user._id

    });

    // Create New Cart
    if (!cart) {

        cart = await Cart.create({

            user: req.user._id,

            items: [

                {

                    product: productId,

                    quantity: 1,

                }

            ]

        });

    }

    else {

        const itemIndex = cart.items.findIndex(

            item => item.product.toString() === productId

        );

        if (itemIndex > -1) {

            if (cart.items[itemIndex].quantity >= product.stock) {

                throw new ApiError(

                    400,

                    `Only ${product.stock} item(s) available`

                );

            }

            cart.items[itemIndex].quantity += 1;

        }

        else {

            cart.items.push({

                product: productId,

                quantity: 1,

            });

        }

        await cart.save();

    }

    const populatedCart = await Cart.findById(cart._id)

        .populate("items.product")

        .populate("user", "name email");

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product added to cart",

            populatedCart

        )

    );

});

const getCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user._id,
    })
        .populate("items.product")
        .populate("user", "name email");

    if (!cart) {
        return res.status(200).json(
            new ApiResponse(200, "Cart is empty", {
                items: [],
                totalItems: 0,
                subtotal: 0,
            })
        );
    }

    let subtotal = 0;
    let totalItems = 0;

    cart.items.forEach(item => {

        subtotal += item.product.price * item.quantity;

        totalItems += item.quantity;

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Cart fetched successfully",

            {

                cart,

                subtotal,

                totalItems,

            }

        )

    );

});

const updateCartQuantity = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const { quantity } = req.body;

    if (!quantity || quantity < 1) {

        throw new ApiError(400, "Quantity must be greater than 0");

    }

    const cart = await Cart.findOne({

        user: req.user._id

    });

    if (!cart) {

        throw new ApiError(404, "Cart not found");

    }

    const item = cart.items.find(

        item => item.product.toString() === productId

    );

    if (!item) {

        throw new ApiError(404, "Product not found in cart");

    }

    const product = await Product.findById(productId);

    if (quantity > product.stock) {

        throw new ApiError(

            400,

            `Only ${product.stock} item(s) available`

        );

    }

    item.quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)

        .populate("items.product")

        .populate("user", "name email");

    return res.status(200).json(

        new ApiResponse(

            200,

            "Cart updated successfully",

            updatedCart

        )

    );

});


const removeFromCart = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const cart = await Cart.findOne({

        user: req.user._id

    });

    if (!cart) {

        throw new ApiError(404, "Cart not found");

    }

    cart.items = cart.items.filter(

        item => item.product.toString() !== productId

    );

    await cart.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product removed from cart",

            cart

        )

    );

});

const clearCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({

        user: req.user._id

    });

    if (!cart) {

        throw new ApiError(404, "Cart not found");

    }

    cart.items = [];

    await cart.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Cart cleared successfully"

        )

    );

});

module.exports = { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart };