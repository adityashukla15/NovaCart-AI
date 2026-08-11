import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getWishlist,
    removeFromWishlist,
    clearWishlist,
} from "../services/wishlistApi";

import { addToCart } from "../services/cartApi";

const Wishlist = () => {
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [clearing, setClearing] = useState(false);
    const [addingId, setAddingId] = useState(null);

    // ======================================
    // FETCH WISHLIST
    // ======================================

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await getWishlist();

                const data = response.data?.data;

                setWishlist(data?.products || []);
            } catch (error) {
                console.error("GET WISHLIST ERROR:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load wishlist"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    // ======================================
    // REMOVE PRODUCT
    // ======================================

    const handleRemove = async (productId) => {
        if (removingId) return;

        try {
            setRemovingId(productId);

            await removeFromWishlist(productId);

            setWishlist((prev) =>
                prev.filter(
                    (product) => product._id !== productId
                )
            );

            toast.success("Removed from wishlist ❤️");
        } catch (error) {
            console.error("REMOVE WISHLIST ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to remove product"
            );
        } finally {
            setRemovingId(null);
        }
    };

    // ======================================
    // CLEAR WISHLIST
    // ======================================

    const handleClearWishlist = async () => {
        if (clearing || wishlist.length === 0) return;

        try {
            setClearing(true);

            await clearWishlist();

            setWishlist([]);

            toast.success("Wishlist cleared");
        } catch (error) {
            console.error("CLEAR WISHLIST ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to clear wishlist"
            );
        } finally {
            setClearing(false);
        }
    };

    // ======================================
    // ADD TO CART
    // ======================================

    const handleAddToCart = async (productId) => {
        if (addingId) return;

        try {
            setAddingId(productId);

            await addToCart(productId);

            toast.success("Product added to cart 🛒");
        } catch (error) {
            console.error("ADD TO CART ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to add product to cart"
            );
        } finally {
            setAddingId(null);
        }
    };

    // ======================================
    // LOADING
    // ======================================

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <Loader2
                        size={40}
                        className="mx-auto animate-spin"
                    />

                    <p className="mt-3 text-gray-500">
                        Loading wishlist...
                    </p>
                </div>
            </div>
        );
    }

    // ======================================
    // EMPTY WISHLIST
    // ======================================

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-6xl">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold md:text-4xl">
                            My Wishlist
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Products you love and want to save
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

                        <Heart
                            size={60}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-5 text-xl font-semibold">
                            Your wishlist is empty
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Start adding products you love.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/products")
                            }
                            className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                        >
                            Start Shopping
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    // ======================================
    // WISHLIST
    // ======================================

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6">

            <div className="mx-auto max-w-6xl">

                {/* HEADER */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold md:text-4xl">
                            My Wishlist
                        </h1>

                        <p className="mt-2 text-gray-500">
                            {wishlist.length} product
                            {wishlist.length !== 1
                                ? "s"
                                : ""}{" "}
                            saved
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClearWishlist}
                        disabled={clearing}
                        className="flex w-fit items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Trash2 size={17} />

                        {clearing
                            ? "Clearing..."
                            : "Clear Wishlist"}
                    </button>

                </div>

                {/* PRODUCTS */}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {wishlist.map((product) => {

                        const image =
                            product.images?.[0] ||
                            "https://via.placeholder.com/500x500?text=No+Image";

                        const rating =
                            product.averageRating ||
                            product.rating ||
                            0;

                        const hasDiscount =
                            product.discountPrice &&
                            product.discountPrice <
                                product.price;

                        return (
                            <div
                                key={product._id}
                                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* IMAGE */}

                                <div
                                    className="relative cursor-pointer overflow-hidden"
                                    onClick={() =>
                                        navigate(
                                            `/products/${product._id}`
                                        )
                                    }
                                >

                                    <img
                                        src={image}
                                        alt={product.title}
                                        className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                                    />

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(
                                                product._id
                                            );
                                        }}
                                        disabled={
                                            removingId ===
                                            product._id
                                        }
                                        className="absolute right-4 top-4 rounded-full bg-white p-2 text-red-500 shadow transition hover:scale-110 disabled:opacity-50"
                                    >
                                        {removingId ===
                                        product._id ? (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Heart
                                                size={18}
                                                fill="red"
                                            />
                                        )}
                                    </button>

                                </div>

                                {/* INFO */}

                                <div className="p-5">

                                    <p className="text-sm text-gray-500">
                                        {product.category?.name ||
                                            "Product"}
                                    </p>

                                    <h2
                                        className="mt-2 cursor-pointer truncate text-xl font-semibold"
                                        onClick={() =>
                                            navigate(
                                                `/products/${product._id}`
                                            )
                                        }
                                    >
                                        {product.title}
                                    </h2>

                                    {product.brand && (
                                        <p className="mt-1 text-sm text-gray-400">
                                            {product.brand}
                                        </p>
                                    )}

                                    {/* RATING */}

                                    <div className="mt-3 flex items-center gap-1">

                                        <span className="text-yellow-500">
                                            ★
                                        </span>

                                        <span className="text-sm text-gray-500">
                                            {rating}
                                        </span>

                                    </div>

                                    {/* PRICE */}

                                    <div className="mt-4 flex items-center gap-3">

                                        <span className="text-xl font-bold">
                                            ₹
                                            {product.discountPrice ||
                                                product.price}
                                        </span>

                                        {hasDiscount && (
                                            <span className="text-gray-400 line-through">
                                                ₹
                                                {
                                                    product.price
                                                }
                                            </span>
                                        )}

                                    </div>

                                    {/* CART */}

                                    <button
                                        type="button"
                                        disabled={
                                            product.stock <=
                                                0 ||
                                            addingId ===
                                                product._id
                                        }
                                        onClick={() =>
                                            handleAddToCart(
                                                product._id
                                            )
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                                    >

                                        <ShoppingBag
                                            size={18}
                                        />

                                        {addingId ===
                                        product._id
                                            ? "Adding..."
                                            : product.stock >
                                                0
                                            ? "Add To Cart"
                                            : "Out of Stock"}

                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>
        </div>
    );
};

export default Wishlist;