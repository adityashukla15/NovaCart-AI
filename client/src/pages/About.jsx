import { Link } from "react-router-dom";
import {
    ShoppingCart,
    Sparkles,
    ShieldCheck,
    Truck,
    Heart,
    ArrowRight,
    Zap,
} from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* ======================================
                HERO SECTION
            ====================================== */}

            <section className="relative overflow-hidden border-b border-gray-100">

                {/* Background decoration */}

                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-100/60 blur-3xl" />

                <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">

                    <div className="mx-auto max-w-3xl text-center">

                        {/* Badge */}

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">

                            <Sparkles size={14} />

                            Smarter Shopping with AI

                        </div>


                        {/* Heading */}

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

                            Shopping made{" "}

                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">

                                smarter.

                            </span>

                        </h1>


                        {/* Description */}

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">

                            NovaCart is an AI-powered shopping platform built
                            to make discovering, comparing, and buying products
                            simpler, faster, and more personalized.

                        </p>


                        {/* Buttons */}

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                            {/* EXPLORE PRODUCTS */}

                            <Link
                                to="/shop"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-xl"
                            >

                                Explore Products

                                <ArrowRight
                                    size={17}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />

                            </Link>


                            {/* NOVA AI */}

                            <Link
                                to="/ai"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                            >

                                <Sparkles size={17} />

                                Try Nova AI

                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* ======================================
                STATS
            ====================================== */}

            <section className="border-b border-gray-100 bg-gray-50/60">

                <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200 sm:grid-cols-4">

                    <div className="px-6 py-8 text-center">

                        <p className="text-2xl font-bold text-gray-900">
                            AI
                        </p>

                        <p className="mt-1 text-xs font-medium text-gray-500">
                            Powered Shopping
                        </p>

                    </div>


                    <div className="px-6 py-8 text-center">

                        <p className="text-2xl font-bold text-gray-900">
                            24/7
                        </p>

                        <p className="mt-1 text-xs font-medium text-gray-500">
                            Shopping Experience
                        </p>

                    </div>


                    <div className="px-6 py-8 text-center">

                        <p className="text-2xl font-bold text-gray-900">
                            Fast
                        </p>

                        <p className="mt-1 text-xs font-medium text-gray-500">
                            Product Discovery
                        </p>

                    </div>


                    <div className="px-6 py-8 text-center">

                        <p className="text-2xl font-bold text-gray-900">
                            Secure
                        </p>

                        <p className="mt-1 text-xs font-medium text-gray-500">
                            Checkout Experience
                        </p>

                    </div>

                </div>

            </section>


            {/* ======================================
                ABOUT NOVACART
            ====================================== */}

            <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">

                <div className="grid items-center gap-14 lg:grid-cols-2">

                    {/* LEFT */}

                    <div>

                        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
                            About NovaCart
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">

                            Your personal shopping
                            <br />

                            <span className="text-gray-400">
                                assistant.
                            </span>

                        </h2>

                        <p className="mt-6 leading-7 text-gray-500">

                            Online shopping can sometimes feel overwhelming.
                            Too many products, too many choices, and too much
                            time spent searching.

                        </p>

                        <p className="mt-4 leading-7 text-gray-500">

                            NovaCart brings products and AI together to create
                            a shopping experience that understands what you
                            are looking for and helps you find it faster.

                        </p>

                    </div>


                    {/* RIGHT CARD */}

                    <div className="relative">

                        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-sm">

                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-lg">

                                <ShoppingCart size={25} />

                            </div>

                            <h3 className="text-xl font-bold text-gray-900">
                                One platform.
                            </h3>

                            <p className="mt-3 leading-6 text-gray-500">

                                Discover products, get AI recommendations,
                                manage your wishlist, track orders, and enjoy
                                a seamless shopping experience.

                            </p>


                            <div className="mt-7 flex items-center gap-3">

                                <div className="h-2 w-2 rounded-full bg-green-500" />

                                <span className="text-sm font-medium text-gray-600">
                                    Built for modern shoppers
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ======================================
                FEATURES
            ====================================== */}

            <section className="border-y border-gray-100 bg-gray-50/50">

                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">

                    <div className="mx-auto max-w-2xl text-center">

                        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                            Why NovaCart
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                            Everything you need to shop better
                        </h2>

                        <p className="mt-4 text-gray-500">
                            Designed to keep your shopping experience simple,
                            personalized, and secure.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {/* CARD 1 */}

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                <Sparkles size={20} />

                            </div>

                            <h3 className="mt-5 font-bold text-gray-900">
                                AI Recommendations
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Find products based on what you're actually
                                looking for.
                            </p>

                        </div>


                        {/* CARD 2 */}

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">

                                <ShieldCheck size={20} />

                            </div>

                            <h3 className="mt-5 font-bold text-gray-900">
                                Secure Shopping
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Your account and shopping experience are built
                                with security in mind.
                            </p>

                        </div>


                        {/* CARD 3 */}

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">

                                <Truck size={20} />

                            </div>

                            <h3 className="mt-5 font-bold text-gray-900">
                                Easy Orders
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Manage your purchases and keep track of your
                                orders effortlessly.
                            </p>

                        </div>


                        {/* CARD 4 */}

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">

                                <Heart size={20} />

                            </div>

                            <h3 className="mt-5 font-bold text-gray-900">
                                Wishlist
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Save products you love and come back to them
                                whenever you want.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ======================================
                HOW IT WORKS
            ====================================== */}

            <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">

                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                    <div>

                        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                            Simple by design
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            From search to checkout,
                            <span className="text-gray-400">
                                {" "}made easy.
                            </span>
                        </h2>

                        <p className="mt-5 leading-7 text-gray-500">
                            NovaCart removes unnecessary complexity from
                            online shopping so you can spend less time
                            searching and more time finding exactly what you
                            need.
                        </p>

                    </div>


                    <div className="space-y-4">

                        {/* STEP 1 */}

                        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
                                01
                            </div>

                            <div>

                                <h3 className="font-bold text-gray-900">
                                    Discover
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Browse products or tell Nova AI what
                                    you're looking for.
                                </p>

                            </div>

                        </div>


                        {/* STEP 2 */}

                        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
                                02
                            </div>

                            <div>

                                <h3 className="font-bold text-gray-900">
                                    Choose
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Compare products and save your favourites
                                    to your wishlist.
                                </p>

                            </div>

                        </div>


                        {/* STEP 3 */}

                        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
                                03
                            </div>

                            <div>

                                <h3 className="font-bold text-gray-900">
                                    Shop
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Add products to your cart and enjoy a
                                    smooth checkout experience.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ======================================
                CTA
            ====================================== */}

            <section className="px-6 pb-20 sm:px-8 lg:px-12">

                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gray-900 px-6 py-14 text-center text-white sm:px-12">

                    <div className="mx-auto max-w-2xl">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">

                            <Zap size={22} />

                        </div>

                        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to shop smarter?
                        </h2>

                        <p className="mt-4 leading-7 text-gray-400">
                            Explore our products or let Nova AI help you find
                            exactly what you're looking for.
                        </p>


                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                            <Link
                                to="/shop"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
                            >

                                Explore Products

                                <ArrowRight size={17} />

                            </Link>


                            <Link
                                to="/ai"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                            >

                                <Sparkles size={17} />

                                Try Nova AI

                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* ======================================
                FOOTER TEXT
            ====================================== */}

            <div className="border-t border-gray-100 py-8 text-center">

                <p className="text-sm text-gray-400">

                    © {new Date().getFullYear()} NovaCart. Built for smarter
                    shopping.

                </p>

            </div>

        </div>
    );
};

export default About;