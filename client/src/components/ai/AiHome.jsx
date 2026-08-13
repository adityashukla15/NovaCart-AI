import {
    Bot,
    Search,
    GitCompare,
    FileText,
    Shirt,
    Image,
    ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

const features = [
    {
        title: "AI Chat",
        description:
            "Ask NovaCart AI anything about products and shopping.",
        path: "chat",
        icon: Bot,
    },
    {
        title: "Smart Search",
        description:
            "Search products naturally using your own words.",
        path: "search",
        icon: Search,
    },
    {
        title: "Compare Products",
        description:
            "Let AI compare multiple products for you.",
        path: "compare",
        icon: GitCompare,
    },
    {
        title: "Product Summary",
        description:
            "Get a quick AI-powered product overview.",
        path: "summary",
        icon: FileText,
    },
    {
        title: "Outfit Recommendation",
        description:
            "Get personalized outfit combinations.",
        path: "outfit",
        icon: Shirt,
    },
    {
        title: "Image Search",
        description:
            "Upload an image and find similar products.",
        path: "image-search",
        icon: Image,
    },
];

const AIHome = () => {
    return (
        <div className="space-y-6">

            {/* HERO */}

            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 p-7 text-white shadow-sm md:p-10">

                <div className="max-w-2xl">

                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                        <Bot size={25} />
                    </div>

                    <p className="text-sm font-semibold text-indigo-300">
                        SHOP SMARTER WITH AI
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                        Your personal shopping assistant.
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-gray-300 md:text-base">
                        Search products, compare options, understand products
                        and discover new styles with NovaCart AI.
                    </p>

                </div>

            </div>


            {/* FEATURE GRID */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {features.map((feature) => {

                    const Icon = feature.icon;

                    return (
                        <Link
                            key={feature.path}
                            to={feature.path}
                            className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-gray-200 hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                                    <Icon size={20} />
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-900"
                                />

                            </div>

                            <h3 className="mt-5 text-base font-bold text-gray-900">
                                {feature.title}
                            </h3>

                            <p className="mt-2 text-sm leading-5 text-gray-500">
                                {feature.description}
                            </p>

                        </Link>
                    );
                })}

            </div>

        </div>
    );
};

export default AIHome;