import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Star,
    Send,
    Loader2,
    User,
    Trash2,
    Pencil,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
} from "../../services/reviewApi";

const ProductReviews = () => {
    const { id: productId } = useParams();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadReviews = async () => {
            if (!productId) {
                setLoading(false);
                toast.error("Product ID is missing");
                return;
            }

            try {
                setLoading(true);

                const response = await getProductReviews(productId);

                const fetchedReviews = response?.data?.data || [];

                if (mounted) {
                    setReviews(
                        Array.isArray(fetchedReviews)
                            ? fetchedReviews
                            : []
                    );
                }
            } catch (error) {
                console.error("FETCH REVIEWS ERROR:", error);

                if (mounted) {
                    setReviews([]);

                    toast.error(
                        error?.response?.data?.message ||
                            "Failed to load reviews"
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadReviews();

        return () => {
            mounted = false;
        };
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productId) {
            toast.error("Product ID is missing");
            return;
        }

        if (!rating) {
            toast.error("Please select a rating");
            return;
        }

        try {
            setSubmitting(true);

            const response = await createReview(productId, {
                rating,
                review: reviewText.trim(),
            });

            const newReview = response?.data?.data;

            if (newReview) {
                setReviews((prev) => [newReview, ...prev]);
            }

            setRating(0);
            setHoverRating(0);
            setReviewText("");

            toast.success("Review added successfully");
        } catch (error) {
            console.error("CREATE REVIEW ERROR:", error);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to add review"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditStart = (review) => {
        setEditingId(review._id);
        setEditRating(review.rating);
        setEditText(review.review || "");
    };

    const handleUpdate = async (reviewId) => {
        if (!editRating) {
            toast.error("Please select a rating");
            return;
        }

        try {
            const response = await updateReview(reviewId, {
                rating: editRating,
                review: editText.trim(),
            });

            const updatedReview = response?.data?.data;

            if (updatedReview) {
                setReviews((prev) =>
                    prev.map((review) =>
                        review._id === reviewId
                            ? {
                                  ...review,
                                  ...updatedReview,
                              }
                            : review
                    )
                );
            }

            setEditingId(null);
            setEditRating(0);
            setEditText("");

            toast.success("Review updated successfully");
        } catch (error) {
            console.error("UPDATE REVIEW ERROR:", error);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to update review"
            );
        }
    };

    const handleDelete = async (reviewId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) return;

        try {
            await deleteReview(reviewId);

            setReviews((prev) =>
                prev.filter(
                    (review) => review._id !== reviewId
                )
            );

            toast.success("Review deleted successfully");
        } catch (error) {
            console.error("DELETE REVIEW ERROR:", error);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to delete review"
            );
        }
    };

    const renderStars = (
        value,
        interactive = false,
        currentHover = 0,
        onSelect = null,
        onHover = null
    ) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    const active =
                        star <=
                        (interactive && currentHover
                            ? currentHover
                            : value);

                    return (
                        <button
                            key={star}
                            type={
                                interactive
                                    ? "button"
                                    : "button"
                            }
                            disabled={!interactive}
                            onClick={() =>
                                onSelect &&
                                onSelect(star)
                            }
                            onMouseEnter={() =>
                                onHover &&
                                onHover(star)
                            }
                            onMouseLeave={() =>
                                onHover &&
                                onHover(0)
                            }
                            className={
                                interactive
                                    ? "transition-transform hover:scale-110"
                                    : "cursor-default"
                            }
                        >
                            <Star
                                size={18}
                                className={
                                    active
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                }
                            />
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <section className="mx-auto mt-12 max-w-5xl px-4 pb-16">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-950">
                            Customer Reviews
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            See what other customers think
                            about this product.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gray-100 px-4 py-3 text-center">
                        <p className="text-xl font-black text-gray-950">
                            {reviews.length}
                        </p>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Reviews
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mb-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div className="mb-5">
                    <h3 className="text-lg font-black text-gray-900">
                        Write a review
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Share your experience with this product.
                    </p>
                </div>

                <div className="mb-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Your rating
                    </p>

                    {renderStars(
                        rating,
                        true,
                        hoverRating,
                        setRating,
                        setHoverRating
                    )}
                </div>

                <textarea
                    value={reviewText}
                    onChange={(e) =>
                        setReviewText(e.target.value)
                    }
                    placeholder="What did you like or dislike about this product?"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                />

                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting || !rating}
                        className="flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        {submitting ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Submit Review
                            </>
                        )}
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2
                        size={28}
                        className="animate-spin text-gray-400"
                    />
                </div>
            ) : reviews.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Star
                            size={24}
                            className="text-gray-300"
                        />
                    </div>

                    <h3 className="mt-4 text-lg font-black text-gray-900">
                        No reviews yet
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Be the first one to review this product.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((item) => {
                        const userName =
                            item.user?.name || "Anonymous";

                        const isEditing =
                            editingId === item._id;

                        return (
                            <article
                                key={item._id}
                                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                                            <User size={18} />
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-black text-gray-900">
                                                {userName}
                                            </h4>

                                            <p className="text-xs text-gray-400">
                                                {item.createdAt
                                                    ? new Date(
                                                          item.createdAt
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              day: "numeric",
                                                              month: "short",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditStart(
                                                    item
                                                )
                                            }
                                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            <Pencil size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    item._id
                                                )
                                            }
                                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Rating
                                        </p>

                                        {renderStars(
                                            editRating,
                                            true,
                                            0,
                                            setEditRating
                                        )}

                                        <textarea
                                            value={editText}
                                            onChange={(e) =>
                                                setEditText(
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-gray-400"
                                        />

                                        <div className="mt-3 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingId(
                                                        null
                                                    )
                                                }
                                                className="flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200"
                                            >
                                                <X size={14} />
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdate(
                                                        item._id
                                                    )
                                                }
                                                className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-bold text-white hover:bg-black"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mt-4">
                                            {renderStars(
                                                item.rating
                                            )}
                                        </div>

                                        {item.review && (
                                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                                {item.review}
                                            </p>
                                        )}
                                    </>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default ProductReviews;