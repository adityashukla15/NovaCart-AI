import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package,
    ChevronRight,
    ShoppingBag,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { getMyOrders } from "../services/orderApi";

const MyOrders = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response = await getMyOrders();

                const data = response.data?.data || [];

                setOrders(data);

            } catch (error) {

                console.error(
                    "GET ORDERS ERROR:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Failed to load orders";

                toast.error(message);

            } finally {

                setLoading(false);

            }

        };

        fetchOrders();

    }, []);


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <Loader2
                        size={38}
                        className="mx-auto animate-spin"
                    />

                    <p className="mt-3 text-gray-500">
                        Loading your orders...
                    </p>

                </div>

            </div>
        );

    }


    // ======================================
    // NO ORDERS
    // ======================================

    if (orders.length === 0) {

        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">

                <div className="mx-auto max-w-5xl">

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">
                            My Orders
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Track and manage your orders
                        </p>

                    </div>

                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

                        <ShoppingBag
                            size={55}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-5 text-xl font-semibold">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You haven't placed any orders yet.
                        </p>

                        <button
                            onClick={() => navigate("/products")}
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
    // ORDERS
    // ======================================

    return (

        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6">

            <div className="mx-auto max-w-5xl">

                {/* HEADER */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold md:text-4xl">
                        My Orders
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Track and manage your orders
                    </p>

                </div>


                {/* ORDER LIST */}

                <div className="space-y-5">

                    {orders.map((order) => (

                        <div
                            key={order._id}
                            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
                        >

                            {/* TOP */}

                            <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                                        <Package size={22} />

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Order ID
                                        </p>

                                        <p className="font-semibold">
                                            {order.orderId}
                                        </p>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                                        order.orderStatus === "Delivered"
                                            ? "bg-green-100 text-green-700"
                                            : order.orderStatus === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : order.orderStatus === "Shipped"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {order.orderStatus}
                                </span>

                            </div>


                            {/* ORDER INFO */}

                            <div className="grid grid-cols-2 gap-4 py-5 md:grid-cols-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Date
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-sm text-gray-500">
                                        Items
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {order.items?.length || 0}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-sm text-gray-500">
                                        Total
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        ₹{order.totalAmount}
                                    </p>

                                </div>

                            </div>


                            {/* PRODUCTS PREVIEW */}

                            <div className="space-y-3">

                                {order.items?.slice(0, 2).map(
                                    (item, index) => (

                                        <div
                                            key={`${item.product || "product"}-${index}`}
                                            className="flex items-center gap-4"
                                        >

                                            <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">

                                                {item.image ? (

                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-full items-center justify-center">

                                                        <ShoppingBag
                                                            size={22}
                                                            className="text-gray-400"
                                                        />

                                                    </div>

                                                )}

                                            </div>


                                            <div className="min-w-0 flex-1">

                                                <p className="truncate font-medium">
                                                    {item.title}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>

                                            </div>


                                            <p className="font-medium">
                                                ₹{item.subtotal}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>


                            {/* MORE ITEMS */}

                            {order.items?.length > 2 && (

                                <p className="mt-3 text-sm text-gray-500">
                                    + {order.items.length - 2} more item(s)
                                </p>

                            )}


                            {/* VIEW ORDER */}

                            <div className="mt-5 border-t pt-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/orders/${order._id}`
                                        )
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-medium transition hover:bg-gray-50"
                                >

                                    View Order Details

                                    <ChevronRight size={18} />

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

};

export default MyOrders;