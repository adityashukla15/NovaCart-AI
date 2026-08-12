import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Heart,
    ShoppingCart,
    Star,
    Minus,
    Plus,
    Edit3,
    Trash2,
} from "lucide-react";

import { getProductById } from "../../services/productApi";

import {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
} from "../../services/reviewApi";

import { addToCart } from "../../services/cartApi";

import Button from "../ui/Button";

import { useAuth } from "../../context/AuthContext";

import toast from "react-hot-toast";

const ProductDetails = () => {

    // ======================================
    // URL PARAM
    // ======================================

    const { id } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();


    // ======================================
    // STATES
    // ======================================

    const [product, setProduct] = useState(null);

    const [reviews, setReviews] = useState([]);

    const [similarProducts, setSimilarProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [reviewLoading, setReviewLoading] = useState(false);

    const [reviewDeleting, setReviewDeleting] = useState(false);

    const [error, setError] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [selectedSize, setSelectedSize] = useState("");

    const [selectedColor, setSelectedColor] = useState("");


    // ======================================
    // REVIEW FORM
    // ======================================

    const [reviewRating, setReviewRating] = useState(0);

    const [reviewText, setReviewText] = useState("");

    const [editingReviewId, setEditingReviewId] =
        useState(null);


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

                setProduct(null);

                setReviews([]);

                setSimilarProducts([]);

                setQuantity(1);

                setSelectedSize("");

                setSelectedColor("");

                const response =
                    await getProductById(id);

                console.log(
                    "Product Details Response:",
                    response.data
                );

                if (ignore) {
                    return;
                }

                const data =
                    response.data?.data;

                setProduct(
                    data?.product || null
                );

                setSimilarProducts(
                    data?.similarProducts || []
                );

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
    // FETCH REVIEWS
    // ======================================

    useEffect(() => {

        if (!id) {
            return;
        }

        let ignore = false;

        const loadReviews = async () => {

            try {

                const response =
                    await getProductReviews(id);

                if (ignore) {
                    return;
                }

                const data =
                    response.data?.data;

                setReviews(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                if (ignore) {
                    return;
                }

                console.error(
                    "GET REVIEWS ERROR:",
                    error
                );

            }

        };

        loadReviews();

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
        "https://placehold.co/600x600?text=No+Image";

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
            Math.min(
                product.stock,
                prev + 1
            )
        );

    };


    // ======================================
    // ADD TO CART
    // ======================================

    const handleAddToCart = async () => {

        if (!user) {

            navigate("/login");

            return;

        }

        try {

            await addToCart(product._id);

            toast.success(
                "Product added to cart!"
            );

        } catch (error) {

            console.error(
                "ADD TO CART ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to add product to cart"
            );

        }

    };


    // ======================================
    // WISHLIST
    // ======================================

    const handleWishlist = () => {

        if (!user) {

            navigate("/login");

            return;

        }

        console.log(
            "Wishlist:",
            product._id
        );

    };


    // ======================================
    // REVIEW SUBMIT
    // ======================================

    const handleReviewSubmit = async (e) => {

        e.preventDefault();

        if (!user) {

            navigate("/login");

            return;

        }

        if (reviewRating < 1) {

            toast.error(
                "Please select a rating"
            );

            return;

        }

        try {

            setReviewLoading(true);

            // ==================================
            // UPDATE REVIEW
            // ==================================

            if (editingReviewId) {

                const response =
                    await updateReview(
                        editingReviewId,
                        {
                            rating: reviewRating,
                            review: reviewText,
                        }
                    );

                const updatedReview =
                    response.data?.data;

                setReviews((prev) =>
                    prev.map((item) =>
                        item._id ===
                        editingReviewId
                            ? {
                                  ...item,
                                  ...updatedReview,
                              }
                            : item
                    )
                );

                toast.success(
                    "Review updated successfully!"
                );

            }

            // ==================================
            // CREATE REVIEW
            // ==================================

            else {

                const response =
                    await createReview(
                        product._id,
                        {
                            rating: reviewRating,
                            review: reviewText,
                        }
                    );

                const newReview =
                    response.data?.data;

                if (newReview) {

                    setReviews((prev) => [
                        newReview,
                        ...prev,
                    ]);

                }

                toast.success(
                    "Review added successfully!"
                );

            }

            // ==================================
            // RESET FORM
            // ==================================

            setReviewRating(0);

            setReviewText("");

            setEditingReviewId(null);

            // ==================================
            // REFRESH PRODUCT RATING
            // ==================================

            const productResponse =
                await getProductById(
                    product._id
                );

            const productData =
                productResponse.data?.data;

            if (productData?.product) {

                setProduct(
                    productData.product
                );

            }

        } catch (error) {

            console.error(
                "REVIEW ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to submit review"
            );

        } finally {

            setReviewLoading(false);

        }

    };


    // ======================================
    // EDIT REVIEW
    // ======================================

    const handleEditReview = (review) => {

        setEditingReviewId(
            review._id
        );

        setReviewRating(
            review.rating
        );

        setReviewText(
            review.review || ""
        );

        window.scrollTo({
            top:
                document.body.scrollHeight,
            behavior: "smooth",
        });

    };


    // ======================================
    // CANCEL EDIT
    // ======================================

    const handleCancelEdit = () => {

        setEditingReviewId(null);

        setReviewRating(0);

        setReviewText("");

    };


    // ======================================
    // DELETE REVIEW
    // ======================================

    const handleDeleteReview = async (
        reviewId
    ) => {

        if (!window.confirm(
            "Are you sure you want to delete this review?"
        )) {

            return;

        }

        try {

            setReviewDeleting(true);

            await deleteReview(reviewId);

            setReviews((prev) =>
                prev.filter(
                    (item) =>
                        item._id !== reviewId
                )
            );

            toast.success(
                "Review deleted successfully!"
            );

            // Refresh product rating

            const productResponse =
                await getProductById(
                    product._id
                );

            const productData =
                productResponse.data?.data;

            if (productData?.product) {

                setProduct(
                    productData.product
                );

            }

        } catch (error) {

            console.error(
                "DELETE REVIEW ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete review"
            );

        } finally {

            setReviewDeleting(false);

        }

    };


    // ======================================
    // CHECK CURRENT USER REVIEW
    // ======================================

    const isMyReview = (review) => {

        if (!user || !review?.user) {

            return false;

        }

        const reviewUserId =
            review.user._id ||
            review.user;

        return (
            reviewUserId?.toString() ===
            user._id?.toString()
        );

    };


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-screen px-6 py-10">

            <div className="mx-auto max-w-7xl">

                {/* ======================================
                    PRODUCT
                ====================================== */}

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                    {/* IMAGE */}

                    <div className="overflow-hidden rounded-2xl bg-gray-100">

                        <img
                            src={image}
                            alt={product.title}
                            className="h-full max-h-162.5 w-full object-cover"
                        />

                    </div>


                    {/* DETAILS */}

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


                        {/* RATING */}

                        <div className="mt-4 flex items-center gap-1">

                            {[...Array(5)].map(
                                (_, index) => (

                                    <Star
                                        key={index}
                                        size={18}
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

                            <span className="ml-2 text-sm text-gray-500">

                                {rating} (
                                {product.totalReviews ||
                                    reviews.length}
                                reviews)

                            </span>

                        </div>


                        {/* PRICE */}

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

                        {product.discountPercentage >
                            0 && (

                            <p className="mt-2 text-sm font-medium text-green-600">

                                {product.discountPercentage}
                                % OFF

                            </p>

                        )}


                        {/* DESCRIPTION */}

                        <p className="mt-6 leading-7 text-gray-600">

                            {product.description}

                        </p>


                        {/* COLORS */}

                        {product.colors?.length >
                            0 && (

                            <div className="mt-7">

                                <h3 className="mb-3 font-semibold">
                                    Color
                                </h3>

                                <div className="flex flex-wrap gap-3">

                                    {product.colors.map(
                                        (color) => (

                                            <button
                                                key={
                                                    color
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setSelectedColor(
                                                        color
                                                    )
                                                }
                                                className={`rounded-lg border px-4 py-2 transition ${
                                                    selectedColor ===
                                                    color
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-300 hover:border-black"
                                                }`}
                                            >
                                                {
                                                    color
                                                }
                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* SIZES */}

                        {product.sizes?.length >
                            0 && (

                            <div className="mt-7">

                                <h3 className="mb-3 font-semibold">
                                    Size
                                </h3>

                                <div className="flex flex-wrap gap-3">

                                    {product.sizes.map(
                                        (size) => (

                                            <button
                                                key={
                                                    size
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setSelectedSize(
                                                        size
                                                    )
                                                }
                                                className={`rounded-lg border px-4 py-2 transition ${
                                                    selectedSize ===
                                                    size
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-300 hover:border-black"
                                                }`}
                                            >
                                                {
                                                    size
                                                }
                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* STOCK */}

                        <div className="mt-7">

                            {product.stock > 0 ? (

                                <p className="text-green-600">

                                    {product.stock}
                                    items available

                                </p>

                            ) : (

                                <p className="text-red-500">

                                    Out of stock

                                </p>

                            )}

                        </div>


                        {/* QUANTITY */}

                        {product.stock > 0 && (

                            <div className="mt-6">

                                <h3 className="mb-3 font-semibold">
                                    Quantity
                                </h3>

                                <div className="flex w-fit items-center rounded-lg border">

                                    <button
                                        type="button"
                                        onClick={
                                            decreaseQuantity
                                        }
                                        disabled={
                                            quantity <=
                                            1
                                        }
                                        className="p-3 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Minus
                                            size={18}
                                        />
                                    </button>

                                    <span className="min-w-12 text-center font-semibold">

                                        {quantity}

                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            increaseQuantity
                                        }
                                        disabled={
                                            quantity >=
                                            product.stock
                                        }
                                        className="p-3 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Plus
                                            size={18}
                                        />
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* ACTIONS */}

                        <div className="mt-8 flex gap-3">

                            <Button
                                onClick={
                                    handleAddToCart
                                }
                                className="flex-1"
                                disabled={
                                    product.stock <=
                                    0
                                }
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
                                onClick={
                                    handleWishlist
                                }
                                className="rounded-lg border p-3 transition hover:bg-gray-100"
                            >

                                <Heart
                                    size={21}
                                />

                            </button>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    REVIEWS SECTION
                ====================================== */}

                <section className="mt-16 border-t pt-10">

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

                        {/* ==================================
                            RATING SUMMARY
                        ================================== */}

                        <div>

                            <h2 className="text-2xl font-bold">
                                Customer Reviews
                            </h2>

                            <div className="mt-5 rounded-2xl bg-gray-50 p-6">

                                <div className="text-center">

                                    <p className="text-5xl font-bold">

                                        {rating}

                                    </p>

                                    <div className="mt-2 flex justify-center">

                                        {[...Array(5)].map(
                                            (_, index) => (

                                                <Star
                                                    key={
                                                        index
                                                    }
                                                    size={
                                                        20
                                                    }
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

                                    </div>

                                    <p className="mt-2 text-sm text-gray-500">

                                        Based on{" "}
                                        {product.totalReviews ||
                                            reviews.length}{" "}
                                        reviews

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ==================================
                            REVIEW FORM
                        ================================== */}

                        <div className="lg:col-span-2">

                            <div className="rounded-2xl border bg-white p-6 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <h2 className="text-xl font-bold">

                                        {editingReviewId
                                            ? "Edit Your Review"
                                            : "Write a Review"}

                                    </h2>

                                    {editingReviewId && (

                                        <button
                                            type="button"
                                            onClick={
                                                handleCancelEdit
                                            }
                                            className="text-sm text-gray-500 hover:text-black"
                                        >
                                            Cancel
                                        </button>

                                    )}

                                </div>


                                {!user ? (

                                    <div className="mt-5 rounded-xl bg-gray-50 p-5 text-center">

                                        <p className="text-gray-600">

                                            Please login to
                                            write a review.

                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/login"
                                                )
                                            }
                                            className="mt-3 font-medium underline"
                                        >
                                            Login
                                        </button>

                                    </div>

                                ) : (

                                    <form
                                        onSubmit={
                                            handleReviewSubmit
                                        }
                                        className="mt-5"
                                    >

                                        {/* STAR SELECTOR */}

                                        <p className="mb-2 text-sm font-medium">

                                            Your Rating

                                        </p>

                                        <div className="flex gap-1">

                                            {[1, 2, 3, 4, 5].map(
                                                (star) => (

                                                    <button
                                                        key={
                                                            star
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setReviewRating(
                                                                star
                                                            )
                                                        }
                                                        className="rounded p-1 transition hover:scale-110"
                                                    >

                                                        <Star
                                                            size={
                                                                28
                                                            }
                                                            fill={
                                                                star <=
                                                                reviewRating
                                                                    ? "gold"
                                                                    : "none"
                                                            }
                                                            color="gold"
                                                        />

                                                    </button>

                                                )
                                            )}

                                        </div>


                                        {/* COMMENT */}

                                        <textarea
                                            value={
                                                reviewText
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setReviewText(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Share your experience with this product..."
                                            rows={5}
                                            className="mt-5 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                                        />


                                        {/* SUBMIT */}

                                        <button
                                            type="submit"
                                            disabled={
                                                reviewLoading
                                            }
                                            className="mt-4 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                                        >

                                            {reviewLoading
                                                ? "Submitting..."
                                                : editingReviewId
                                                ? "Update Review"
                                                : "Submit Review"}

                                        </button>

                                    </form>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        REVIEW LIST
                    ================================== */}

                    <div className="mt-10">

                        <div className="flex items-center justify-between">

                            <h2 className="text-2xl font-bold">

                                All Reviews

                            </h2>

                            <span className="text-sm text-gray-500">

                                {reviews.length} review
                                {reviews.length !==
                                1
                                    ? "s"
                                    : ""}

                            </span>

                        </div>


                        {reviews.length === 0 ? (

                            <div className="mt-5 rounded-2xl border border-dashed p-10 text-center">

                                <Star
                                    size={40}
                                    className="mx-auto text-gray-300"
                                />

                                <p className="mt-3 font-medium">

                                    No reviews yet

                                </p>

                                <p className="mt-1 text-sm text-gray-500">

                                    Be the first person to
                                    review this product.

                                </p>

                            </div>

                        ) : (

                            <div className="mt-5 space-y-4">

                                {reviews.map(
                                    (review) => (

                                        <div
                                            key={
                                                review._id
                                            }
                                            className="rounded-2xl border bg-white p-6"
                                        >

                                            <div className="flex flex-col justify-between gap-4 sm:flex-row">

                                                <div>

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-semibold text-white">

                                                            {review.user?.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase() ||
                                                                "U"}

                                                        </div>

                                                        <div>

                                                            <p className="font-semibold">

                                                                {review.user?.name ||
                                                                    "User"}

                                                            </p>

                                                            <p className="text-xs text-gray-400">

                                                                {review.createdAt
                                                                    ? new Date(
                                                                          review.createdAt
                                                                      ).toLocaleDateString(
                                                                          "en-IN",
                                                                          {
                                                                              day: "2-digit",
                                                                              month: "long",
                                                                              year: "numeric",
                                                                          }
                                                                      )
                                                                    : ""}

                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* STARS */}

                                                    <div className="mt-3 flex">

                                                        {[1, 2, 3, 4, 5].map(
                                                            (
                                                                star
                                                            ) => (

                                                                <Star
                                                                    key={
                                                                        star
                                                                    }
                                                                    size={
                                                                        17
                                                                    }
                                                                    fill={
                                                                        star <=
                                                                        review.rating
                                                                            ? "gold"
                                                                            : "none"
                                                                    }
                                                                    color="gold"
                                                                />

                                                            )
                                                        )}

                                                    </div>

                                                </div>


                                                {/* EDIT DELETE */}

                                                {isMyReview(
                                                    review
                                                ) && (

                                                    <div className="flex items-start gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditReview(
                                                                    review
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
                                                            title="Edit review"
                                                        >

                                                            <Edit3
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteReview(
                                                                    review._id
                                                                )
                                                            }
                                                            disabled={
                                                                reviewDeleting
                                                            }
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                            title="Delete review"
                                                        >

                                                            <Trash2
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                        </button>

                                                    </div>

                                                )}

                                            </div>


                                            {/* COMMENT */}

                                            {review.review && (

                                                <p className="mt-4 leading-7 text-gray-600">

                                                    {
                                                        review.review
                                                    }

                                                </p>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </section>


                {/* ======================================
                    SIMILAR PRODUCTS
                ====================================== */}

                {similarProducts.length > 0 && (

                    <div className="mt-16">

                        <h2 className="text-2xl font-bold">
                            Similar Products
                        </h2>

                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                            {similarProducts.map(
                                (item) => (

                                    <div
                                        key={
                                            item._id
                                        }
                                        className="overflow-hidden rounded-xl border bg-white"
                                    >

                                        <img
                                            src={
                                                item.images?.[0] ||
                                                "https://placehold.co/400x400?text=No+Image"
                                            }
                                            alt={
                                                item.title
                                            }
                                            className="h-52 w-full object-cover"
                                        />

                                        <div className="p-4">

                                            <h3 className="font-semibold">

                                                {
                                                    item.title
                                                }

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

                                                            ₹
                                                            {
                                                                item.price
                                                            }

                                                        </span>

                                                    )}

                                            </div>

                                            <p
                                                className={`mt-2 text-sm ${
                                                    item.stock >
                                                    0
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }`}
                                            >

                                                {item.stock >
                                                0
                                                    ? "In Stock"
                                                    : "Out of Stock"}

                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default ProductDetails;