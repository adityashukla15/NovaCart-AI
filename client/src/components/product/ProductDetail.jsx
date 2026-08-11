import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Heart,
    ShoppingCart,
    Star,
    Minus,
    Plus,
} from "lucide-react";

import { getProductById } from "../../services/productApi";
import Button from "../ui/Button";

const ProductDetails = () => {

    // ======================================
    // URL PARAM
    // ======================================

    const { id } = useParams();


    // ======================================
    // STATES
    // ======================================

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");


    // ======================================
    // FETCH PRODUCT
    // ======================================

    useEffect(() => {

        if (!id) {
            return;
        }

        let ignore = false;

        const loadProduct = async () => {

            try {

                setLoading(true);
                setError("");

                // Reset old product when ID changes
                setProduct(null);
                setReviews([]);
                setSimilarProducts([]);

                const response = await getProductById(id);

                console.log(
                    "Product Details Response:",
                    response.data
                );

                if (ignore) {
                    return;
                }

                const data = response.data?.data;

                setProduct(data?.product || null);
                setReviews(data?.reviews || []);
                setSimilarProducts(data?.similarProducts || []);

                // Reset selections for new product
                setQuantity(1);
                setSelectedSize("");
                setSelectedColor("");

            } catch (error) {

                if (ignore) {
                    return;
                }

                console.error(
                    "PRODUCT DETAILS ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load product"
                );

            } finally {

                if (!ignore) {
                    setLoading(false);
                }

            }

        };

        loadProduct();

        return () => {
            ignore = true;
        };

    }, [id]);


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center">

                <p className="text-lg text-gray-600">
                    Loading product...
                </p>

            </div>
        );

    }


    // ======================================
    // ERROR
    // ======================================

    if (error || !product) {

        return (
            <div className="flex min-h-screen items-center justify-center">

                <div className="text-center">

                    <p className="text-lg text-red-500">
                        {error || "Product not found"}
                    </p>

                </div>

            </div>
        );

    }


    // ======================================
    // PRODUCT DATA
    // ======================================

    const image =
        product.images?.[0] ||
        "https://via.placeholder.com/600x600?text=No+Image";

    const rating =
        product.averageRating ||
        product.rating ||
        0;

    const finalPrice =
        product.discountPrice ||
        product.price;

    const hasDiscount =
        product.discountPrice &&
        product.discountPrice < product.price;


    // ======================================
    // QUANTITY
    // ======================================

    const decreaseQuantity = () => {

        setQuantity((prev) =>
            Math.max(1, prev - 1)
        );

    };


    const increaseQuantity = () => {

        setQuantity((prev) =>
            Math.min(product.stock, prev + 1)
        );

    };


    // ======================================
    // ADD TO CART
    // ======================================

    const handleAddToCart = () => {

        console.log("Add to cart:", {
            productId: product._id,
            quantity,
            size: selectedSize,
            color: selectedColor,
        });

        // Cart API yahan connect kar sakte ho
    };


    // ======================================
    // WISHLIST
    // ======================================

    const handleWishlist = () => {

        console.log(
            "Wishlist:",
            product._id
        );

        // Wishlist API yahan connect kar sakte ho
    };


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-screen px-6 py-10">

            <div className="mx-auto max-w-7xl">

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                    {/* ======================================
                        IMAGE
                    ====================================== */}

                    <div className="overflow-hidden rounded-2xl bg-gray-100">

                        <img
                            src={image}
                            alt={product.title}
                            className="h-full max-h-162.5 w-full object-cover"
                        />

                    </div>


                    {/* ======================================
                        DETAILS
                    ====================================== */}

                    <div>

                        {/* BRAND */}

                        {product.brand && (

                            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                                {product.brand}
                            </p>

                        )}


                        {/* TITLE */}

                        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                            {product.title}
                        </h1>


                        {/* CATEGORY */}

                        {product.category?.name && (

                            <p className="mt-2 text-sm text-gray-500">
                                {product.category.name}
                            </p>

                        )}


                        {/* ======================================
                            RATING
                        ====================================== */}

                        <div className="mt-4 flex items-center gap-1">

                            {[...Array(5)].map((_, index) => (

                                <Star
                                    key={index}
                                    size={18}
                                    fill={
                                        index < Math.round(rating)
                                            ? "gold"
                                            : "none"
                                    }
                                    color="gold"
                                />

                            ))}

                            <span className="ml-2 text-sm text-gray-500">

                                {rating} (
                                {product.totalReviews || 0}
                                reviews)

                            </span>

                        </div>


                        {/* ======================================
                            PRICE
                        ====================================== */}

                        <div className="mt-6 flex items-center gap-4">

                            <span className="text-3xl font-bold">
                                ₹{finalPrice}
                            </span>

                            {hasDiscount && (

                                <span className="text-lg text-gray-400 line-through">
                                    ₹{product.price}
                                </span>

                            )}

                        </div>


                        {/* DISCOUNT */}

                        {product.discountPercentage > 0 && (

                            <p className="mt-2 text-sm font-medium text-green-600">
                                {product.discountPercentage}% OFF
                            </p>

                        )}


                        {/* ======================================
                            DESCRIPTION
                        ====================================== */}

                        <p className="mt-6 leading-7 text-gray-600">
                            {product.description}
                        </p>


                        {/* ======================================
                            COLORS
                        ====================================== */}

                        {product.colors?.length > 0 && (

                            <div className="mt-7">

                                <h3 className="mb-3 font-semibold">
                                    Color
                                </h3>

                                <div className="flex flex-wrap gap-3">

                                    {product.colors.map((color) => (

                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() =>
                                                setSelectedColor(color)
                                            }
                                            className={`rounded-lg border px-4 py-2 transition ${
                                                selectedColor === color
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-300 hover:border-black"
                                            }`}
                                        >
                                            {color}
                                        </button>

                                    ))}

                                </div>

                            </div>

                        )}


                        {/* ======================================
                            SIZES
                        ====================================== */}

                        {product.sizes?.length > 0 && (

                            <div className="mt-7">

                                <h3 className="mb-3 font-semibold">
                                    Size
                                </h3>

                                <div className="flex flex-wrap gap-3">

                                    {product.sizes.map((size) => (

                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() =>
                                                setSelectedSize(size)
                                            }
                                            className={`rounded-lg border px-4 py-2 transition ${
                                                selectedSize === size
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-300 hover:border-black"
                                            }`}
                                        >
                                            {size}
                                        </button>

                                    ))}

                                </div>

                            </div>

                        )}


                        {/* ======================================
                            STOCK
                        ====================================== */}

                        <div className="mt-7">

                            {product.stock > 0 ? (

                                <p className="text-green-600">
                                    {product.stock} items available
                                </p>

                            ) : (

                                <p className="text-red-500">
                                    Out of stock
                                </p>

                            )}

                        </div>


                        {/* ======================================
                            QUANTITY
                        ====================================== */}

                        {product.stock > 0 && (

                            <div className="mt-6">

                                <h3 className="mb-3 font-semibold">
                                    Quantity
                                </h3>

                                <div className="flex w-fit items-center rounded-lg border">

                                    <button
                                        type="button"
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="p-3 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Minus size={18} />
                                    </button>

                                    <span className="min-w-12 text-center font-semibold">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={increaseQuantity}
                                        disabled={
                                            quantity >= product.stock
                                        }
                                        className="p-3 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Plus size={18} />
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* ======================================
                            ACTIONS
                        ====================================== */}

                        <div className="mt-8 flex gap-3">

                            <Button
                                onClick={handleAddToCart}
                                className="flex-1"
                                disabled={product.stock <= 0}
                            >

                                <ShoppingCart
                                    size={19}
                                    className="mr-2"
                                />

                                {product.stock > 0
                                    ? "Add To Cart"
                                    : "Out of Stock"}

                            </Button>


                            <button
                                type="button"
                                onClick={handleWishlist}
                                className="rounded-lg border p-3 transition hover:bg-gray-100"
                            >
                                <Heart size={21} />
                            </button>

                        </div>


                        {/* ======================================
                            REVIEWS
                        ====================================== */}

                        {reviews.length > 0 && (

                            <div className="mt-8 border-t pt-6">

                                <h3 className="text-lg font-semibold">
                                    Latest Reviews
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">

                                    Showing latest {reviews.length} review
                                    {reviews.length > 1 ? "s" : ""}

                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* ======================================
                    SIMILAR PRODUCTS
                ====================================== */}

                {similarProducts.length > 0 && (

                    <div className="mt-16">

                        <h2 className="text-2xl font-bold">
                            Similar Products
                        </h2>

                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                            {similarProducts.map((item) => (

                                <div
                                    key={item._id}
                                    className="overflow-hidden rounded-xl border bg-white"
                                >

                                    <img
                                        src={
                                            item.images?.[0] ||
                                            "https://via.placeholder.com/400x400?text=No+Image"
                                        }
                                        alt={item.title}
                                        className="h-52 w-full object-cover"
                                    />

                                    <div className="p-4">

                                        <h3 className="font-semibold">
                                            {item.title}
                                        </h3>

                                        <div className="mt-2">

                                            <span className="font-bold">
                                                ₹
                                                {item.discountPrice ||
                                                    item.price}
                                            </span>

                                            {item.discountPrice &&
                                                item.discountPrice <
                                                    item.price && (

                                                    <span className="ml-2 text-sm text-gray-400 line-through">
                                                        ₹{item.price}
                                                    </span>

                                                )}

                                        </div>

                                        <p
                                            className={`mt-2 text-sm ${
                                                item.stock > 0
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {item.stock > 0
                                                ? "In Stock"
                                                : "Out of Stock"}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
};

export default ProductDetails;