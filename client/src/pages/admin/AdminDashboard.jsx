import { useEffect, useState } from "react";

import {
    Users,
    Package,
    ShoppingBag,
    IndianRupee,
    Star,
    AlertTriangle,
} from "lucide-react";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import toast from "react-hot-toast";

import {
    getAdminDashboard,
    getMonthlySales,
    getOrderAnalytics,
    getCategorySales,
} from "../../services/adminApi";


const AdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);

    const [monthlySales, setMonthlySales] = useState([]);

    const [orderAnalytics, setOrderAnalytics] = useState([]);

    const [categorySales, setCategorySales] = useState([]);

    const [loading, setLoading] = useState(true);


    // ======================================
    // FETCH ANALYTICS
    // ======================================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                const [
                    dashboardResponse,
                    monthlyResponse,
                    orderResponse,
                    categoryResponse,
                ] = await Promise.all([

                    getAdminDashboard(),

                    getMonthlySales(),

                    getOrderAnalytics(),

                    getCategorySales(),

                ]);


                setDashboard(
                    dashboardResponse.data?.data
                );


                const monthly =
                    monthlyResponse.data?.data || [];


                setMonthlySales(

                    monthly.map((item) => ({

                        month: `${item._id.month}/${item._id.year}`,

                        revenue: item.revenue || 0,

                        orders: item.orders || 0,

                    }))

                );


                const orderData =
                    orderResponse.data?.data || [];


                setOrderAnalytics(

                    orderData.map((item) => ({

                        name: item._id,

                        total: item.total,

                    }))

                );


                const categoryData =
                    categoryResponse.data?.data || [];


                setCategorySales(

                    categoryData.map((item) => ({

                        name: item._id,

                        revenue: item.revenue || 0,

                        sold: item.sold || 0,

                    }))

                );


            } catch (error) {

                console.error(
                    "ADMIN DASHBOARD ERROR:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load admin dashboard"
                );

            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, []);


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="flex min-h-[80vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-gray-500">
                        Loading admin dashboard...
                    </p>

                </div>

            </div>

        );

    }


    if (!dashboard) {

        return (

            <div className="p-10 text-center">

                <p className="text-red-500">
                    Unable to load dashboard.
                </p>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

            <div className="mx-auto max-w-7xl">


                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="mb-8">

                    <p className="text-sm font-medium text-gray-500">
                        NovaCart AI
                    </p>

                    <h1 className="mt-1 text-3xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your store and monitor performance.
                    </p>

                </div>


                {/* ======================================
                    STATS
                ====================================== */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">


                    <StatCard
                        title="Users"
                        value={dashboard.totalUsers}
                        icon={<Users size={21} />}
                    />


                    <StatCard
                        title="Products"
                        value={dashboard.totalProducts}
                        icon={<Package size={21} />}
                    />


                    <StatCard
                        title="Orders"
                        value={dashboard.totalOrders}
                        icon={<ShoppingBag size={21} />}
                    />


                    <StatCard
                        title="Revenue"
                        value={`₹${dashboard.totalRevenue}`}
                        icon={<IndianRupee size={21} />}
                    />


                    <StatCard
                        title="Reviews"
                        value={dashboard.totalReviews}
                        icon={<Star size={21} />}
                    />


                    <StatCard
                        title="Categories"
                        value={dashboard.totalCategories}
                        icon={<Package size={21} />}
                    />

                </div>


                {/* ======================================
                    CHARTS
                ====================================== */}

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">


                    {/* REVENUE */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold">
                            Monthly Revenue
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Revenue from paid orders
                        </p>

                        <div className="mt-6 h-80">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={monthlySales}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="month"
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(value) =>
                                            `₹${value}`
                                        }
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#000"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    {/* ORDERS */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold">
                            Monthly Orders
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Number of paid orders
                        </p>

                        <div className="mt-6 h-80">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={monthlySales}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="month"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="orders"
                                        fill="#111"
                                        radius={[6, 6, 0, 0]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    {/* ORDER STATUS */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold">
                            Order Status
                        </h2>

                        <div className="mt-6 h-80">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <PieChart>

                                    <Pie
                                        data={orderAnalytics}
                                        dataKey="total"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >

                                        {orderAnalytics.map(
                                            (_, index) => (

                                                <Cell
                                                    key={index}
                                                />

                                            )
                                        )}

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    {/* CATEGORY */}

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold">
                            Category Revenue
                        </h2>

                        <div className="mt-6 h-80">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={categorySales}
                                    layout="vertical"
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis type="number" />

                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={100}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            `₹${value}`
                                        }
                                    />

                                    <Bar
                                        dataKey="revenue"
                                        fill="#111"
                                        radius={[0, 6, 6, 0]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    LOW STOCK
                ====================================== */}

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="rounded-lg bg-red-50 p-2 text-red-500">

                            <AlertTriangle size={20} />

                        </div>

                        <div>

                            <h2 className="text-lg font-semibold">
                                Low Stock Products
                            </h2>

                            <p className="text-sm text-gray-500">
                                Products with less than 10 items.
                            </p>

                        </div>

                    </div>


                    <div className="mt-5 overflow-x-auto">

                        <table className="w-full min-w-150 text-left">

                            <thead>

                                <tr className="border-b text-sm text-gray-500">

                                    <th className="pb-3">
                                        Product
                                    </th>

                                    <th className="pb-3">
                                        Stock
                                    </th>

                                    <th className="pb-3">
                                        Price
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {dashboard.lowStockProducts?.map(
                                    (product) => (

                                        <tr
                                            key={product._id}
                                            className="border-b last:border-0"
                                        >

                                            <td className="py-4 font-medium">
                                                {product.title}
                                            </td>

                                            <td className="py-4 text-red-500">
                                                {product.stock}
                                            </td>

                                            <td className="py-4">
                                                ₹{product.price}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

};


// ======================================
// STAT CARD
// ======================================

const StatCard = ({
    title,
    value,
    icon,
}) => {

    return (

        <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <p className="text-sm text-gray-500">
                    {title}
                </p>

                <div className="rounded-lg bg-gray-100 p-2">
                    {icon}
                </div>

            </div>

            <p className="mt-4 text-2xl font-bold">
                {value}
            </p>

        </div>

    );

};


export default AdminDashboard;