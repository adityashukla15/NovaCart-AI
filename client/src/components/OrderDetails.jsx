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


    // ======================================
    // STATES
    // ======================================

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [showReturnForm, setShowReturnForm] =
        useState(false);

    const [returnReason, setReturnReason] =
        useState("");


    // ======================================
    // FETCH ORDER
    // ======================================

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                setLoading(true);

                const response =
                    await getOrderById(id);

                const data =
                    response.data?.data;

                if (!data) {

                    throw new Error(
                        "Order not found"
                    );

                }

                setOrder(data);

            } catch (error) {

                console.error(
                    "ORDER DETAILS ERROR:",
                    error
                );

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


    // ======================================
    // CANCEL ORDER
    // ======================================

    const handleCancelOrder = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(true);

            const response =
                await cancelOrder(order._id);

            const updatedOrder =
                response.data?.data;

            setOrder(updatedOrder);

            toast.success(
                "Order cancelled successfully"
            );

        } catch (error) {

            console.error(
                "CANCEL ORDER ERROR:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to cancel order";

            toast.error(message);

        } finally {

            setActionLoading(false);

        }

    };


    // ======================================
    // REQUEST RETURN
    // ======================================

    const handleReturnRequest = async () => {

        if (!returnReason.trim()) {

            toast.error(
                "Please enter a return reason"
            );

            return;

        }


        try {

            setActionLoading(true);

            const response =
                await requestReturn(
                    order._id,
                    returnReason.trim()
                );

            const updatedOrder =
                response.data?.data;

            setOrder(updatedOrder);

            setShowReturnForm(false);

            setReturnReason("");

            toast.success(
                "Return request submitted successfully"
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


    // ======================================
    // LOADING
    // ======================================

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


    // ======================================
    // ORDER NOT FOUND
    // ======================================

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


    // ======================================
    // STATUS COLORS
    // ======================================

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


    // ======================================
    // STATUS STEPS
    // ======================================

    const statuses = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
    ];


    const currentIndex =
        statuses.indexOf(order.orderStatus);


    // ======================================
    // CAN CANCEL?
    // ======================================

    const canCancel =
        order.orderStatus !== "Cancelled" &&
        order.orderStatus !== "Shipped" &&
        order.orderStatus !== "Delivered";


    // ======================================
    // CAN RETURN?
    // ======================================

    const canReturn =
        order.orderStatus === "Delivered" &&
        order.returnStatus === "Not Requested";


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6">

            <div className="mx-auto max-w-6xl">


                {/* ==================================
                    HEADER
                ================================== */}

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


                {/* ==================================
                    ORDER TRACKING
                ================================== */}

                {order.orderStatus !== "Cancelled" && (

                    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="mb-7 text-xl font-semibold">
                            Order Status
                        </h2>


                        <div className="flex items-center justify-between">

                            {statuses.map(
                                (status, index) => {

                                    const completed =
                                        currentIndex >= index;

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
                                                            size={20}
                                                        />
                                                    ) : (
                                                        <Package
                                                            size={18}
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
                                                    {status}
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


                {/* ==================================
                    CANCELLED BANNER
                ================================== */}

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


                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">


                    {/* ==================================
                        LEFT
                    ================================== */}

                    <div className="space-y-6 lg:col-span-2">


                        {/* ==================================
                            PRODUCTS
                        ================================== */}

                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <Package size={20} />

                                <h2 className="text-xl font-semibold">
                                    Ordered Items
                                </h2>

                            </div>


                            <div className="divide-y">

                                {order.items?.map(
                                    (item, index) => (

                                    <div
                                        key={`${item.product || "item"}-${index}`}
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
                                                        item.title
                                                    }
                                                    className="h-full w-full object-cover"
                                                />

                                            ) : (

                                                <div className="flex h-full items-center justify-center">

                                                    <Package
                                                        size={28}
                                                        className="text-gray-400"
                                                    />

                                                </div>

                                            )}

                                        </div>


                                        {/* DETAILS */}

                                        <div className="min-w-0 flex-1">

                                            <h3 className="font-semibold">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Quantity:{" "}
                                                {item.quantity}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Price: ₹
                                                {item.price}
                                            </p>

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

                                ))}

                            </div>

                        </div>


                        {/* ==================================
                            SHIPPING ADDRESS
                        ================================== */}

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
                                        order.shippingAddress
                                            ?.fullName
                                    }
                                </p>

                                <p className="mt-2 text-sm text-gray-600">
                                    {
                                        order.shippingAddress
                                            ?.phone
                                    }
                                </p>

                                <p className="mt-2 text-sm text-gray-600">
                                    {
                                        order.shippingAddress
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
                                        order.shippingAddress
                                            ?.city
                                    }
                                    ,{" "}
                                    {
                                        order.shippingAddress
                                            ?.state
                                    }{" "}
                                    -{" "}
                                    {
                                        order.shippingAddress
                                            ?.postalCode
                                    }

                                </p>

                                <p className="text-sm text-gray-600">
                                    {
                                        order.shippingAddress
                                            ?.country
                                    }
                                </p>

                            </div>

                        </div>


                        {/* ==================================
                            PAYMENT
                        ================================== */}

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


                    {/* ==================================
                        RIGHT SIDE
                    ================================== */}

                    <div>

                        <div className="sticky top-24 space-y-6">


                            {/* ==================================
                                PRICE SUMMARY
                            ================================== */}

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
                                            ₹{order.subtotal}
                                        </span>

                                    </div>


                                    {order.discount > 0 && (

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


                            {/* ==================================
                                ACTIONS
                            ================================== */}

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
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <XCircle
                                                size={18}
                                            />
                                        )}

                                        Cancel Order

                                    </button>

                                )}


                                {/* RETURN */}

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

                                        Request Return

                                    </button>

                                )}


                                {/* RETURN STATUS */}

                                {order.returnStatus &&
                                    order.returnStatus !==
                                        "Not Requested" && (

                                    <div className="mt-4 rounded-xl bg-gray-50 p-4">

                                        <p className="text-sm text-gray-500">
                                            Return Status
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {
                                                order.returnStatus
                                            }
                                        </p>

                                        {order.returnReason && (

                                            <p className="mt-2 text-sm text-gray-500">
                                                Reason:{" "}
                                                {
                                                    order.returnReason
                                                }
                                            </p>

                                        )}

                                    </div>

                                )}


                                {/* RETURN FORM */}

                                {showReturnForm && (

                                    <div className="mt-4">

                                        <textarea
                                            value={
                                                returnReason
                                            }
                                            onChange={(e) =>
                                                setReturnReason(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Why do you want to return this order?"
                                            rows={4}
                                            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                                        />


                                        <button
                                            type="button"
                                            disabled={
                                                actionLoading
                                            }
                                            onClick={
                                                handleReturnRequest
                                            }
                                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                                        >

                                            {actionLoading && (
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                            )}

                                            Submit Return Request

                                        </button>

                                    </div>

                                )}


                                {/* DELIVERED */}

                                {order.orderStatus ===
                                    "Delivered" &&
                                    !canReturn &&
                                    order.returnStatus ===
                                        "Not Requested" && (

                                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">

                                        <CheckCircle
                                            size={18}
                                        />

                                        Order delivered successfully.

                                    </div>

                                )}

                            </div>


                            {/* ==================================
                                ORDER DATE
                            ================================== */}

                            <div className="rounded-2xl bg-white p-6 shadow-sm">

                                <div className="flex items-center gap-3">

                                    <Truck
                                        size={20}
                                    />

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