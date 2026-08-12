import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    BarChart3,
    RefreshCw,
    IndianRupee,
    ShoppingBag,
    TrendingUp,
    CheckCircle,
    Clock,
    Truck,
    Package,
    XCircle,
    CreditCard,
    Layers3,
    Activity,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getMonthlySales,
    getOrderAnalytics,
    getCategorySales,
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

const STATUS_CONFIG = {
    Pending: {
        icon: Clock,
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        color: "#eab308",
    },

    Confirmed: {
        icon: CheckCircle,
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        color: "#6366f1",
    },

    Packed: {
        icon: Package,
        bg: "bg-purple-50",
        text: "text-purple-600",
        color: "#a855f7",
    },

    Shipped: {
        icon: Truck,
        bg: "bg-blue-50",
        text: "text-blue-600",
        color: "#3b82f6",
    },

    Delivered: {
        icon: CheckCircle,
        bg: "bg-green-50",
        text: "text-green-600",
        color: "#22c55e",
    },

    Cancelled: {
        icon: XCircle,
        bg: "bg-red-50",
        text: "text-red-600",
        color: "#ef4444",
    },
};

// ==========================================
// HELPERS
// ==========================================

const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatMonth = (year, month) => {
    if (!year || !month) {
        return "-";
    }

    return new Date(year, month - 1, 1).toLocaleDateString(
        "en-IN",
        {
            month: "short",
            year: "numeric",
        }
    );
};

// ==========================================
// COMPONENT
// ==========================================

