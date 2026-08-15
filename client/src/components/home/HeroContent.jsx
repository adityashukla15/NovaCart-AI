import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { ArrowRight, Sparkles, Play } from "lucide-react";

const HeroContent = () => {

    const navigate = useNavigate();

    // ======================================
    // SHOP NOW
    // ======================================

    const handleShopNow = () => {
        navigate("/shop");
    };


    // ======================================
    // EXPLORE
    // ======================================

    const handleExplore = () => {
        navigate("/shop");
    };


    return (
        <div className="relative max-w-2xl">

            {/* ======================================
                SUBTLE GLOW
            ====================================== */}

            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gray-200/50 blur-3xl" />


            {/* ======================================
                BADGE
            ====================================== */}

            <div className="relative inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                    <Sparkles size={12} />
                </span>

                <span className="text-xs font-bold tracking-[0.12em] text-gray-700">
                    NEW COLLECTION
                </span>

                <span className="text-xs font-medium text-gray-400">
                    2026
                </span>

            </div>


            {/* ======================================
                HEADING
            ====================================== */}

            <h1 className="relative mt-8 text-[52px] font-black leading-[0.95] tracking-[-0.055em] text-gray-950 sm:text-6xl md:text-7xl lg:text-[82px]">

                Style that

                <br />

                <span className="relative inline-block">

                    speaks

                    <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-gray-200" />

                </span>

                <br />

                <span className="text-gray-400">
                    for you.
                </span>

            </h1>


            {/* ======================================
                DESCRIPTION
            ====================================== */}

            <p className="relative mt-8 max-w-lg text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">

                Discover carefully curated fashion and
                premium essentials made for your everyday
                lifestyle.

                <span className="font-semibold text-gray-900">
                    {" "}Powered by AI.
                </span>

            </p>


            {/* ======================================
                CTA BUTTONS
            ====================================== */}

            <div className="relative mt-9 flex flex-wrap items-center gap-4">

                {/* SHOP NOW */}

                <Button
                    onClick={handleShopNow}
                    className="group rounded-2xl px-7 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
                >

                    Shop Now

                    <ArrowRight
                        size={18}
                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />

                </Button>


                {/* EXPLORE */}

                <Button
                    variant="outline"
                    onClick={handleExplore}
                    className="group rounded-2xl border-gray-200 bg-white px-6 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:bg-gray-50"
                >

                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 transition group-hover:bg-black group-hover:text-white">

                        <Play
                            size={11}
                            fill="currentColor"
                        />

                    </span>

                    <span className="ml-2">
                        Explore
                    </span>

                </Button>

            </div>


            {/* ======================================
                TRUST LINE
            ====================================== */}

            <div className="relative mt-10 flex flex-wrap items-center gap-5 text-sm text-gray-500">

                <div className="flex -space-x-2">

                    <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-300" />

                    <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-400" />

                    <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-500" />

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black text-[10px] font-bold text-white">
                        +9k
                    </div>

                </div>


                <div className="h-6 w-px bg-gray-200" />


                <div>

                    <p className="font-semibold text-gray-900">
                        Loved by 10,000+ shoppers
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                        Premium products. Smarter shopping.
                    </p>

                </div>

            </div>


            {/* ======================================
                AI MINI CARD
            ====================================== */}

            <div className="relative mt-8 inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">

                    <Sparkles size={16} />

                </div>

                <div>

                    <p className="text-xs font-semibold text-gray-900">
                        NovaAI Shopping
                    </p>

                    <p className="text-[11px] text-gray-400">
                        Find exactly what you need
                    </p>

                </div>

                <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />

            </div>

        </div>
    );
};

export default HeroContent;