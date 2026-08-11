import { useEffect, useState } from "react";

import {
    Heart,
    Star,
    ShoppingCart,
} from "lucide-react";

import Button from "../ui/Button";

import { useNavigate } from "react-router-dom";

import { addToCart } from "../../services/cartApi";

import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "../../services/wishlistApi";

import { useAuth } from "../../context/AuthContext";

import toast from "react-hot-toast";


const ProductCard = ({ product }) => {

    const navigate = useNavigate();

    const { user } = useAuth();


    // ======================================
    // STATES
    // ======================================

    const [adding, setAdding] = useState(false);

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const [isWishlisted, setIsWishlisted] =
        useState(Boolean(product.isWishlisted));


    // ======================================
    // PRODUCT DATA
    // ======================================

    const image =
        product.images?.[0] ||
        "https://via.placeholder.com/500x500?text=No+Image";


    const category =
        product.category?.name ||
        "Product";


    const rating =
        product.averageRating ||
        product.rating ||
        0;


    const hasDiscount =
        product.discountPrice &&
        product.discountPrice < product.price;


    // ======================================
    // CHECK WISHLIST STATUS
    // ======================================

    useEffect(() => {

        let cancelled = false;


        const checkWishlist = async () => {

            if (!user) {

                if (!cancelled) {
                    setIsWishlisted(false);
                }

                return;

            }


            try {

                const response =
                    await getWishlist();


                const wishlist =
                    response.data?.data;


                const products =
                    wishlist?.products || [];


                const exists =
                    products.some((item) => {

                        const id =
                            typeof item === "object"
                                ? item._id
                                : item;

                        return (
                            String(id) ===
                            String(product._id)
                        );

                    });


                if (!cancelled) {

                    setIsWishlisted(exists);

                }

            } catch (error) {

                console.error(
                    "CHECK WISHLIST ERROR:",
                    error
                );

            }

        };


        checkWishlist();


        return () => {

            cancelled = true;

        };

    }, [user, product._id]);


    // ======================================
    // PRODUCT DETAILS
    // ======================================

    const handleProductClick = () => {

        navigate(
            `/products/${product._id}`
        );

    };


    // ======================================
    // WISHLIST
    // ======================================

    const handleWishlist = async (e) => {

        e.stopPropagation();


        // ==================================
        // LOGIN CHECK
        // ==================================

        if (!user) {

            navigate("/login");

            return;

        }


        // ==================================
        // PREVENT DOUBLE CLICK
        // ==================================

        if (wishlistLoading) {

            return;

        }


        try {

            setWishlistLoading(true);


            // ==================================
            // REMOVE
            // ==================================

            if (isWishlisted) {

                await removeFromWishlist(
                    product._id
                );


                setIsWishlisted(false);


                toast.success(
                    "Removed from wishlist"
                );

            }


            // ==================================
            // ADD
            // ==================================

            else {

                await addToWishlist(
                    product._id
                );


                setIsWishlisted(true);


                toast.success(
                    "Added to wishlist ❤️"
                );

            }

        } catch (error) {

            console.error(
                "WISHLIST ERROR:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Failed to update wishlist";


            toast.error(message);

        } finally {

            setWishlistLoading(false);

        }

    };


    // ======================================
    // ADD TO CART
    // ======================================

    const handleAddToCart = async (e) => {

        e.stopPropagation();


        // ==================================
        // LOGIN CHECK
        // ==================================

        if (!user) {

            navigate("/login");

            return;

        }


        try {

            setAdding(true);


            const response =
                await addToCart(
                    product._id
                );


            console.log(
                "Add To Cart:",
                response.data
            );


            toast.success(
                "Product added to cart successfully! 🛒"
            );

        } catch (error) {

            console.error(
                "ADD TO CART ERROR:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Failed to add product to cart";


            toast.error(message);

        } finally {

            setAdding(false);

        }

    };


    // ======================================
    // RENDER
    // ======================================

    return (

        <div
            onClick={handleProductClick}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >

            {/* ==================================
                IMAGE
            ================================== */}

            <div className="relative overflow-hidden">

                <img
                    src={image}
                    alt={product.title}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                />


                {/* FEATURED */}

                {product.isFeatured && (

                    <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs text-white">

                        Featured

                    </span>

                )}


                {/* ==================================
                    WISHLIST BUTTON
                ================================== */}

                <button
                    type="button"
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    aria-label={
                        isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    className="absolute right-4 top-4 rounded-full bg-white p-2 shadow transition duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <Heart
                        size={19}
                        className={
                            isWishlisted
                                ? "fill-red-500 text-red-500"
                                : "text-gray-700"
                        }
                    />

                </button>

            </div>


            {/* ==================================
                PRODUCT INFO
            ================================== */}

            <div className="p-5">


                {/* CATEGORY */}

                <p className="text-sm text-gray-500">

                    {category}

                </p>


                {/* TITLE */}

                <h3 className="mt-2 line-clamp-1 text-xl font-semibold">

                    {product.title}

                </h3>


                {/* BRAND */}

                {product.brand && (

                    <p className="mt-1 text-sm text-gray-400">

                        {product.brand}

                    </p>

                )}


                {/* ==================================
                    RATING
                ================================== */}

                <div className="mt-3 flex items-center gap-1">

                    {[...Array(5)].map(
                        (_, index) => (

                            <Star
                                key={index}
                                size={16}
                                fill={
                                    index <
                                    Math.round(
                                        rating
                                    )
                                        ? "gold"
                                        : "none"
                                }
                                color="gold"
                            />

                        )
                    )}


                    <span className="ml-1 text-sm text-gray-500">

                        ({rating})

                    </span>

                </div>


                {/* ==================================
                    PRICE
                ================================== */}

                <div className="mt-4 flex items-center gap-3">

                    <span className="text-xl font-bold">

                        ₹
                        {product.discountPrice ||
                            product.price}

                    </span>


                    {hasDiscount && (

                        <span className="text-gray-400 line-through">

                            ₹{product.price}

                        </span>

                    )}

                </div>


                {/* ==================================
                    STOCK
                ================================== */}

                <p className="mt-2 text-sm">

                    {product.stock > 0 ? (

                        <span className="text-green-600">

                            In Stock

                        </span>

                    ) : (

                        <span className="text-red-500">

                            Out of Stock

                        </span>

                    )}

                </p>


                {/* ==================================
                    CART
                ================================== */}

                <Button
                    onClick={handleAddToCart}
                    className="mt-6 w-full"
                    disabled={
                        product.stock <= 0 ||
                        adding
                    }
                >

                    <ShoppingCart
                        size={18}
                        className="mr-2"
                    />


                    {adding
                        ? "Adding..."
                        : product.stock > 0
                            ? "Add To Cart"
                            : "Out of Stock"}

                </Button>

            </div>

        </div>

    );

};


export default ProductCard;