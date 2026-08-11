import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingCart,
    ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";

import {
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
} from "../services/cartApi";

const Cart = () => {
    const navigate = useNavigate();

    // ======================================
    // STATES
    // ======================================

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updating, setUpdating] = useState(null);
    const [removing, setRemoving] = useState(null);
    const [clearing, setClearing] = useState(false);

    // ======================================
    // GET CART
    // ======================================

    useEffect(() => {
        let isMounted = true;

        const loadCart = async () => {
            try {
                setError("");

                const response = await getCart();

                console.log("Cart Response:", response.data);

                if (!isMounted) return;

                setCart(
                    response.data?.data || {
                        items: [],
                        totalItems: 0,
                        subtotal: 0,
                    }
                );
            } catch (error) {
                console.error("GET CART ERROR:", error);

                if (!isMounted) return;

                const message =
                    error.response?.data?.message ||
                    "Failed to load cart";

                setError(message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadCart();

        return () => {
            isMounted = false;
        };
    }, []);

    // ======================================
    // REFRESH CART
    // ======================================

    const fetchCart = async () => {
        try {
            setError("");

            const response = await getCart();

            console.log("Updated Cart:", response.data);

            setCart(
                response.data?.data || {
                    items: [],
                    totalItems: 0,
                    subtotal: 0,
                }
            );
        } catch (error) {
            console.error("REFRESH CART ERROR:", error);

            const message =
                error.response?.data?.message ||
                "Failed to refresh cart";

            setError(message);
            toast.error(message);
        }
    };

    // ======================================
    // UPDATE QUANTITY
    // ======================================

    const handleQuantityChange = async (
        productId,
        currentQuantity,
        change,
        stock
    ) => {
        const newQuantity = currentQuantity + change;

        // Minimum quantity
        if (newQuantity < 1) {
            return;
        }

        // Maximum stock
        if (newQuantity > stock) {
            toast.error(`Only ${stock} item(s) available`);
            return;
        }

        try {
            setUpdating(productId);

            await updateCartQuantity(
                productId,
                newQuantity
            );

            await fetchCart();
        } catch (error) {
            console.error(
                "UPDATE CART ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to update quantity"
            );
        } finally {
            setUpdating(null);
        }
    };

    // ======================================
    // REMOVE PRODUCT
    // ======================================

    const handleRemove = async (productId) => {
        try {
            setRemoving(productId);

            await removeFromCart(productId);

            await fetchCart();

            toast.success("Product removed from cart");
        } catch (error) {
            console.error(
                "REMOVE CART ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to remove product"
            );
        } finally {
            setRemoving(null);
        }
    };

    // ======================================
    // CLEAR CART
    // ======================================

    const handleClearCart = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to clear your cart?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setClearing(true);

            await clearCart();

            await fetchCart();

            toast.success("Cart cleared successfully");
        } catch (error) {
            console.error(
                "CLEAR CART ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to clear cart"
            );
        } finally {
            setClearing(false);
        }
    };

    // ======================================
    // LOADING
    // ======================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-gray-600">
                        Loading cart...
                    </p>
                </div>
            </div>
        );
    }

    // ======================================
    // ERROR
    // ======================================

    if (error && !cart) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="text-center">
                    <p className="mb-4 text-red-500">
                        {error}
                    </p>

                    <Button onClick={fetchCart}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // ======================================
    // CART DATA
    // ======================================

    const items =
        cart?.cart?.items ||
        cart?.items ||
        [];

    const subtotal =
        cart?.subtotal || 0;

    const totalItems =
        cart?.totalItems ||
        items.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    // ======================================
    // EMPTY CART
    // ======================================

    if (items.length === 0) {
        return (
            <div className="min-h-screen px-6 py-16">
                <div className="mx-auto max-w-3xl text-center">
                    <ShoppingCart
                        size={70}
                        className="mx-auto text-gray-300"
                    />

                    <h1 className="mt-6 text-3xl font-bold">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <Link to="/shop">
                        <Button className="mt-8">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // ======================================
    // MAIN UI
    // ======================================

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Shopping Cart
                        </h1>

                        <p className="mt-2 text-gray-500">
                            {totalItems} item
                            {totalItems !== 1
                                ? "s"
                                : ""}{" "}
                            in your cart
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClearCart}
                        disabled={clearing}
                        className="flex w-fit items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Trash2 size={17} />

                        {clearing
                            ? "Clearing..."
                            : "Clear Cart"}
                    </button>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* CART CONTENT */}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* CART ITEMS */}

                    <div className="space-y-4 lg:col-span-2">

                        {items.map((item) => {
                            const product =
                                item.product;

                            if (!product) {
                                return null;
                            }

                            const image =
                                product.images?.[0] ||
                                "https://via.placeholder.com/300x300?text=No+Image";

                            const price =
                                product.discountPrice ||
                                product.price;

                            const itemTotal =
                                price *
                                item.quantity;

                            return (
                                <div
                                    key={product._id}
                                    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
                                >

                                    {/* IMAGE */}

                                    <Link
                                        to={`/products/${product._id}`}
                                        className="shrink-0"
                                    >
                                        <img
                                            src={image}
                                            alt={
                                                product.title
                                            }
                                            className="h-32 w-full rounded-xl object-cover sm:w-32"
                                        />
                                    </Link>

                                    {/* DETAILS */}

                                    <div className="flex flex-1 flex-col">

                                        <div className="flex items-start justify-between gap-4">

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    {
                                                        product.brand
                                                    }
                                                </p>

                                                <Link
                                                    to={`/products/${product._id}`}
                                                >
                                                    <h2 className="mt-1 text-lg font-semibold hover:underline">
                                                        {
                                                            product.title
                                                        }
                                                    </h2>
                                                </Link>
                                            </div>

                                            {/* REMOVE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(
                                                        product._id
                                                    )
                                                }
                                                disabled={
                                                    removing ===
                                                    product._id
                                                }
                                                className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                            >
                                                {removing ===
                                                product._id ? (
                                                    <span className="block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
                                                ) : (
                                                    <Trash2
                                                        size={19}
                                                    />
                                                )}
                                            </button>
                                        </div>

                                        {/* PRICE */}

                                        <p className="mt-2 text-lg font-bold">
                                            ₹{price}
                                        </p>

                                        {/* BOTTOM */}

                                        <div className="mt-auto flex items-center justify-between pt-5">

                                            {/* QUANTITY */}

                                            <div className="flex items-center rounded-lg border bg-white">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            product._id,
                                                            item.quantity,
                                                            -1,
                                                            product.stock
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <=
                                                            1 ||
                                                        updating ===
                                                            product._id
                                                    }
                                                    className="p-2.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Minus
                                                        size={16}
                                                    />
                                                </button>

                                                <span className="min-w-10 text-center font-semibold">
                                                    {updating ===
                                                    product._id
                                                        ? "..."
                                                        : item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            product._id,
                                                            item.quantity,
                                                            1,
                                                            product.stock
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                            product.stock ||
                                                        updating ===
                                                            product._id
                                                    }
                                                    className="p-2.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Plus
                                                        size={16}
                                                    />
                                                </button>

                                            </div>

                                            {/* ITEM TOTAL */}

                                            <p className="font-semibold">
                                                ₹{itemTotal}
                                            </p>

                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ORDER SUMMARY */}

                    <div className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">

                        <h2 className="text-xl font-bold">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4">

                            <div className="flex justify-between text-gray-600">
                                <span>
                                    Items ({totalItems})
                                </span>

                                <span>
                                    ₹{subtotal}
                                </span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>
                                    Shipping
                                </span>

                                <span className="text-green-600">
                                    Free
                                </span>
                            </div>

                            <div className="border-t pt-4">

                                <div className="flex justify-between text-lg font-bold">
                                    <span>
                                        Total
                                    </span>

                                    <span>
                                        ₹{subtotal}
                                    </span>
                                </div>

                            </div>

                            {/* CHECKOUT */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/checkout"
                                    )
                                }
                                className="w-full rounded-xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-gray-800"
                            >
                                Proceed To Checkout
                            </button>

                            {/* CONTINUE SHOPPING */}

                            <Link
                                to="/shop"
                                className="flex items-center justify-center gap-2 pt-3 text-sm font-medium text-gray-600 hover:text-black"
                            >
                                <ArrowLeft
                                    size={16}
                                />

                                Continue Shopping
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;