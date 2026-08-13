import {
    ArrowRight,
    Bot,
    Camera,
    GitCompare,
    MessageCircle,
    Search,
    Sparkles,
    Shirt,
    WandSparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const AIFeatureHome = () => {

    const navigate = useNavigate();


    const features = [
        {
            title: "AI Chat",
            description:
                "Talk naturally with NovaCart AI and discover products based on what you need.",
            icon: MessageCircle,
            path: "/ai/chat",
            badge: "Most Popular",
        },
        {
            title: "Smart Search",
            description:
                "Describe the product you're looking for and let AI understand your intent.",
            icon: Search,
            path: "/ai/search",
            badge: "AI Search",
        },
        {
            title: "Compare Products",
            description:
                "Compare products intelligently and understand which one fits you better.",
            icon: GitCompare,
            path: "/ai/compare",
            badge: "Compare",
        },
        {
            title: "Product Summary",
            description:
                "Get quick AI-powered summaries instead of reading long product descriptions.",
            icon: WandSparkles,
            path: "/ai/summary",
            badge: "Quick Insights",
        },
        {
            title: "Outfit Recommendation",
            description:
                "Tell AI your style and occasion and get personalized outfit suggestions.",
            icon: Shirt,
            path: "/ai/outfit",
            badge: "Style AI",
        },
        {
            title: "Image Search",
            description:
                "Find products visually using an image instead of describing them.",
            icon: Camera,
            path: "/ai/image-search",
            badge: "Visual Search",
        },
    ];


    return (

        <div className="min-h-screen bg-[#f7f7f8]">

            {/* HERO */}

            <section className="relative overflow-hidden border-b border-gray-200 bg-white">

                <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-purple-100/60 blur-3xl" />

                <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />


                <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

                    <div className="mx-auto max-w-3xl text-center">

                        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">

                            <Sparkles
                                size={14}
                                className="text-purple-600"
                            />

                            Powered by NovaCart AI

                        </div>


                        <h1 className="mt-7 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">

                            Shopping,
                            <span className="block bg-gradient-to-r from-gray-900 via-purple-700 to-blue-600 bg-clip-text text-transparent">
                                made intelligent.
                            </span>

                        </h1>


                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">

                            Discover products, compare choices,
                            find your style and shop smarter with
                            your personal AI shopping assistant.

                        </p>


                        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/ai/chat"
                                    )
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black"
                            >

                                <Bot size={18} />

                                Start AI Chat

                                <ArrowRight
                                    size={16}
                                />

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/shop"
                                    )
                                }
                                className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >

                                Explore Shop

                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* FEATURES */}

            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div className="mb-10">

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
                        AI Toolkit
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Everything you need to shop smarter
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm text-gray-500">
                        Choose an AI experience based on what you
                        want to accomplish.
                    </p>

                </div>


                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                    {features.map(
                        (feature) => {

                            const Icon =
                                feature.icon;

                            return (

                                <button
                                    type="button"
                                    key={
                                        feature.title
                                    }
                                    onClick={() =>
                                        navigate(
                                            feature.path
                                        )
                                    }
                                    className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
                                >

                                    <div className="flex items-start justify-between">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white transition group-hover:scale-105">

                                            <Icon
                                                size={21}
                                            />

                                        </div>

                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                                            {
                                                feature.badge
                                            }
                                        </span>

                                    </div>


                                    <h3 className="mt-6 text-base font-bold text-gray-900">
                                        {
                                            feature.title
                                        }
                                    </h3>

                                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                                        {
                                            feature.description
                                        }
                                    </p>


                                    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-900">

                                        Try it

                                        <ArrowRight
                                            size={14}
                                            className="transition group-hover:translate-x-1"
                                        />

                                    </div>

                                </button>

                            );

                        }
                    )}

                </div>

            </section>

        </div>

    );

};

export default AIFeatureHome;