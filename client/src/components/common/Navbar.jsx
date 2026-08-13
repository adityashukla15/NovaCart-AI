import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    Heart,
    User,
    Package,
    LogOut,
    LayoutDashboard,
    Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [profileOpen, setProfileOpen] = useState(false);


    // ======================================
    // LOGOUT
    // ======================================

    const handleLogout = async () => {

        try {

            await logout();

            setProfileOpen(false);

            navigate("/login", {
                replace: true,
            });

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        }

    };


    // ======================================
    // CLOSE PROFILE DROPDOWN
    // ======================================

    const closeProfile = () => {

        setProfileOpen(false);

    };


    // ======================================
    // MY PROFILE
    // ======================================

    const handleMyProfile = () => {

        setProfileOpen(false);

        navigate("/profile");

    };


    // ======================================
    // ADMIN DASHBOARD
    // ======================================

    const handleAdminDashboard = () => {

        setProfileOpen(false);

        navigate("/admin");

    };


    // ======================================
    // RENDER
    // ======================================

    return (

        <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md">

            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">

                {/* ==================================
                    LOGO
                ================================== */}

                <Link
                    to="/"
                    className="group flex items-center gap-2"
                >

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm transition duration-200 group-hover:scale-105">
                        <ShoppingCart size={18} />
                    </div>

                    <div className="hidden sm:block">

                        <p className="text-[15px] font-bold tracking-tight text-gray-900">
                            NovaCart
                        </p>

                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            AI Shopping
                        </p>

                    </div>

                </Link>


                {/* ==================================
                    NAV LINKS
                ================================== */}

                <div className="hidden items-center gap-7 md:flex">

                    <Link
                        to="/"
                        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                    >
                        Home
                    </Link>


                    <Link
                        to="/shop"
                        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                    >
                        Shop
                    </Link>


                    <Link
                        to="/about"
                        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                    >
                        About
                    </Link>


                    <Link
                        to="/contact"
                        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                    >
                        Contact
                    </Link>

                </div>


                {/* ==================================
                    RIGHT SIDE
                ================================== */}

                <div className="flex items-center gap-1.5 sm:gap-2">


                    {/* ==================================
                        NOVA AI
                    ================================== */}

                    <Link
                        to="/ai"
                        title="Nova AI"
                        aria-label="Nova AI"
                        className="group relative mr-1 flex items-center gap-2 overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-3 py-2 text-gray-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md sm:px-3.5"
                    >

                        {/* Hover shine */}

                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />


                        {/* AI ICON */}

                        <span className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white shadow-sm">

                            <Sparkles
                                size={14}
                                className="transition-transform duration-300 group-hover:rotate-12"
                            />

                        </span>


                        {/* TEXT */}

                        <span className="relative hidden text-xs font-bold sm:block">
                            Nova AI
                        </span>


                        {/* BADGE */}

                        <span className="relative hidden rounded-full bg-gray-900 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white sm:block">
                            AI
                        </span>

                    </Link>


                    {/* ==================================
                        WISHLIST
                    ================================== */}

                    <Link
                        to="/wishlist"
                        title="Wishlist"
                        aria-label="Wishlist"
                        className="rounded-xl p-2.5 text-gray-600 transition duration-200 hover:bg-gray-100 hover:text-red-500"
                    >

                        <Heart
                            size={20}
                        />

                    </Link>


                    {/* ==================================
                        CART
                    ================================== */}

                    <Link
                        to="/cart"
                        title="Shopping Cart"
                        aria-label="Shopping Cart"
                        className="rounded-xl p-2.5 text-gray-600 transition duration-200 hover:bg-gray-100 hover:text-gray-900"
                    >

                        <ShoppingCart
                            size={20}
                        />

                    </Link>


                    {/* ==================================
                        PROFILE
                    ================================== */}

                    {user && (

                        <div className="relative ml-1">


                            {/* USER BUTTON */}

                            <button
                                type="button"
                                title="Account"
                                aria-label="Account"
                                onClick={() =>
                                    setProfileOpen(
                                        (prev) => !prev
                                    )
                                }
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
                                    profileOpen
                                        ? "border-gray-300 bg-gray-900 text-white shadow-sm"
                                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-900"
                                }`}
                            >

                                <User
                                    size={19}
                                />

                            </button>


                            {/* ==================================
                                PROFILE DROPDOWN
                            ================================== */}

                            {profileOpen && (

                                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">


                                    {/* ==================================
                                        USER INFO
                                    ================================== */}

                                    <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
                                                <User size={18} />
                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate font-semibold text-gray-900">
                                                    {user.name}
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-gray-500">
                                                    {user.email}
                                                </p>

                                            </div>

                                        </div>


                                        {/* ROLE */}

                                        <span
                                            className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                                user.role === "admin"
                                                    ? "bg-gray-900 text-white"
                                                    : "bg-white text-gray-500 ring-1 ring-gray-200"
                                            }`}
                                        >

                                            {user.role}

                                        </span>

                                    </div>


                                    {/* ==================================
                                        ADMIN DASHBOARD
                                        ONLY ADMIN
                                    ================================== */}

                                    {user.role === "admin" && (

                                        <button
                                            type="button"
                                            onClick={
                                                handleAdminDashboard
                                            }
                                            className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                                        >

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">

                                                <LayoutDashboard
                                                    size={16}
                                                />

                                            </div>

                                            Admin Dashboard

                                        </button>

                                    )}


                                    {/* ==================================
                                        MY PROFILE
                                    ================================== */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleMyProfile
                                        }
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                                    >

                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">

                                            <User
                                                size={16}
                                            />

                                        </div>

                                        My Profile

                                    </button>


                                    {/* ==================================
                                        MY ORDERS
                                    ================================== */}

                                    <Link
                                        to="/my-orders"
                                        onClick={closeProfile}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                                    >

                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">

                                            <Package
                                                size={16}
                                            />

                                        </div>

                                        My Orders

                                    </Link>


                                    {/* ==================================
                                        WISHLIST
                                    ================================== */}

                                    <Link
                                        to="/wishlist"
                                        onClick={closeProfile}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                                    >

                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">

                                            <Heart
                                                size={16}
                                                className="text-red-500"
                                            />

                                        </div>

                                        Wishlist

                                    </Link>


                                    {/* ==================================
                                        LOGOUT
                                    ================================== */}

                                    <div className="border-t border-gray-100">

                                        <button
                                            type="button"
                                            onClick={
                                                handleLogout
                                            }
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">

                                                <LogOut
                                                    size={16}
                                                />

                                            </div>

                                            Logout

                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </nav>

    );

};

export default Navbar;