const AdminAnalytics = () => {
    // ==========================================
    // STATES
    // ==========================================

    const [monthlySales, setMonthlySales] = useState([]);

    const [orderAnalytics, setOrderAnalytics] = useState([]);

    const [categorySales, setCategorySales] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    // ==========================================
    // INITIAL FETCH
    // ==========================================

    useEffect(() => {
        let cancelled = false;

        const fetchAnalytics = async () => {
            try {
                const [
                    monthlyResponse,
                    orderResponse,
                    categoryResponse,
                ] = await Promise.all([
                    getMonthlySales(),
                    getOrderAnalytics(),
                    getCategorySales(),
                ]);

                if (cancelled) {
                    return;
                }

                const monthlyData =
                    monthlyResponse?.data?.data;

                const orderData =
                    orderResponse?.data?.data;

                const categoryData =
                    categoryResponse?.data?.data;

                setMonthlySales(
                    Array.isArray(monthlyData)
                        ? monthlyData
                        : []
                );

                setOrderAnalytics(
                    Array.isArray(orderData)
                        ? orderData
                        : []
                );

                setCategorySales(
                    Array.isArray(categoryData)
                        ? categoryData
                        : []
                );

                setLoading(false);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "ANALYTICS ERROR:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load analytics"
                );

                setLoading(false);
            }
        };

        fetchAnalytics();

        return () => {
            cancelled = true;
        };
    }, []);

    // ==========================================
    // REFRESH
    // ==========================================

    const handleRefresh = useCallback(async () => {
        try {
            setRefreshing(true);

            const [
                monthlyResponse,
                orderResponse,
                categoryResponse,
            ] = await Promise.all([
                getMonthlySales(),
                getOrderAnalytics(),
                getCategorySales(),
            ]);

            const monthlyData =
                monthlyResponse?.data?.data;

            const orderData =
                orderResponse?.data?.data;

            const categoryData =
                categoryResponse?.data?.data;

            setMonthlySales(
                Array.isArray(monthlyData)
                    ? monthlyData
                    : []
            );

            setOrderAnalytics(
                Array.isArray(orderData)
                    ? orderData
                    : []
            );

            setCategorySales(
                Array.isArray(categoryData)
                    ? categoryData
                    : []
            );

            toast.success("Analytics refreshed");
        } catch (error) {
            console.error(
                "REFRESH ANALYTICS ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to refresh analytics"
            );
        } finally {
            setRefreshing(false);
        }
    }, []);

    // ==========================================
    // TOTAL REVENUE
    // ==========================================

    const totalRevenue = useMemo(() => {
        return monthlySales.reduce(
            (total, item) =>
                total +
                Number(item?.revenue || 0),
            0
        );
    }, [monthlySales]);

    // ==========================================
    // PAID ORDERS
    // ==========================================

    const paidOrders = useMemo(() => {
        return monthlySales.reduce(
            (total, item) =>
                total +
                Number(item?.orders || 0),
            0
        );
    }, [monthlySales]);

    // ==========================================
    // CATEGORY REVENUE
    // ==========================================

    const categoryRevenue = useMemo(() => {
        return categorySales.reduce(
            (total, item) =>
                total +
                Number(item?.revenue || 0),
            0
        );
    }, [categorySales]);

    // ==========================================
    // PRODUCTS SOLD
    // ==========================================

    const productsSold = useMemo(() => {
        return categorySales.reduce(
            (total, item) =>
                total +
                Number(item?.sold || 0),
            0
        );
    }, [categorySales]);

    // ==========================================
    // AVERAGE ORDER VALUE
    // ==========================================

    const averageOrderValue = useMemo(() => {
        if (!paidOrders) {
            return 0;
        }

        return totalRevenue / paidOrders;
    }, [
        totalRevenue,
        paidOrders,
    ]);

    // ==========================================
    // STATUS DATA
    // ==========================================

    const statusData = useMemo(() => {
        return ORDER_STATUSES.map(
            (status) => {
                const found =
                    orderAnalytics.find(
                        (item) =>
                            item?._id === status
                    );

                return {
                    status,
                    total: Number(
                        found?.total || 0
                    ),
                };
            }
        );
    }, [orderAnalytics]);

    // ==========================================
    // TOTAL STATUS ORDERS
    // ==========================================

    const totalStatusOrders = useMemo(() => {
        return statusData.reduce(
            (total, item) =>
                total + item.total,
            0
        );
    }, [statusData]);

    // ==========================================
    // MAX MONTHLY REVENUE
    // ==========================================

    const maxMonthlyRevenue = useMemo(() => {
        return Math.max(
            ...monthlySales.map(
                (item) =>
                    Number(
                        item?.revenue || 0
                    )
            ),
            1
        );
    }, [monthlySales]);

    // ==========================================
    // MAX CATEGORY REVENUE
    // ==========================================

    const maxCategoryRevenue = useMemo(() => {
        return Math.max(
            ...categorySales.map(
                (item) =>
                    Number(
                        item?.revenue || 0
                    )
            ),
            1
        );
    }, [categorySales]);

    // ==========================================
    // MONTHLY CHART POINTS
    // ==========================================

    const chartPoints = useMemo(() => {
        if (!monthlySales.length) {
            return [];
        }

        const width = 900;
        const height = 300;

        const paddingX = 30;
        const paddingY = 35;

        const usableWidth =
            width - paddingX * 2;

        const usableHeight =
            height - paddingY * 2;

        const step =
            monthlySales.length === 1
                ? 0
                : usableWidth /
                  (monthlySales.length - 1);

        return monthlySales.map(
            (item, index) => {
                const revenue = Number(
                    item?.revenue || 0
                );

                const x =
                    monthlySales.length === 1
                        ? width / 2
                        : paddingX +
                          index * step;

                const y =
                    height -
                    paddingY -
                    (revenue /
                        maxMonthlyRevenue) *
                        usableHeight;

                return {
                    x,
                    y,
                    revenue,
                    label: formatMonth(
                        item?._id?.year,
                        item?._id?.month
                    ),
                };
            }
        );
    }, [
        monthlySales,
        maxMonthlyRevenue,
    ]);

    // ==========================================
    // SVG LINE PATH
    // ==========================================

    const linePath = useMemo(() => {
        if (!chartPoints.length) {
            return "";
        }

        return chartPoints
            .map(
                (point, index) =>
                    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
            )
            .join(" ");
    }, [chartPoints]);

    // ==========================================
    // AREA PATH
    // ==========================================

    const areaPath = useMemo(() => {
        if (!chartPoints.length) {
            return "";
        }

        const first = chartPoints[0];

        const last =
            chartPoints[
                chartPoints.length - 1
            ];

        return `
            ${linePath}
            L ${last.x} 300
            L ${first.x} 300
            Z
        `;
    }, [chartPoints, linePath]);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-gray-50 px-4 py-8 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="animate-pulse">

                        <div className="h-8 w-48 rounded bg-gray-200" />

                        <div className="mt-3 h-4 w-80 rounded bg-gray-200" />

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-32 rounded-2xl bg-white"
                                    />
                                )
                            )}
                        </div>

                        <div className="mt-6 space-y-6">
                            <div className="h-96 rounded-2xl bg-white" />
                            <div className="h-96 rounded-2xl bg-white" />
                            <div className="h-96 rounded-2xl bg-white" />
                        </div>

                    </div>
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

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div>

                        <div className="flex items-center gap-2">

                            <BarChart3
                                size={22}
                                className="text-gray-700"
                            />

                            <p className="text-sm font-semibold text-gray-500">
                                NovaCart AI
                            </p>

                        </div>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                            Analytics
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Monitor revenue, orders and product performance.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <RefreshCw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}

                    </button>

                </div>

                {/* ==================================
                    STAT CARDS
                ================================== */}

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* REVENUE */}

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">

                                <IndianRupee
                                    size={21}
                                    className="text-green-600"
                                />

                            </div>

                            <TrendingUp
                                size={18}
                                className="text-green-500"
                            />

                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Total Revenue
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {formatCurrency(
                                totalRevenue
                            )}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Paid orders
                        </p>

                    </div>

                    {/* ORDERS */}

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                                <ShoppingBag
                                    size={21}
                                    className="text-blue-600"
                                />

                            </div>

                            <span className="text-xs font-semibold text-blue-600">
                                Orders
                            </span>

                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Paid Orders
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {paidOrders}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Across all months
                        </p>

                    </div>

                    {/* AOV */}

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">

                                <CreditCard
                                    size={21}
                                    className="text-purple-600"
                                />

                            </div>

                            <span className="text-xs font-semibold text-purple-600">
                                AOV
                            </span>

                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Average Order Value
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {formatCurrency(
                                averageOrderValue
                            )}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Average paid order
                        </p>

                    </div>

                    {/* PRODUCTS */}

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">

                                <Layers3
                                    size={21}
                                    className="text-orange-600"
                                />

                            </div>

                            <span className="text-xs font-semibold text-orange-600">
                                Products
                            </span>

                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Products Sold
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {productsSold}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Across categories
                        </p>

                    </div>

                </div>

                {/* ==================================
                    REVENUE TREND
                ================================== */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>

                            <div className="flex items-center gap-2">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

                                    <Activity
                                        size={18}
                                        className="text-indigo-600"
                                    />

                                </div>

                                <h2 className="text-lg font-bold text-gray-900">
                                    Revenue Trend
                                </h2>

                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                                Monthly paid-order performance
                            </p>

                        </div>

                        <div className="rounded-xl bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 px-4 py-3 text-white shadow-sm">

                            <p className="text-xs text-gray-300">
                                Total Revenue
                            </p>

                            <p className="mt-1 text-lg font-bold">
                                {formatCurrency(
                                    totalRevenue
                                )}
                            </p>

                        </div>

                    </div>

                    {monthlySales.length === 0 ? (

                        <div className="flex h-80 items-center justify-center">

                            <div className="text-center">

                                <BarChart3
                                    size={42}
                                    className="mx-auto text-gray-300"
                                />

                                <p className="mt-3 font-medium text-gray-500">
                                    No sales data available
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="mt-8 overflow-x-auto">

                            <div className="min-w-[700px]">

                                <svg
                                    viewBox="0 0 900 300"
                                    className="h-80 w-full"
                                    preserveAspectRatio="none"
                                >

                                    <defs>

                                        <linearGradient
                                            id="revenueGradient"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="1"
                                        >

                                            <stop
                                                offset="0%"
                                                stopColor="#6366f1"
                                                stopOpacity="0.30"
                                            />

                                            <stop
                                                offset="45%"
                                                stopColor="#8b5cf6"
                                                stopOpacity="0.20"
                                            />

                                            <stop
                                                offset="75%"
                                                stopColor="#ec4899"
                                                stopOpacity="0.14"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#22c55e"
                                                stopOpacity="0.03"
                                            />

                                        </linearGradient>

                                        <linearGradient
                                            id="revenueLineGradient"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >

                                            <stop
                                                offset="0%"
                                                stopColor="#4f46e5"
                                            />

                                            <stop
                                                offset="45%"
                                                stopColor="#7c3aed"
                                            />

                                            <stop
                                                offset="75%"
                                                stopColor="#db2777"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#16a34a"
                                            />

                                        </linearGradient>

                                    </defs>

                                    {/* GRID */}

                                    {[60, 120, 180, 240].map(
                                        (y) => (
                                            <line
                                                key={y}
                                                x1="30"
                                                x2="870"
                                                y1={y}
                                                y2={y}
                                                stroke="#f1f5f9"
                                                strokeWidth="1"
                                            />
                                        )
                                    )}

                                    {/* AREA */}

                                    <path
                                        d={areaPath}
                                        fill="url(#revenueGradient)"
                                    />

                                    {/* LINE */}

                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke="url(#revenueLineGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    {/* POINTS */}

                                    {chartPoints.map(
                                        (
                                            point,
                                            index
                                        ) => (

                                            <g
                                                key={`${point.label}-${index}`}
                                            >

                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="10"
                                                    fill="#8b5cf6"
                                                    opacity="0.10"
                                                />

                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="6"
                                                    fill="white"
                                                    stroke={
                                                        index % 3 === 0
                                                            ? "#4f46e5"
                                                            : index % 3 === 1
                                                            ? "#db2777"
                                                            : "#16a34a"
                                                    }
                                                    strokeWidth="3"
                                                />

                                                <title>
                                                    {point.label}:{" "}
                                                    {formatCurrency(
                                                        point.revenue
                                                    )}
                                                </title>

                                            </g>

                                        )
                                    )}

                                </svg>

                                {/* MONTH LABELS */}

                                <div className="flex justify-between gap-4 px-5">

                                    {monthlySales.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={`${item?._id?.year}-${item?._id?.month}-${index}`}
                                                className="min-w-0 flex-1 text-center"
                                            >

                                                <p className="truncate text-xs font-medium text-gray-500">
                                                    {formatMonth(
                                                        item?._id?.year,
                                                        item?._id?.month
                                                    )}
                                                </p>

                                                <p className="mt-1 truncate text-[11px] text-gray-400">
                                                    {formatCurrency(
                                                        item?.revenue
                                                    )}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* ==================================
                    ORDER DISTRIBUTION
                    FULL WIDTH
                ================================== */}

                <div className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                    <div>

                        <h2 className="text-lg font-bold text-gray-900">
                            Order Distribution
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Current order status breakdown
                        </p>

                    </div>

                    {totalStatusOrders === 0 ? (

                        <div className="flex h-80 items-center justify-center">

                            <div className="text-center">

                                <Package
                                    size={40}
                                    className="mx-auto text-gray-300"
                                />

                                <p className="mt-3 text-sm text-gray-500">
                                    No order data available
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center">

                            {/* DONUT */}

                            <div className="flex justify-center">

                                <div
                                    className="relative h-56 w-56 shrink-0 rounded-full"
                                    style={{
                                        background: (() => {

                                            let current = 0;

                                            const segments =
                                                statusData
                                                    .filter(
                                                        (item) =>
                                                            item.total > 0
                                                    )
                                                    .map(
                                                        (item) => {

                                                            const percentage =
                                                                (item.total /
                                                                    totalStatusOrders) *
                                                                100;

                                                            const start =
                                                                current;

                                                            current +=
                                                                percentage;

                                                            const config =
                                                                STATUS_CONFIG[
                                                                    item.status
                                                                ];

                                                            return `${config?.color || "#9ca3af"} ${start}% ${current}%`;
                                                        }
                                                    );

                                            if (
                                                !segments.length
                                            ) {
                                                return "#e5e7eb";
                                            }

                                            return `conic-gradient(${segments.join(
                                                ", "
                                            )})`;

                                        })(),
                                    }}
                                >

                                    <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-white">

                                        <span className="text-3xl font-bold text-gray-900">
                                            {totalStatusOrders}
                                        </span>

                                        <span className="text-center text-xs text-gray-400">
                                            Total Orders
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* STATUS LEGEND */}

                            <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">

                                {statusData.map(
                                    ({
                                        status,
                                        total,
                                    }) => {

                                        const config =
                                            STATUS_CONFIG[
                                                status
                                            ];

                                        const Icon =
                                            config?.icon ||
                                            Package;

                                        const percentage =
                                            totalStatusOrders
                                                ? (total /
                                                    totalStatusOrders) *
                                                  100
                                                : 0;

                                        return (

                                            <div
                                                key={status}
                                                className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3 transition hover:border-gray-200 hover:bg-gray-50"
                                            >

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                            config?.bg ||
                                                            "bg-gray-50"
                                                        }`}
                                                    >

                                                        <Icon
                                                            size={17}
                                                            className={
                                                                config?.text ||
                                                                "text-gray-500"
                                                            }
                                                        />

                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate text-sm font-semibold text-gray-800">
                                                            {status}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {percentage.toFixed(
                                                                1
                                                            )}
                                                            %
                                                        </p>

                                                    </div>

                                                </div>

                                                <p className="shrink-0 text-lg font-bold text-gray-900">
                                                    {total}
                                                </p>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </div>

                    )}

                </div>

                {/* ==================================
                    CATEGORY PERFORMANCE
                    BELOW ORDER DISTRIBUTION
                ================================== */}

                <div className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div className="min-w-0">

                            <h2 className="text-lg font-bold text-gray-900">
                                Category Performance
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Revenue contribution by category
                            </p>

                        </div>

                        <div className="w-fit shrink-0 rounded-xl bg-gray-50 px-4 py-2.5">

                            <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                Revenue
                            </p>

                            <p className="text-sm font-bold text-gray-900">
                                {formatCurrency(
                                    categoryRevenue
                                )}
                            </p>

                        </div>

                    </div>

                    {categorySales.length === 0 ? (

                        <div className="flex h-80 items-center justify-center">

                            <div className="text-center">

                                <Layers3
                                    size={40}
                                    className="mx-auto text-gray-300"
                                />

                                <p className="mt-3 text-sm text-gray-500">
                                    No category data available
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="mt-8 space-y-6">

                            {categorySales
                                .slice(0, 8)
                                .map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const revenue =
                                            Number(
                                                item?.revenue ||
                                                0
                                            );

                                        const sold =
                                            Number(
                                                item?.sold ||
                                                0
                                            );

                                        const percentage =
                                            categoryRevenue
                                                ? (revenue /
                                                    categoryRevenue) *
                                                  100
                                                : 0;

                                        const barWidth =
                                            maxCategoryRevenue
                                                ? (revenue /
                                                    maxCategoryRevenue) *
                                                  100
                                                : 0;

                                        return (

                                            <div
                                                key={`${item?._id || "category"}-${index}`}
                                                className="min-w-0"
                                            >

                                                <div className="flex min-w-0 items-center gap-4">

                                                    {/* RANK */}

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
                                                        {index + 1}
                                                    </div>

                                                    {/* CATEGORY + BAR */}

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                                {item?._id ||
                                                                    "Unknown Category"}
                                                            </p>

                                                            <span className="shrink-0 text-xs text-gray-400">
                                                                {sold}{" "}
                                                                sold
                                                            </span>

                                                        </div>

                                                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">

                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700"
                                                                style={{
                                                                    width: `${barWidth}%`,
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                    {/* REVENUE */}

                                                    <div className="w-28 shrink-0 text-right">

                                                        <p className="text-sm font-bold text-gray-900">
                                                            {formatCurrency(
                                                                revenue
                                                            )}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {percentage.toFixed(
                                                                1
                                                            )}
                                                            %
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                        </div>

                    )}

                </div>

                {/* ==================================
                    MONTHLY SALES DETAILS
                ================================== */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                    <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center">

                        <div>

                            <h2 className="text-lg font-bold text-gray-900">
                                Monthly Sales Details
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Detailed paid-order performance
                            </p>

                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-xl bg-green-50 px-3 py-2">

                            <TrendingUp
                                size={15}
                                className="text-green-600"
                            />

                            <span className="text-xs font-semibold text-green-700">
                                {formatCurrency(
                                    totalRevenue
                                )}
                            </span>

                        </div>

                    </div>

                    {monthlySales.length === 0 ? (

                        <div className="px-6 py-12 text-center">

                            <BarChart3
                                size={38}
                                className="mx-auto text-gray-300"
                            />

                            <p className="mt-3 text-sm text-gray-500">
                                No monthly sales available.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[650px]">

                                <thead>

                                    <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">

                                        <th className="px-6 py-4">
                                            Month
                                        </th>

                                        <th className="px-6 py-4">
                                            Orders
                                        </th>

                                        <th className="px-6 py-4">
                                            Revenue
                                        </th>

                                        <th className="px-6 py-4">
                                            Avg Order
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {[...monthlySales]
                                        .reverse()
                                        .map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const orders =
                                                    Number(
                                                        item?.orders ||
                                                        0
                                                    );

                                                const revenue =
                                                    Number(
                                                        item?.revenue ||
                                                        0
                                                    );

                                                const avg =
                                                    orders
                                                        ? revenue /
                                                          orders
                                                        : 0;

                                                return (

                                                    <tr
                                                        key={`${item?._id?.year}-${item?._id?.month}-${index}`}
                                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                                                    >

                                                        <td className="px-6 py-4">

                                                            <span className="font-semibold text-gray-900">
                                                                {formatMonth(
                                                                    item?._id?.year,
                                                                    item?._id?.month
                                                                )}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                                                {orders}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <span className="font-semibold text-gray-900">
                                                                {formatCurrency(
                                                                    revenue
                                                                )}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <span className="text-sm text-gray-500">
                                                                {formatCurrency(
                                                                    avg
                                                                )}
                                                            </span>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default AdminAnalytics;