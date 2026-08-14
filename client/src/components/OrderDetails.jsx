import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    XCircle,
    RotateCcw,
    Loader2,
    Star,
    ArrowRightLeft,
    Clock,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getOrderById,
    cancelOrder,
    requestReturn,
} from "../services/orderApi";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Return states
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [returnDescription, setReturnDescription] = useState("");
    const [returnType, setReturnType] = useState("Return");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);

                const response = await getOrderById(id);
                const data = response.data?.data;

                if (!data) {
                    throw new Error("Order not found");
                }

                setOrder(data);
            } catch (error) {
                console.error("ORDER DETAILS ERROR:", error);

                const message =
                    error.response?.data?.message ||
                    "Failed to load order";

                toast.error(message);
                navigate("/my-orders");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id, navigate]);

    // ==========================================
    // CANCEL ORDER
    // ==========================================

    const handleCancelOrder = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);

            const response = await cancelOrder(order._id);
            const updatedOrder = response.data?.data;

            if (updatedOrder) {
                setOrder(updatedOrder);
            }

            toast.success("Order cancelled successfully");
        } catch (error) {
            console.error("CANCEL ORDER ERROR:", error);

            const message =
                error.response?.data?.message ||
                "Failed to cancel order";

            toast.error(message);
        } finally {
            setActionLoading(false);
        }
    };

    // ==========================================
    // RETURN / EXCHANGE REQUEST
    // ==========================================

    const handleReturnRequest = async () => {
        if (!returnReason.trim()) {
            toast.error("Please select a return reason");
            return;
        }

        try {
            setActionLoading(true);

            const response = await requestReturn(
                order._id,
                {
                    returnType,
                    reason: returnReason.trim(),
                    description: returnDescription.trim(),
                }
            );

            const updatedOrder = response.data?.data;

            if (updatedOrder) {
                setOrder(updatedOrder);
            }

            setShowReturnForm(false);
            setReturnReason("");
            setReturnDescription("");
            setReturnType("Return");

            toast.success(
                `${returnType} request submitted successfully`
            );
        } catch (error) {
            console.error(
                "RETURN REQUEST ERROR:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to request return";

            toast.error(message);
        } finally {
            setActionLoading(false);
        }
    };

    // ==========================================
    // REVIEW
    // ==========================================

    const handleReview = (product) => {
        const productId =
            typeof product === "object"
                ? product?._id
                : product;

        if (!productId) {
            toast.error(
                "Product information not available"
            );
            return;
        }

        navigate(
            `/products/${productId}/reviews`
        );
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2
                        size={40}
                        className="mx-auto animate-spin"
                    />

                    <p className="mt-4 text-gray-500">
                        Loading order details...
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // ORDER NOT FOUND
    // ==========================================

    if (!order) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Package
                        size={50}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 text-xl font-semibold">
                        Order not found
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/my-orders")
                        }
                        className="mt-5 rounded-xl bg-black px-5 py-3 text-white"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // ORDER STATUS
    // ==========================================

    const statusClasses = {
        Pending:
            "bg-yellow-100 text-yellow-700",

        Confirmed:
            "bg-blue-100 text-blue-700",

        Packed:
            "bg-purple-100 text-purple-700",

        Shipped:
            "bg-indigo-100 text-indigo-700",

        Delivered:
            "bg-green-100 text-green-700",

        Cancelled:
            "bg-red-100 text-red-700",
    };

    const statuses = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
    ];

    const currentIndex =
        statuses.indexOf(
            order.orderStatus
        );

    const canCancel =
        order.orderStatus !== "Cancelled" &&
        order.orderStatus !== "Shipped" &&
        order.orderStatus !== "Delivered";

    const canReturn =
        order.orderStatus === "Delivered" &&
        (!order.returnStatus ||
            order.returnStatus ===
                "Not Requested" ||
            order.returnStatus ===
                "Rejected");

    // ==========================================
    // RETURN STATUS
    // ==========================================

    const returnStatus =
        order.returnStatus ||
        "Not Requested";

    const hasReturnRequest =
        returnStatus !==
        "Not Requested";

    // ==========================================
    // RETURN TIMELINE
    // ==========================================

    const getReturnTimeline = () => {
        const isExchange =
            order.returnType ===
            "Exchange";

        return [
            {
                key: "Requested",
                label: "Request Submitted",
                date:
                    order.returnRequestedAt,
                active: [
                    "Requested",
                    "Accepted",
                    "Returned",
                    "Refund Initiated",
                    "Refund Completed",
                    "Exchanged",
                ].includes(returnStatus),
            },

            {
                key: "Accepted",
                label: "Request Accepted",
                date:
                    order.returnAcceptedAt,
                active: [
                    "Accepted",
                    "Returned",
                    "Refund Initiated",
                    "Refund Completed",
                    "Exchanged",
                ].includes(returnStatus),
            },

            {
                key: "Returned",
                label: "Item Returned",
                date:
                    order.returnedAt,
                active: [
                    "Returned",
                    "Refund Initiated",
                    "Refund Completed",
                    "Exchanged",
                ].includes(returnStatus),
            },

            ...(isExchange
                ? [
                      {
                          key: "Exchanged",
                          label: "Exchange Completed",
                          date:
                              order.exchangedAt,
                          active:
                              returnStatus ===
                              "Exchanged",
                      },
                  ]
                : [
                      {
                          key:
                              "Refund Initiated",
                          label:
                              "Refund Initiated",
                          date:
                              order.refundInitiatedAt,
                          active: [
                              "Refund Initiated",
                              "Refund Completed",
                          ].includes(
                              returnStatus
                          ),
                      },

                      {
                          key:
                              "Refund Completed",
                          label:
                              "Refund Completed",
                          date:
                              order.refundCompletedAt,
                          active:
                              returnStatus ===
                              "Refund Completed",
                      },
                  ]),
        ];
    };

    // ==========================================
    // RETURN STATUS STYLE
    // ==========================================

    const returnStatusStyles = {
        Requested:
            "bg-yellow-100 text-yellow-700",

        Accepted:
            "bg-blue-100 text-blue-700",

        Returned:
            "bg-purple-100 text-purple-700",

        "Refund Initiated":
            "bg-indigo-100 text-indigo-700",

        "Refund Completed":
            "bg-green-100 text-green-700",

        Exchanged:
            "bg-green-100 text-green-700",

        Rejected:
            "bg-red-100 text-red-700",
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6">
            <div className="mx-auto max-w-6xl">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="mb-8">

                    <button
                        onClick={() =>
                            navigate("/my-orders")
                        }
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                        <ArrowLeft size={18} />

                        Back to My Orders
                    </button>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold">
                                Order Details
                            </h1>

                            <p className="mt-2 text-gray-500">

                                Order ID:{" "}

                                <span className="font-medium text-black">
                                    {order.orderId}
                                </span>

                            </p>

                        </div>

                        <span
                            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                                statusClasses[
                                    order.orderStatus
                                ] ||
                                "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {order.orderStatus}
                        </span>

                    </div>
                </div>

                {/* ==========================================
                    ORDER STATUS TRACKER
                ========================================== */}

                {order.orderStatus !==
                    "Cancelled" && (

                    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="mb-7 text-xl font-semibold">
                            Order Status
                        </h2>

                        <div className="flex items-center justify-between">

                            {statuses.map(
                                (
                                    status,
                                    index
                                ) => {

                                    const completed =
                                        currentIndex >=
                                        index;

                                    return (
                                        <div
                                            key={status}
                                            className="flex flex-1 items-center"
                                        >

                                            <div className="flex flex-col items-center">

                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                        completed
                                                            ? "bg-black text-white"
                                                            : "bg-gray-100 text-gray-400"
                                                    }`}
                                                >
                                                    {completed ? (
                                                        <CheckCircle
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    ) : (
                                                        <Package
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                <p
                                                    className={`mt-2 text-xs font-medium ${
                                                        completed
                                                            ? "text-black"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {
                                                        status
                                                    }
                                                </p>

                                            </div>

                                            {index <
                                                statuses.length -
                                                    1 && (

                                                <div
                                                    className={`mx-2 h-1 flex-1 rounded ${
                                                        currentIndex >
                                                        index
                                                            ? "bg-black"
                                                            : "bg-gray-100"
                                                    }`}
                                                />

                                            )}

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    </div>
                )}

                {/* ==========================================
                    CANCELLED
                ========================================== */}

                {order.orderStatus ===
                    "Cancelled" && (

                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">

                        <XCircle size={24} />

                        <div>

                            <p className="font-semibold">
                                Order Cancelled
                            </p>

                            <p className="text-sm">
                                This order has been cancelled.
                            </p>

                        </div>

                    </div>
                )}

                {/* ==========================================
                    RETURN / REFUND TRACKER
                ========================================== */}

                {hasReturnRequest && (

                    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    {order.returnType ===
                                    "Exchange" ? (
                                        <ArrowRightLeft
                                            size={22}
                                        />
                                    ) : (
                                        <RotateCcw
                                            size={22}
                                        />
                                    )}

                                    <h2 className="text-xl font-semibold">
                                        Return & Exchange
                                    </h2>

                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    Track your request status
                                </p>

                            </div>

                            <span
                                className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                                    returnStatusStyles[
                                        returnStatus
                                    ] ||
                                    "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {returnStatus}
                            </span>

                        </div>

                        {/* RETURN INFO */}

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Request Type
                                </p>

                                <p className="mt-1 font-semibold">
                                    {order.returnType ||
                                        "Return"}
                                </p>

                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Reason
                                </p>

                                <p className="mt-1 font-semibold">
                                    {order.returnReason ||
                                        "—"}
                                </p>

                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Refund Amount
                                </p>

                                <p className="mt-1 font-semibold">

                                    {order.refundAmount >
                                    0
                                        ? `₹${Number(
                                              order.refundAmount
                                          ).toLocaleString(
                                              "en-IN"
                                          )}`
                                        : "N/A"}

                                </p>

                            </div>

                        </div>

                        {/* DESCRIPTION */}

                        {order.returnDescription && (

                            <div className="mt-4 rounded-xl bg-gray-50 p-4">

                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Description
                                </p>

                                <p className="mt-2 text-sm leading-6 text-gray-700">
                                    {
                                        order.returnDescription
                                    }
                                </p>

                            </div>

                        )}

                        {/* REJECTED */}

                        {returnStatus ===
                            "Rejected" && (

                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

                                <XCircle
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                />

                                <div>

                                    <p className="font-semibold">
                                        Return request rejected
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Your return/exchange request was not approved.
                                    </p>

                                </div>

                            </div>
                        )}

                        {/* TIMELINE */}

                        {returnStatus !==
                            "Rejected" && (

                            <div className="mt-8">

                                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400">
                                    Request Timeline
                                </h3>

                                <div>

                                    {getReturnTimeline().map(
                                        (
                                            step,
                                            index,
                                            steps
                                        ) => (

                                            <div
                                                key={
                                                    step.key
                                                }
                                                className="flex gap-4"
                                            >

                                                {/* ICON */}

                                                <div className="flex flex-col items-center">

                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                            step.active
                                                                ? "bg-black text-white"
                                                                : "bg-gray-100 text-gray-400"
                                                        }`}
                                                    >

                                                        {step.active ? (
                                                            <CheckCircle
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        ) : (
                                                            <Clock
                                                                size={
                                                                    18
                                                                }
                                                            />
                                                        )}

                                                    </div>

                                                    {index <
                                                        steps.length -
                                                            1 && (

                                                        <div
                                                            className={`min-h-14 w-0.5 ${
                                                                step.active
                                                                    ? "bg-black"
                                                                    : "bg-gray-200"
                                                            }`}
                                                        />

                                                    )}

                                                </div>

                                                {/* CONTENT */}

                                                <div className="pb-7">

                                                    <p
                                                        className={`text-sm font-semibold ${
                                                            step.active
                                                                ? "text-black"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {
                                                            step.label
                                                        }
                                                    </p>

                                                    {step.date && (

                                                        <p className="mt-1 text-xs text-gray-400">

                                                            {new Date(
                                                                step.date
                                                            ).toLocaleString(
                                                                "en-IN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}

                                                        </p>

                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>
                        )}

                    </div>
                )}

                {/* ==========================================
                    MAIN GRID
                ========================================== */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* ======================================
                        LEFT
                    ====================================== */}

                    <div className="space-y-6 lg:col-span-2">

                        {/* ORDERED ITEMS */}

                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <Package size={20} />

                                <h2 className="text-xl font-semibold">
                                    Ordered Items
                                </h2>

                            </div>

                            <div className="divide-y">

                                {order.items?.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            key={`${item.product?._id || item.product || "item"}-${index}`}
                                            className="flex gap-4 py-5"
                                        >

                                            {/* IMAGE */}

                                            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                                                {item.image ? (

                                                    <img
                                                        src={
                                                            item.image
                                                        }
                                                        alt={
                                                            item.title ||
                                                            "Product"
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-full items-center justify-center">

                                                        <Package
                                                            size={
                                                                28
                                                            }
                                                            className="text-gray-400"
                                                        />

                                                    </div>
                                                )}

                                            </div>

                                            {/* INFO */}

                                            <div className="min-w-0 flex-1">

                                                <h3 className="font-semibold">
                                                    {
                                                        item.title
                                                    }
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Quantity:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Price: ₹
                                                    {
                                                        item.price
                                                    }
                                                </p>

                                                {order.orderStatus ===
                                                    "Delivered" && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReview(
                                                                item.product
                                                            )
                                                        }
                                                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                                    >

                                                        <Star
                                                            size={
                                                                16
                                                            }
                                                            fill="currentColor"
                                                        />

                                                        Write a Review

                                                    </button>
                                                )}

                                            </div>

                                            {/* SUBTOTAL */}

                                            <div className="text-right">

                                                <p className="font-semibold">
                                                    ₹
                                                    {
                                                        item.subtotal
                                                    }
                                                </p>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        </div>

                        {/* SHIPPING ADDRESS */}

                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <MapPin size={20} />

                                <h2 className="text-xl font-semibold">
                                    Shipping Address
                                </h2>

                            </div>

                            <div className="rounded-xl bg-gray-50 p-5">

                                <p className="font-semibold">
                                    {
                                        order
                                            .shippingAddress
                                            ?.fullName
                                    }
                                </p>

                                <p className="mt-2 text-sm text-gray-600">
                                    {
                                        order
                                            .shippingAddress
                                            ?.phone
                                    }
                                </p>

                                <p className="mt-2 text-sm text-gray-600">
                                    {
                                        order
                                            .shippingAddress
                                            ?.addressLine1
                                    }
                                </p>

                                {order.shippingAddress
                                    ?.addressLine2 && (

                                    <p className="text-sm text-gray-600">
                                        {
                                            order
                                                .shippingAddress
                                                .addressLine2
                                        }
                                    </p>

                                )}

                                <p className="text-sm text-gray-600">

                                    {
                                        order
                                            .shippingAddress
                                            ?.city
                                    }

                                    ,{" "}

                                    {
                                        order
                                            .shippingAddress
                                            ?.state
                                    }

                                    {" - "}

                                    {
                                        order
                                            .shippingAddress
                                            ?.postalCode
                                    }

                                </p>

                                <p className="text-sm text-gray-600">
                                    {
                                        order
                                            .shippingAddress
                                            ?.country
                                    }
                                </p>

                            </div>

                        </div>

                        {/* PAYMENT */}

                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <CreditCard size={20} />

                                <h2 className="text-xl font-semibold">
                                    Payment Information
                                </h2>

                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="rounded-xl bg-gray-50 p-4">

                                    <p className="text-sm text-gray-500">
                                        Payment Method
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {
                                            order.paymentMethod
                                        }
                                    </p>

                                </div>

                                <div className="rounded-xl bg-gray-50 p-4">

                                    <p className="text-sm text-gray-500">
                                        Payment Status
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {
                                            order.paymentStatus
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ======================================
                        RIGHT SIDEBAR
                    ====================================== */}

                    <div>

                        <div className="sticky top-24 space-y-6">

                            {/* PRICE */}

                            <div className="rounded-2xl bg-white p-6 shadow-sm">

                                <h2 className="text-xl font-semibold">
                                    Price Details
                                </h2>

                                <div className="mt-5 space-y-4">

                                    <div className="flex justify-between">

                                        <span className="text-gray-500">
                                            Subtotal
                                        </span>

                                        <span className="font-medium">
                                            ₹
                                            {
                                                order.subtotal
                                            }
                                        </span>

                                    </div>

                                    {order.discount >
                                        0 && (

                                        <div className="flex justify-between text-green-600">

                                            <span>
                                                Discount
                                            </span>

                                            <span>
                                                -₹
                                                {
                                                    order.discount
                                                }
                                            </span>

                                        </div>
                                    )}

                                    {order.couponCode && (

                                        <div className="flex justify-between text-sm">

                                            <span className="text-gray-500">
                                                Coupon
                                            </span>

                                            <span className="font-medium">
                                                {
                                                    order.couponCode
                                                }
                                            </span>

                                        </div>
                                    )}

                                    <div className="flex justify-between">

                                        <span className="text-gray-500">
                                            Shipping
                                        </span>

                                        <span className="font-medium text-green-600">
                                            Free
                                        </span>

                                    </div>

                                    <div className="border-t pt-4">

                                        <div className="flex justify-between">

                                            <span className="text-lg font-semibold">
                                                Total
                                            </span>

                                            <span className="text-xl font-bold">
                                                ₹
                                                {
                                                    order.totalAmount
                                                }
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* ======================================
                                ACTIONS
                            ====================================== */}

                            <div className="rounded-2xl bg-white p-6 shadow-sm">

                                <h2 className="text-lg font-semibold">
                                    Order Actions
                                </h2>

                                {/* CANCEL */}

                                {canCancel && (

                                    <button
                                        type="button"
                                        disabled={
                                            actionLoading
                                        }
                                        onClick={
                                            handleCancelOrder
                                        }
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {actionLoading ? (
                                            <Loader2
                                                size={
                                                    18
                                                }
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <XCircle
                                                size={
                                                    18
                                                }
                                            />
                                        )}

                                        Cancel Order

                                    </button>
                                )}

                                {/* RETURN / EXCHANGE */}

                                {canReturn && (

                                    <button
                                        type="button"
                                        disabled={
                                            actionLoading
                                        }
                                        onClick={() =>
                                            setShowReturnForm(
                                                !showReturnForm
                                            )
                                        }
                                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 py-3 font-medium text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
                                    >

                                        <RotateCcw
                                            size={18}
                                        />

                                        Return / Exchange

                                    </button>
                                )}

                                {/* EXISTING STATUS SUMMARY */}

                                {hasReturnRequest &&
                                    !showReturnForm && (

                                    <div className="mt-4 rounded-xl bg-gray-50 p-4">

                                        <div className="flex items-center justify-between gap-3">

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Return Status
                                                </p>

                                                <p className="mt-1 font-semibold">
                                                    {
                                                        returnStatus
                                                    }
                                                </p>

                                            </div>

                                            <RotateCcw
                                                size={20}
                                                className="text-gray-400"
                                            />

                                        </div>

                                        {order.returnReason && (

                                            <p className="mt-3 text-sm text-gray-500">

                                                Reason:{" "}

                                                <span className="text-gray-700">
                                                    {
                                                        order.returnReason
                                                    }
                                                </span>

                                            </p>
                                        )}

                                    </div>
                                )}

                                {/* ======================================
                                    RETURN FORM
                                ====================================== */}

                                {showReturnForm && (

                                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">

                                        <div className="mb-5">

                                            <h3 className="font-semibold">
                                                Return / Exchange Request
                                            </h3>

                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                Choose what you want to do with this order.
                                            </p>

                                        </div>

                                        {/* TYPE */}

                                        <div>

                                            <p className="mb-2 text-sm font-medium">
                                                Request Type
                                            </p>

                                            <div className="grid grid-cols-2 gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setReturnType(
                                                            "Return"
                                                        )
                                                    }
                                                    className={`rounded-xl border p-3 text-left transition ${
                                                        returnType ===
                                                        "Return"
                                                            ? "border-black bg-black text-white"
                                                            : "border-gray-200 bg-white hover:border-gray-400"
                                                    }`}
                                                >

                                                    <div className="flex items-center gap-2">

                                                        <RotateCcw
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        <span className="text-sm font-semibold">
                                                            Return
                                                        </span>

                                                    </div>

                                                    <p
                                                        className={`mt-1 text-[11px] ${
                                                            returnType ===
                                                            "Return"
                                                                ? "text-gray-300"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Get refund
                                                    </p>

                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setReturnType(
                                                            "Exchange"
                                                        )
                                                    }
                                                    className={`rounded-xl border p-3 text-left transition ${
                                                        returnType ===
                                                        "Exchange"
                                                            ? "border-black bg-black text-white"
                                                            : "border-gray-200 bg-white hover:border-gray-400"
                                                    }`}
                                                >

                                                    <div className="flex items-center gap-2">

                                                        <ArrowRightLeft
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        <span className="text-sm font-semibold">
                                                            Exchange
                                                        </span>

                                                    </div>

                                                    <p
                                                        className={`mt-1 text-[11px] ${
                                                            returnType ===
                                                            "Exchange"
                                                                ? "text-gray-300"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Replace item
                                                    </p>

                                                </button>

                                            </div>

                                        </div>

                                        {/* REASON */}

                                        <div className="mt-4">

                                            <label className="mb-2 block text-sm font-medium">
                                                Reason
                                            </label>

                                            <select
                                                value={
                                                    returnReason
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setReturnReason(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                                            >

                                                <option value="">
                                                    Select a reason
                                                </option>

                                                <option value="Wrong product received">
                                                    Wrong product received
                                                </option>

                                                <option value="Damaged product">
                                                    Damaged product
                                                </option>

                                                <option value="Product is defective">
                                                    Product is defective
                                                </option>

                                                <option value="Size issue">
                                                    Size issue
                                                </option>

                                                <option value="Color issue">
                                                    Color issue
                                                </option>

                                                <option value="Product not as expected">
                                                    Product not as expected
                                                </option>

                                                <option value="Changed my mind">
                                                    Changed my mind
                                                </option>

                                                <option value="Other">
                                                    Other
                                                </option>

                                            </select>

                                        </div>

                                        {/* DESCRIPTION */}

                                        <div className="mt-4">

                                            <label className="mb-2 block text-sm font-medium">
                                                Additional Details
                                            </label>

                                            <textarea
                                                value={
                                                    returnDescription
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setReturnDescription(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Tell us more about the issue..."
                                                rows={4}
                                                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                                            />

                                        </div>

                                        {/* BUTTONS */}

                                        <div className="mt-4 flex gap-2">

                                            <button
                                                type="button"
                                                disabled={
                                                    actionLoading
                                                }
                                                onClick={() => {

                                                    setShowReturnForm(
                                                        false
                                                    );

                                                    setReturnReason(
                                                        ""
                                                    );

                                                    setReturnDescription(
                                                        ""
                                                    );

                                                    setReturnType(
                                                        "Return"
                                                    );

                                                }}
                                                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    actionLoading
                                                }
                                                onClick={
                                                    handleReturnRequest
                                                }
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-3 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                {actionLoading && (

                                                    <Loader2
                                                        size={
                                                            16
                                                        }
                                                        className="animate-spin"
                                                    />

                                                )}

                                                Submit Request

                                            </button>

                                        </div>

                                    </div>
                                )}

                                {/* DELIVERED MESSAGE */}

                                {order.orderStatus ===
                                    "Delivered" &&
                                    !canReturn &&
                                    returnStatus ===
                                        "Not Requested" && (

                                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">

                                        <CheckCircle
                                            size={18}
                                        />

                                        Order delivered successfully.

                                    </div>
                                )}

                            </div>

                            {/* ORDER DATE */}

                            <div className="rounded-2xl bg-white p-6 shadow-sm">

                                <div className="flex items-center gap-3">

                                    <Truck size={20} />

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Order placed on
                                        </p>

                                        <p className="font-medium">

                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default OrderDetails;