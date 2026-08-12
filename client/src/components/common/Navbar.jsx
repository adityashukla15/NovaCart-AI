import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    Heart,
    User,
    Package,
    LogOut,
    LayoutDashboard,
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

        <nav className="border-b border-gray-200 bg-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">


                {/* ==================================
                    LOGO
                ================================== */}

                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight"
                >
                    NovaCart AI
                </Link>


                {/* ==================================
                    NAV LINKS
                ================================== */}

                <div className="hidden items-center gap-8 md:flex">

                    <Link
                        to="/"
                        className="text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                        Home
                    </Link>


                    <Link
                        to="/shop"
                        className="text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                        Shop
                    </Link>


                    <Link
                        to="/about"
                        className="text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                        About
                    </Link>


                    <Link
                        to="/contact"
                        className="text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                        Contact
                    </Link>

                </div>


                {/* ==================================
                    RIGHT SIDE
                ================================== */}

                <div className="flex items-center gap-2">


                    {/* ==================================
                        WISHLIST
                    ================================== */}

                    <Link
                        to="/wishlist"
                        title="Wishlist"
                        aria-label="Wishlist"
                        className="rounded-full p-2.5 text-gray-700 transition hover:bg-gray-100 hover:text-red-500"
                    >

                        <Heart
                            size={21}
                        />

                    </Link>


                    {/* ==================================
                        CART
                    ================================== */}

                    <Link
                        to="/cart"
                        title="Shopping Cart"
                        aria-label="Shopping Cart"
                        className="rounded-full p-2.5 text-gray-700 transition hover:bg-gray-100"
                    >

                        <ShoppingCart
                            size={21}
                        />

                    </Link>


                    {/* ==================================
                        PROFILE
                    ================================== */}

                    {user && (

                        <div className="relative">


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
                                className="rounded-full p-2.5 text-gray-700 transition hover:bg-gray-100"
                            >

                                <User
                                    size={21}
                                />

                            </button>


                            {/* ==================================
                                PROFILE DROPDOWN
                            ================================== */}

                            {profileOpen && (

                                <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">


                                    {/* ==================================
                                        USER INFO
                                    ================================== */}

                                    <div className="border-b border-gray-100 px-4 py-4">

                                        <p className="font-semibold text-gray-900">

                                            {user.name}

                                        </p>


                                        <p className="mt-1 truncate text-sm text-gray-500">

                                            {user.email}

                                        </p>


                                        {/* ROLE */}

                                        <span
                                            className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                user.role === "admin"
                                                    ? "bg-black text-white"
                                                    : "bg-gray-100 text-gray-600"
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

                                            <LayoutDashboard
                                                size={18}
                                            />

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

                                        <User
                                            size={18}
                                        />

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

                                        <Package
                                            size={18}
                                        />

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

                                        <Heart
                                            size={18}
                                            className="text-red-500"
                                        />

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
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                                        >

                                            <LogOut
                                                size={18}
                                            />

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