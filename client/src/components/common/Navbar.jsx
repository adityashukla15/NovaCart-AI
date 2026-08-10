import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    Heart,
    User,
    Package,
    LogOut,
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


    return (

        <nav className="border-b border-gray-200 bg-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">


                {/* ================= LOGO ================= */}

                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight"
                >
                    NovaCart AI
                </Link>


                {/* ================= NAV LINKS ================= */}

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


                {/* ================= RIGHT ICONS ================= */}

                <div className="flex items-center gap-2">


                    {/* ================= WISHLIST ================= */}

                    <Link
                        to="/wishlist"
                        title="Wishlist"
                        className="rounded-full p-2.5 text-gray-700 transition hover:bg-gray-100 hover:text-red-500"
                    >

                        <Heart size={21} />

                    </Link>


                    {/* ================= CART ================= */}

                    <Link
                        to="/cart"
                        title="Shopping Cart"
                        className="rounded-full p-2.5 text-gray-700 transition hover:bg-gray-100"
                    >

                        <ShoppingCart size={21} />

                    </Link>


                    {/* ================= PROFILE ================= */}

                    {user && (

                        <div className="relative">

                            {/* User Button */}

                            <button
                                type="button"
                                title="Account"
                                onClick={() =>
                                    setProfileOpen(
                                        !profileOpen
                                    )
                                }
                                className="rounded-full p-2.5 text-gray-700 transition hover:bg-gray-100"
                            >

                                <User size={21} />

                            </button>


                            {/* ================= DROPDOWN ================= */}

                            {profileOpen && (

                                <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">


                                    {/* USER INFO */}

                                    <div className="border-b border-gray-100 px-4 py-4">

                                        <p className="font-semibold text-gray-900">

                                            {user.name}

                                        </p>

                                        <p className="mt-1 truncate text-sm text-gray-500">

                                            {user.email}

                                        </p>

                                    </div>


                                    {/* ================= PROFILE ================= */}

                                    <Link
                                        to="/profile"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                                    >

                                        <User size={18} />

                                        Profile

                                    </Link>


                                    {/* ================= ORDERS ================= */}

                                    <Link
                                        to="/orders"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                                    >

                                        <Package size={18} />

                                        My Orders

                                    </Link>


                                    {/* ================= WISHLIST ================= */}

                                    <Link
                                        to="/wishlist"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                                    >

                                        <Heart size={18} />

                                        Wishlist

                                    </Link>


                                    {/* ================= LOGOUT ================= */}

                                    <div className="border-t border-gray-100">

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                                        >

                                            <LogOut size={18} />

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