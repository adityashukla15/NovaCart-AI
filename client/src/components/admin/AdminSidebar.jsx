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
        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-gray-200 bg-white lg:block">

            {/* LOGO */}

            <div className="border-b border-gray-200 px-6 py-6">

                <h1 className="text-xl font-bold">
                    NovaCart AI
                </h1>

                <p className="mt-1 text-xs text-gray-500">
                    Admin Panel
                </p>

            </div>


            {/* NAVIGATION */}

            <nav className="space-y-1 p-4">

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
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                }`
                            }
                        >

                            <Icon size={19} />

                            {link.name}

                        </NavLink>
                    );

                })}

            </nav>


            {/* BACK TO STORE */}

            <div className="mt-auto border-t border-gray-200 p-4">

                <NavLink
                    to="/"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
                >

                    <ArrowLeft size={19} />

                    Back to Store

                </NavLink>

            </div>

        </aside>
    );
};

export default AdminSidebar;