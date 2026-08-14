import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Ticket,
    Tags,
    BarChart3,
    ArrowLeft,
    RotateCcw,
} from "lucide-react";


const AdminSidebar = () => {

    const links = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
            end: true,
        },

        {
            name: "Products",
            path: "/admin/products",
            icon: Package,
        },

        {
            name: "Categories",
            path: "/admin/categories",
            icon: Tags,
        },

        {
            name: "Orders",
            path: "/admin/orders",
            icon: ShoppingBag,
        },

        {
            name: "Returns & Refunds",
            path: "/admin/returns",
            icon: RotateCcw,
        },

        {
            name: "Users",
            path: "/admin/users",
            icon: Users,
        },

        {
            name: "Coupons",
            path: "/admin/coupons",
            icon: Ticket,
        },

        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: BarChart3,
        },
    ];


    return (
        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">

            {/* =========================================
                LOGO
            ========================================= */}

            <div className="border-b border-gray-200 px-6 py-6">

                <h1 className="text-xl font-bold">
                    NovaCart AI
                </h1>

                <p className="mt-1 text-xs text-gray-500">
                    Admin Panel
                </p>

            </div>


            {/* =========================================
                NAVIGATION
            ========================================= */}

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">

                {links.map((link) => {

                    const Icon = link.icon;

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-black text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                }`
                            }
                        >

                            <Icon size={19} />

                            <span>
                                {link.name}
                            </span>

                        </NavLink>
                    );

                })}

            </nav>


            {/* =========================================
                BACK TO STORE
            ========================================= */}

            <div className="border-t border-gray-200 p-4">

                <NavLink
                    to="/"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
                >

                    <ArrowLeft size={19} />

                    <span>
                        Back to Store
                    </span>

                </NavLink>

            </div>

        </aside>
    );
};


export default AdminSidebar;