import { Outlet } from "react-router-dom";
import { ShoppingBag, Sparkles } from "lucide-react";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-[#f7f7f5]">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* ================= LEFT BRANDING ================= */}

                <div className="relative hidden overflow-hidden bg-black lg:flex">

                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop')",
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between p-12 text-white">

                        {/* Logo */}

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
                                <ShoppingBag size={23} />
                            </div>

                            <span className="text-2xl font-bold tracking-tight">
                                NovaCart
                            </span>

                        </div>


                        {/* Main tagline */}

                        <div className="max-w-xl">

                            <div className="mb-5 flex items-center gap-2 text-sm text-gray-300">

                                <Sparkles size={16} />

                                <span>
                                    The smarter way to shop
                                </span>

                            </div>

                            <h1 className="text-5xl font-bold leading-tight xl:text-6xl">

                                Everything you want.
                                <br />

                                <span className="text-gray-400">
                                    One place.
                                </span>

                            </h1>

                            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-300">

                                Discover products you love, get
                                personalized recommendations, and
                                enjoy a seamless shopping experience
                                with NovaCart.

                            </p>

                        </div>


                        {/* Bottom */}

                        <p className="text-sm text-gray-500">

                            © 2026 NovaCart. All rights reserved.

                        </p>

                    </div>

                </div>


                {/* ================= RIGHT AUTH ================= */}

                <div className="flex min-h-screen items-center justify-center px-6 py-10">

                    <div className="w-full max-w-md">

                        {/* Mobile logo */}

                        <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">

                                <ShoppingBag size={21} />

                            </div>

                            <span className="text-2xl font-bold">
                                NovaCart
                            </span>

                        </div>


                        <Outlet />

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AuthLayout;