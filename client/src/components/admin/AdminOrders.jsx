import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Search,
    RefreshCw,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    CreditCard,
    Eye,
    X,
    CircleDollarSign,
    WalletCards,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAdminOrders,
    updateOrderStatus,
    updatePaymentStatus,
} from "../../services/adminApi";


// ==========================================
// CONSTANTS
// ==========================================

const ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
];

const PAYMENT_STATUSES = [
    "Pending",
    "Paid",
    "Failed",
    "Refunded",
];


// ==========================================
// COMPONENT
// ==========================================

const AdminOrders = () => {

    // ==========================================
    // STATES
    // ==========================================
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [paymentFilter, setPaymentFilter] =
        useState("all");

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [actionLoading, setActionLoading] =
        useState(null);


    // ==========================================
    // LOAD ORDERS
    // ==========================================

    const loadOrders = useCallback(async () => {
    try {
        const response = await getAdminOrders();

        const data = response?.data?.data;

        setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("ADMIN ORDERS ERROR:", error);

        toast.error(
            error?.response?.data?.message ||
            "Failed to load orders"
        );
    }
}, []);


    // ==========================================
    // INITIAL LOAD
    // ==========================================

   useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
        try {
            const response = await getAdminOrders();

            if (cancelled) return;

            const data = response?.data?.data;

            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            if (cancelled) return;

            console.error("ADMIN ORDERS ERROR:", error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to load orders"
            );
        } finally {
            if (!cancelled) {
                setLoading(false);
            }
        }
    };

    fetchOrders();

    return () => {
        cancelled = true;
    };
}, []);


    // ==========================================
    // FILTERED ORDERS
    // ==========================================

    const filteredOrders = useMemo(() => {

        const searchText =
            search.toLowerCase().trim();

        return orders.filter((order) => {

            const orderId =
                order?.orderId
                    ?.toLowerCase() || "";

            const customerName =
                order?.user?.name
                    ?.toLowerCase() || "";

            const customerEmail =
                order?.user?.email
                    ?.toLowerCase() || "";

            const matchesSearch =
                !searchText ||
                orderId.includes(searchText) ||
                customerName.includes(searchText) ||
                customerEmail.includes(searchText);

            const matchesOrderStatus =
                statusFilter === "all" ||
                order?.orderStatus === statusFilter;

            const matchesPaymentStatus =
                paymentFilter === "all" ||
                order?.paymentStatus === paymentFilter;

            return (
                matchesSearch &&
                matchesOrderStatus &&
                matchesPaymentStatus
            );

        });

    }, [
        orders,
        search,
        statusFilter,
        paymentFilter,
    ]);


    // ==========================================
    // STATS
    // ==========================================

    const totalOrders = orders.length;


    const pendingOrders = useMemo(() => {

        return orders.filter(
            (order) =>
                order?.orderStatus === "Pending"
        ).length;

    }, [orders]);


    const deliveredOrders = useMemo(() => {

        return orders.filter(
            (order) =>
                order?.orderStatus === "Delivered"
        ).length;

    }, [orders]);


    // ==========================================
    // REVENUE
    // Paid + not cancelled
    // ==========================================

    const revenue = useMemo(() => {

        return orders.reduce(
            (total, order) => {

                if (
                    order?.paymentStatus === "Paid" &&
                    order?.orderStatus !== "Cancelled"
                ) {

                    return (
                        total +
                        Number(
                            order?.totalAmount || 0
                        )
                    );

                }

                return total;

            },
            0
        );

    }, [orders]);


    // ==========================================
    // UPDATE LOCAL ORDER
    // IMPORTANT:
    // Functional state update only
    // ==========================================

    const updateLocalOrder = useCallback(
        (orderId, changes) => {

            setOrders((currentOrders) => {

                return currentOrders.map(
                    (order) => {

                        if (
                            order._id !== orderId
                        ) {
                            return order;
                        }

                        return {
                            ...order,
                            ...changes,
                        };

                    }
                );

            });

            setSelectedOrder((currentOrder) => {

                if (
                    !currentOrder ||
                    currentOrder._id !== orderId
                ) {
                    return currentOrder;
                }

                return {
                    ...currentOrder,
                    ...changes,
                };

            });

        },
        []
    );


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    const handleOrderStatusChange = async (
        orderId,
        newStatus
    ) => {

        if (!orderId || !newStatus) {
            return;
        }

        try {

            setActionLoading(orderId);

            await updateOrderStatus(
                orderId,
                newStatus
            );

            // Functional update
            updateLocalOrder(
                orderId,
                {
                    orderStatus: newStatus,
                }
            );

            toast.success(
                `Order marked as ${newStatus}`
            );

        } catch (error) {

            console.error(
                "UPDATE ORDER STATUS ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to update order status"
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ==========================================
    // UPDATE PAYMENT STATUS
    // ==========================================

    const handlePaymentStatusChange = async (
        orderId,
        newPaymentStatus
    ) => {

        if (
            !orderId ||
            !newPaymentStatus
        ) {
            return;
        }

        try {

            setActionLoading(orderId);

            await updatePaymentStatus(
                orderId,
                newPaymentStatus
            );

            /*
             * Important:
             *
             * Payment status changes inside
             * orders using functional state update.
             *
             * Revenue automatically recalculates
             * because revenue depends on orders.
             */

            updateLocalOrder(
                orderId,
                {
                    paymentStatus:
                        newPaymentStatus,
                }
            );

            toast.success(
                `Payment marked as ${newPaymentStatus}`
            );

        } catch (error) {

            console.error(
                "UPDATE PAYMENT STATUS ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to update payment status"
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ==========================================
    // STATUS ICON
    // ==========================================

    const getStatusIcon = (status) => {

        switch (status) {

            case "Delivered":
                return (
                    <CheckCircle size={15} />
                );

            case "Shipped":
                return (
                    <Truck size={15} />
                );

            case "Cancelled":
                return (
                    <XCircle size={15} />
                );

            case "Packed":
                return (
                    <Package size={15} />
                );

            default:
                return (
                    <Clock size={15} />
                );

        }

    };


    // ==========================================
    // ORDER STATUS STYLE
    // ==========================================

    const getStatusClass = (status) => {

        switch (status) {

            case "Delivered":
                return "bg-green-50 text-green-600";

            case "Shipped":
                return "bg-blue-50 text-blue-600";

            case "Packed":
                return "bg-purple-50 text-purple-600";

            case "Confirmed":
                return "bg-indigo-50 text-indigo-600";

            case "Cancelled":
                return "bg-red-50 text-red-600";

            default:
                return "bg-yellow-50 text-yellow-600";

        }

    };


    // ==========================================
    // PAYMENT STYLE
    // ==========================================

    const getPaymentClass = (
        paymentStatus
    ) => {

        switch (paymentStatus) {

            case "Paid":
                return "bg-green-50 text-green-600";

            case "Failed":
                return "bg-red-50 text-red-600";

            case "Refunded":
                return "bg-purple-50 text-purple-600";

            default:
                return "bg-yellow-50 text-yellow-600";

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-gray-500">
                        Loading orders...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

            <div className="mx-auto max-w-7xl">


                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div>

                        <p className="text-sm font-medium text-gray-500">
                            NovaCart AI
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Orders
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage orders, payments and delivery.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadOrders}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                    >

                        <RefreshCw size={18} />

                        Refresh

                    </button>

                </div>


                {/* ======================================
                    STATS
                ====================================== */}

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


                    {/* TOTAL ORDERS */}

                    <div className="rounded-2xl bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <Package
                                size={20}
                                className="text-gray-400"
                            />

                        </div>

                        <h2 className="mt-3 text-2xl font-bold">
                            {totalOrders}
                        </h2>

                    </div>


                    {/* PENDING */}

                    <div className="rounded-2xl bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <p className="text-sm text-gray-500">
                                Pending
                            </p>

                            <Clock
                                size={20}
                                className="text-yellow-500"
                            />

                        </div>

                        <h2 className="mt-3 text-2xl font-bold">
                            {pendingOrders}
                        </h2>

                    </div>


                    {/* DELIVERED */}

                    <div className="rounded-2xl bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <p className="text-sm text-gray-500">
                                Delivered
                            </p>

                            <CheckCircle
                                size={20}
                                className="text-green-500"
                            />

                        </div>

                        <h2 className="mt-3 text-2xl font-bold">
                            {deliveredOrders}
                        </h2>

                    </div>


                    {/* REVENUE */}

                    <div className="rounded-2xl bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <p className="text-sm text-gray-500">
                                Revenue
                            </p>

                            <CircleDollarSign
                                size={20}
                                className="text-green-500"
                            />

                        </div>

                        <h2 className="mt-3 text-2xl font-bold">
                            ₹
                            {revenue.toLocaleString(
                                "en-IN"
                            )}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Paid orders only
                        </p>

                    </div>

                </div>


                {/* ======================================
                    FILTERS
                ====================================== */}

                <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm lg:flex-row">


                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search order ID, customer..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
                        />

                    </div>


                    {/* ORDER FILTER */}

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    >

                        <option value="all">
                            All Order Status
                        </option>

                        {ORDER_STATUSES.map(
                            (status) => (

                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>

                            )
                        )}

                    </select>


                    {/* PAYMENT FILTER */}

                    <select
                        value={paymentFilter}
                        onChange={(event) =>
                            setPaymentFilter(
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    >

                        <option value="all">
                            All Payment Status
                        </option>

                        {PAYMENT_STATUSES.map(
                            (status) => (

                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* COUNT */}

                <div className="mt-5">

                    <p className="text-sm text-gray-500">

                        Showing{" "}

                        <span className="font-semibold text-gray-900">
                            {filteredOrders.length}
                        </span>{" "}

                        orders

                    </p>

                </div>


                {/* ======================================
                    TABLE
                ====================================== */}

                <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-312.5">

                            <thead>

                                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">

                                    <th className="px-6 py-4">
                                        Order
                                    </th>

                                    <th className="px-6 py-4">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4">
                                        Items
                                    </th>

                                    <th className="px-6 py-4">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4">
                                        Payment
                                    </th>

                                    <th className="px-6 py-4">
                                        Order Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredOrders.map(
                                    (order) => {

                                        const isUpdating =
                                            actionLoading ===
                                            order._id;

                                        const itemCount =
                                            order.items?.reduce(
                                                (
                                                    total,
                                                    item
                                                ) =>
                                                    total +
                                                    Number(
                                                        item.quantity ||
                                                        0
                                                    ),
                                                0
                                            ) || 0;

                                        return (

                                            <tr
                                                key={order._id}
                                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                            >


                                                {/* ORDER */}

                                                <td className="px-6 py-5">

                                                    <p className="font-semibold">
                                                        #{order.orderId}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">

                                                        {order.createdAt
                                                            ? new Date(
                                                                order.createdAt
                                                            ).toLocaleDateString(
                                                                "en-IN"
                                                            )
                                                            : "-"}

                                                    </p>

                                                </td>


                                                {/* CUSTOMER */}

                                                <td className="px-6 py-5">

                                                    <p className="font-medium">
                                                        {order.user?.name ||
                                                            "Unknown"}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {order.user?.email ||
                                                            "-"}
                                                    </p>

                                                </td>


                                                {/* ITEMS */}

                                                <td className="px-6 py-5">

                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">

                                                        {itemCount}{" "}
                                                        items

                                                    </span>

                                                </td>


                                                {/* AMOUNT */}

                                                <td className="px-6 py-5">

                                                    <p className="font-semibold">

                                                        ₹
                                                        {Number(
                                                            order.totalAmount ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </p>

                                                </td>


                                                {/* =================================
                                                    PAYMENT
                                                ================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="flex flex-col gap-2">

                                                        <span
                                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClass(
                                                                order.paymentStatus
                                                            )}`}
                                                        >

                                                            {order.paymentStatus}

                                                        </span>

                                                        <span className="text-xs text-gray-400">

                                                            {order.paymentMethod ||
                                                                "-"}

                                                        </span>


                                                        {/* PAYMENT SELECT */}

                                                        <select
                                                            value={
                                                                order.paymentStatus ||
                                                                "Pending"
                                                            }
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                handlePaymentStatusChange(
                                                                    order._id,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="mt-1 rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-medium outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {PAYMENT_STATUSES.map(
                                                                (
                                                                    status
                                                                ) => (

                                                                    <option
                                                                        key={
                                                                            status
                                                                        }
                                                                        value={
                                                                            status
                                                                        }
                                                                    >
                                                                        {status}
                                                                    </option>

                                                                )
                                                            )}

                                                        </select>

                                                    </div>

                                                </td>


                                                {/* =================================
                                                    ORDER STATUS
                                                ================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="flex flex-col gap-2">

                                                        <span
                                                            className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                                order.orderStatus
                                                            )}`}
                                                        >

                                                            {getStatusIcon(
                                                                order.orderStatus
                                                            )}

                                                            {order.orderStatus}

                                                        </span>


                                                        {/* STATUS SELECT */}

                                                        <select
                                                            value={
                                                                order.orderStatus ||
                                                                "Pending"
                                                            }
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                handleOrderStatusChange(
                                                                    order._id,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-medium outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {ORDER_STATUSES.map(
                                                                (
                                                                    status
                                                                ) => (

                                                                    <option
                                                                        key={
                                                                            status
                                                                        }
                                                                        value={
                                                                            status
                                                                        }
                                                                    >
                                                                        {status}
                                                                    </option>

                                                                )
                                                            )}

                                                        </select>

                                                    </div>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-6 py-5">

                                                    <div className="flex justify-end">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedOrder(
                                                                    order
                                                                )
                                                            }
                                                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-gray-50"
                                                        >

                                                            <Eye
                                                                size={16}
                                                            />

                                                            View

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* EMPTY */}

                    {filteredOrders.length === 0 && (

                        <div className="px-6 py-16 text-center">

                            <Package
                                size={42}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 font-semibold">
                                No orders found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your filters.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* ==========================================
                ORDER DETAILS MODAL
            ========================================== */}

            {selectedOrder && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedOrder(null);
                        }

                    }}
                >

                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">


                        {/* HEADER */}

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Order Details
                                </p>

                                <h2 className="text-xl font-bold">
                                    #{selectedOrder.orderId}
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedOrder(null)
                                }
                                className="rounded-lg p-2 transition hover:bg-gray-100"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        <div className="space-y-6 p-6">


                            {/* =================================
                                CUSTOMER
                            ================================= */}

                            <div className="rounded-xl bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">

                                        <Package
                                            size={18}
                                            className="text-gray-500"
                                        />

                                    </div>

                                    <div>

                                        <h3 className="font-semibold">
                                            Customer
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {selectedOrder.user?.name ||
                                                "Unknown"}
                                        </p>

                                    </div>

                                </div>


                                <p className="mt-3 text-sm text-gray-500">

                                    {selectedOrder.user?.email ||
                                        "-"}

                                </p>

                            </div>


                            {/* =================================
                                ITEMS
                            ================================= */}

                            <div>

                                <div className="mb-3 flex items-center justify-between">

                                    <h3 className="font-semibold">
                                        Order Items
                                    </h3>

                                    <span className="text-sm text-gray-500">

                                        {selectedOrder.items?.length ||
                                            0}{" "}
                                        products

                                    </span>

                                </div>


                                <div className="space-y-3">

                                    {selectedOrder.items?.map(
                                        (item, index) => (

                                            <div
                                                key={`${item.product || "product"}-${index}`}
                                                className="flex items-center gap-4 rounded-xl border border-gray-100 p-3"
                                            >

                                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">

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
                                                                size={20}
                                                                className="text-gray-300"
                                                            />

                                                        </div>

                                                    )}

                                                </div>


                                                <div className="min-w-0 flex-1">

                                                    <p className="font-medium">
                                                        {item.title ||
                                                            "Product"}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">

                                                        ₹
                                                        {Number(
                                                            item.price ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                        {" × "}

                                                        {item.quantity ||
                                                            0}

                                                    </p>

                                                </div>


                                                <p className="font-semibold">

                                                    ₹
                                                    {Number(
                                                        item.subtotal ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>


                            {/* =================================
                                SHIPPING
                            ================================= */}

                            <div className="rounded-xl border border-gray-100 p-5">

                                <h3 className="font-semibold">
                                    Shipping Address
                                </h3>

                                <div className="mt-3 text-sm text-gray-500">

                                    <p className="font-medium text-gray-900">
                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.fullName
                                        }
                                    </p>

                                    <p className="mt-1">

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.phone
                                        }

                                    </p>

                                    <p className="mt-2">

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.addressLine1
                                        }

                                        {selectedOrder
                                            .shippingAddress
                                            ?.addressLine2 && (
                                            <>
                                                ,{" "}
                                                {
                                                    selectedOrder
                                                        .shippingAddress
                                                        .addressLine2
                                                }
                                            </>
                                        )}

                                    </p>

                                    <p>

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.city
                                        }

                                        ,{" "}

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.state
                                        }

                                        {" - "}

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.postalCode
                                        }

                                    </p>

                                    <p>

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.country
                                        }

                                    </p>

                                </div>

                            </div>


                            {/* =================================
                                CONTROLS
                            ================================= */}

                            <div className="grid gap-4 md:grid-cols-2">


                                {/* ORDER STATUS */}

                                <div className="rounded-xl border border-gray-100 p-5">

                                    <div className="flex items-center gap-2">

                                        <Truck
                                            size={18}
                                            className="text-blue-500"
                                        />

                                        <label className="font-semibold">
                                            Order Status
                                        </label>

                                    </div>

                                    <select
                                        value={
                                            selectedOrder.orderStatus ||
                                            "Pending"
                                        }
                                        disabled={
                                            actionLoading ===
                                            selectedOrder._id
                                        }
                                        onChange={(event) =>
                                            handleOrderStatusChange(
                                                selectedOrder._id,
                                                event.target.value
                                            )
                                        }
                                        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black disabled:opacity-50"
                                    >

                                        {ORDER_STATUSES.map(
                                            (status) => (

                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* PAYMENT */}

                                <div className="rounded-xl border border-gray-100 p-5">

                                    <div className="flex items-center gap-2">

                                        <WalletCards
                                            size={18}
                                            className="text-green-500"
                                        />

                                        <label className="font-semibold">
                                            Payment Status
                                        </label>

                                    </div>

                                    <select
                                        value={
                                            selectedOrder.paymentStatus ||
                                            "Pending"
                                        }
                                        disabled={
                                            actionLoading ===
                                            selectedOrder._id
                                        }
                                        onChange={(event) =>
                                            handlePaymentStatusChange(
                                                selectedOrder._id,
                                                event.target.value
                                            )
                                        }
                                        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black disabled:opacity-50"
                                    >

                                        {PAYMENT_STATUSES.map(
                                            (status) => (

                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>


                            {/* =================================
                                PAYMENT SUMMARY
                            ================================= */}

                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">

                                            <CreditCard
                                                size={18}
                                                className="text-gray-500"
                                            />

                                        </div>

                                        <div>

                                            <p className="text-sm text-gray-500">
                                                Payment
                                            </p>

                                            <p className="font-semibold">
                                                {selectedOrder.paymentMethod ||
                                                    "-"}
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClass(
                                            selectedOrder.paymentStatus
                                        )}`}
                                    >
                                        {
                                            selectedOrder.paymentStatus
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* =================================
                                TOTAL
                            ================================= */}

                            <div className="rounded-2xl bg-gray-900 p-6 text-white">

                                <div className="flex justify-between text-sm text-gray-300">

                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        ₹
                                        {Number(
                                            selectedOrder.subtotal ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>


                                <div className="mt-3 flex justify-between text-sm text-gray-300">

                                    <span>
                                        Discount
                                    </span>

                                    <span>
                                        - ₹
                                        {Number(
                                            selectedOrder.discount ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>


                                <div className="my-4 border-t border-gray-700" />


                                <div className="flex items-center justify-between">

                                    <span className="font-semibold">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold">

                                        ₹
                                        {Number(
                                            selectedOrder.totalAmount ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </span>

                                </div>


                                {selectedOrder.paymentStatus ===
                                    "Paid" && (

                                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-300">

                                        <CheckCircle
                                            size={16}
                                        />

                                        Payment received

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default AdminOrders;