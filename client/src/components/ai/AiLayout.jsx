import {
    Bot,
    Search,
    GitCompare,
    FileText,
    Shirt,
    Image,
    MessageCircle,
} from "lucide-react";

import { NavLink, Outlet } from "react-router-dom";

const AI_FEATURES = [
    {
        name: "AI Chat",
        description: "Talk with NovaCart AI",
        path: "chat",
        icon: MessageCircle,
    },
    {
        name: "Smart Search",
        description: "Find products naturally",
        path: "search",
        icon: Search,
    },
    {
        name: "Compare Products",
        description: "Compare products with AI",
        path: "compare",
        icon: GitCompare,
    },
    {
        name: "Product Summary",
        description: "Get AI product insights",
        path: "summary",
        icon: FileText,
    },
    {
        name: "Outfit Recommendation",
        description: "Build your perfect outfit",
        path: "outfit",
        icon: Shirt,
    },
    {
        name: "Image Search",
        description: "Search using an image",
        path: "image-search",
        icon: Image,
    },
];

const AILayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-sm">
                            <Bot size={22} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-gray-500">
                                NovaCart AI
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                AI Assistant
                            </h1>
                        </div>

                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Smart tools to help you discover, compare and shop better.
                    </p>

                </div>


                {/* LAYOUT */}

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

                    {/* SIDEBAR */}

                    <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">

                        <div className="mb-3 px-3 py-2">

                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                AI Tools
                            </p>

                        </div>

                        <nav className="space-y-1">

                            {AI_FEATURES.map((feature) => {

                                const Icon = feature.icon;

                                return (
                                    <NavLink
                                        key={feature.path}
                                        to={feature.path}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                                                isActive
                                                    ? "bg-gray-900 text-white shadow-sm"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`
                                        }
                                    >

                                        {({ isActive }) => (
                                            <>
                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                        isActive
                                                            ? "bg-white/10"
                                                            : "bg-gray-100 group-hover:bg-white"
                                                    }`}
                                                >
                                                    <Icon size={17} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">
                                                        {feature.name}
                                                    </p>

                                                    <p
                                                        className={`truncate text-[11px] ${
                                                            isActive
                                                                ? "text-gray-300"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                    </NavLink>
                                );
                            })}

                        </nav>

                    </aside>


                    {/* CONTENT */}

                    <main className="min-w-0">
                        <Outlet />
                    </main>

                </div>

            </div>

        </div>
    );
};

export default AILayout;