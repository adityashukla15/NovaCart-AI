import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    Bot,
    
    ChevronRight,
    
    Loader2,
    Palette,
    Sparkles,
    Shirt,
    ShoppingBag,
    Tag,
    Wallet,
    WandSparkles,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import { outfitRecommendation } from "../../services/aiApi";


// ==========================================
// HELPERS
// ==========================================

const getProductImage = (product) => {
    if (!product) return null;

    return (
        product.images?.[0] ||
        product.image ||
        product.thumbnail ||
        null
    );
};


const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
};


const getProductPrice = (product) => {
    if (!product) return 0;

    return Number(
        product.discountPrice ||
        product.price ||
        0
    );
};


// ==========================================
// COMPONENT
// ==========================================

const OutfitRecommendation = () => {

    const navigate = useNavigate();

    // ======================================
    // STATES
    // ======================================

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [searched, setSearched] = useState(false);


    // ======================================
    // EXAMPLES
    // ======================================

    const examples = [
        "College outfit under ₹5000",
        "Casual black outfit for college",
        "Summer outfit for college",
        "White shirt with black jeans",
    ];


    // ======================================
    // SEARCH
    // ======================================

    const handleRecommend = async (
        customMessage = null
    ) => {

        const query = (
            customMessage !== null
                ? customMessage
                : message
        ).trim();


        if (!query) {

            toast.error(
                "Tell me what outfit you're looking for"
            );

            return;
        }


        if (loading) return;


        setMessage(query);

        setLoading(true);

        setSearched(true);

        setResult(null);


        try {

            const response =
                await outfitRecommendation(query);


            const data =
                response?.data?.data;


            if (!data) {

                throw new Error(
                    "Invalid outfit recommendation response"
                );

            }


            setResult(data);


        } catch (error) {

            console.error(
                "OUTFIT RECOMMENDATION ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Unable to generate outfit recommendation"
            );


            setResult(null);


        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // ENTER KEY
    // ======================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleRecommend();

        }

    };


    // ======================================
    // RESET
    // ======================================

    const handleReset = () => {

        setMessage("");

        setResult(null);

        setSearched(false);

    };


    // ======================================
    // PRODUCTS
    // ======================================

    const outfitProducts = result?.outfit
        ? Object.entries(result.outfit)
        : [];


    // ======================================
    // TOTAL PRICE
    // ======================================

    const totalPrice = outfitProducts.reduce(
        (total, [, product]) => {

            return (
                total +
                getProductPrice(product)
            );

        },
        0
    );


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-screen bg-[#f7f7f8]">


            {/* ==================================
                HERO
            ================================== */}

            <section className="relative overflow-hidden border-b border-gray-200 bg-white">


                {/* BACKGROUND BLOBS */}

                <div className="pointer-events-none absolute inset-0">

                    <div
                        className="
                            absolute
                            left-[5%]
                            top-[-180px]
                            h-[420px]
                            w-[420px]
                            rounded-full
                            bg-purple-200/30
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            right-[5%]
                            top-[-120px]
                            h-[380px]
                            w-[380px]
                            rounded-full
                            bg-pink-200/20
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-[-200px]
                            left-[40%]
                            h-[400px]
                            w-[400px]
                            rounded-full
                            bg-blue-200/20
                            blur-3xl
                        "
                    />

                </div>


                <div
                    className="
                        relative
                        mx-auto
                        max-w-6xl
                        px-5
                        pb-16
                        pt-16
                        sm:px-6
                        lg:pb-20
                        lg:pt-24
                    "
                >


                    {/* BADGE */}

                    <div className="mb-6 flex justify-center">

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-2
                                text-xs
                                font-bold
                                text-gray-600
                                shadow-sm
                            "
                        >

                            <span
                                className="
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-gray-950
                                    text-white
                                "
                            >

                                <WandSparkles size={11} />

                            </span>

                            AI PERSONAL STYLIST

                        </div>

                    </div>


                    {/* TITLE */}

                    <h1
                        className="
                            mx-auto
                            max-w-4xl
                            text-center
                            text-4xl
                            font-black
                            tracking-tight
                            text-gray-950
                            sm:text-5xl
                            lg:text-6xl
                        "
                    >

                        Your outfit.

                        <span
                            className="
                                block
                                bg-gradient-to-r
                                from-gray-950
                                via-gray-600
                                to-gray-400
                                bg-clip-text
                                text-transparent
                            "
                        >
                            Curated by AI.
                        </span>

                    </h1>


                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-center
                            text-sm
                            leading-6
                            text-gray-500
                            sm:text-base
                        "
                    >

                        Tell NovaCart what you're wearing,
                        where you're going and your budget.
                        We'll build the outfit for you.

                    </p>


                    {/* SEARCH */}

                    <div className="mx-auto mt-9 max-w-3xl">

                        <div
                            className="
                                rounded-[24px]
                                border
                                border-gray-200
                                bg-white
                                p-2
                                shadow-[0_25px_70px_-25px_rgba(0,0,0,0.22)]
                                transition-all
                                duration-300
                                focus-within:border-gray-400
                                focus-within:shadow-[0_30px_80px_-25px_rgba(0,0,0,0.3)]
                            "
                        >

                            <div className="flex items-center gap-3">


                                {/* ICON */}

                                <div
                                    className="
                                        ml-2
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-gray-100
                                        text-gray-700
                                    "
                                >

                                    {loading ? (

                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Sparkles size={19} />

                                    )}

                                </div>


                                {/* INPUT */}

                                <input
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    disabled={loading}
                                    placeholder="Try “college outfit under ₹5000”..."
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        py-4
                                        text-sm
                                        font-medium
                                        text-gray-900
                                        outline-none
                                        placeholder:text-gray-400
                                    "
                                />


                                {/* CLEAR */}

                                {message &&
                                    !loading && (

                                        <button
                                            type="button"
                                            onClick={
                                                handleReset
                                            }
                                            className="
                                                rounded-xl
                                                p-2
                                                text-gray-400
                                                transition
                                                hover:bg-gray-100
                                                hover:text-gray-800
                                            "
                                        >

                                            <X size={17} />

                                        </button>

                                    )}


                                {/* BUTTON */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRecommend()
                                    }
                                    disabled={
                                        loading ||
                                        !message.trim()
                                    }
                                    className="
                                        flex
                                        h-11
                                        shrink-0
                                        items-center
                                        gap-2
                                        rounded-2xl
                                        bg-gray-950
                                        px-5
                                        text-sm
                                        font-bold
                                        text-white
                                        transition-all
                                        duration-200
                                        hover:bg-black
                                        hover:shadow-lg
                                        disabled:cursor-not-allowed
                                        disabled:bg-gray-200
                                        disabled:text-gray-400
                                    "
                                >

                                    {loading ? (

                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />

                                            <span className="hidden sm:inline">
                                                Styling...
                                            </span>
                                        </>

                                    ) : (

                                        <>
                                            Style me

                                            <ArrowRight
                                                size={16}
                                            />
                                        </>

                                    )}

                                </button>

                            </div>

                        </div>


                        {/* EXAMPLES */}

                        {!searched && (

                            <div className="mt-5 flex flex-wrap justify-center gap-2">

                                {examples.map(
                                    (example) => (

                                        <button
                                            type="button"
                                            key={example}
                                            onClick={() =>
                                                handleRecommend(
                                                    example
                                                )
                                            }
                                            className="
                                                rounded-full
                                                border
                                                border-gray-200
                                                bg-white
                                                px-4
                                                py-2
                                                text-xs
                                                font-medium
                                                text-gray-500
                                                shadow-sm
                                                transition-all
                                                duration-200
                                                hover:-translate-y-0.5
                                                hover:border-gray-400
                                                hover:text-gray-900
                                                hover:shadow-md
                                            "
                                        >

                                            {example}

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6">

                    <div className="mb-8">

                        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />

                        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-gray-100" />

                    </div>


                    <div
                        className="
                            grid
                            gap-5
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                        "
                    >

                        {Array.from({
                            length: 4,
                        }).map((_, index) => (

                            <OutfitSkeleton
                                key={index}
                            />

                        ))}

                    </div>

                </main>

            )}


            {/* ==================================
                RESULTS
            ================================== */}

            {!loading &&
                searched &&
                result && (

                    <main
                        className="
                            mx-auto
                            max-w-7xl
                            px-5
                            py-10
                            sm:px-6
                        "
                    >


                        {/* RESULT HEADER */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-6
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >

                            <div>

                                <div className="flex items-center gap-2">

                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-gray-950
                                            text-white
                                        "
                                    >

                                        <Bot size={15} />

                                    </div>

                                    <span
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.15em]
                                            text-gray-400
                                        "
                                    >

                                        AI Styled For You

                                    </span>

                                </div>


                                <h2
                                    className="
                                        mt-3
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-gray-950
                                        sm:text-3xl
                                    "
                                >

                                    Your complete outfit

                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-gray-500
                                    "
                                >

                                    Based on:

                                    <span
                                        className="
                                            ml-1
                                            font-semibold
                                            text-gray-800
                                        "
                                    >

                                        "{message}"

                                    </span>

                                </p>

                            </div>


                            {/* TOTAL */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-white
                                    px-5
                                    py-3
                                    shadow-sm
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-widest
                                        text-gray-400
                                    "
                                >
                                    Outfit total
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xl
                                        font-black
                                        text-gray-950
                                    "
                                >

                                    ₹{formatPrice(totalPrice)}

                                </p>

                            </div>

                        </div>


                        {/* ==================================
                            DETECTED FILTERS
                        ================================== */}

                        {result.filters && (

                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >

                                {result.filters.budget > 0 && (

                                    <FilterBadge
                                        icon={
                                            <Wallet size={13} />
                                        }
                                        label="Budget"
                                        value={`₹${formatPrice(
                                            result.filters.budget
                                        )}`}
                                    />

                                )}


                                {result.filters.color && (

                                    <FilterBadge
                                        icon={
                                            <Palette size={13} />
                                        }
                                        label="Color"
                                        value={
                                            result.filters.color
                                        }
                                    />

                                )}


                                {Array.isArray(
                                    result.filters.categories
                                ) &&
                                    result.filters.categories.map(
                                        (category) => (

                                            <FilterBadge
                                                key={
                                                    category
                                                }
                                                icon={
                                                    <Tag
                                                        size={
                                                            13
                                                        }
                                                    />
                                                }
                                                label="Category"
                                                value={
                                                    category
                                                }
                                            />

                                        )
                                    )}

                            </div>

                        )}


                        {/* ==================================
                            PRODUCTS
                        ================================== */}

                        {outfitProducts.length > 0 ? (

                            <div
                                className="
                                    mt-10
                                    grid
                                    gap-5
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                "
                            >

                                {outfitProducts.map(
                                    (
                                        [
                                            category,
                                            product,
                                        ],
                                        index
                                    ) => (

                                        <OutfitProductCard
                                            key={
                                                product._id ||
                                                category
                                            }
                                            category={
                                                category
                                            }
                                            product={
                                                product
                                            }
                                            index={
                                                index
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/products/${product._id}`
                                                )
                                            }
                                        />

                                    )
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                    mt-10
                                    rounded-[28px]
                                    border
                                    border-gray-200
                                    bg-white
                                    px-6
                                    py-20
                                    text-center
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-20
                                        w-20
                                        items-center
                                        justify-center
                                        rounded-3xl
                                        bg-gray-100
                                    "
                                >

                                    <Shirt
                                        size={32}
                                        className="text-gray-400"
                                    />

                                </div>


                                <h3
                                    className="
                                        mt-6
                                        text-xl
                                        font-black
                                        text-gray-900
                                    "
                                >

                                    Couldn't build the outfit

                                </h3>


                                <p
                                    className="
                                        mx-auto
                                        mt-2
                                        max-w-md
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    "
                                >

                                    Try increasing your budget
                                    or describing your outfit
                                    requirements differently.

                                </p>

                            </div>

                        )}


                        {/* ==================================
                            AI RECOMMENDATION
                        ================================== */}

                        {result.recommendation && (

                            <section
                                className="
                                    mt-12
                                    overflow-hidden
                                    rounded-[28px]
                                    border
                                    border-gray-200
                                    bg-gray-950
                                    text-white
                                    shadow-[0_25px_70px_-25px_rgba(0,0,0,0.45)]
                                "
                            >

                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        p-7
                                        sm:p-9
                                    "
                                >

                                    {/* GLOW */}

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            -right-20
                                            -top-20
                                            h-64
                                            w-64
                                            rounded-full
                                            bg-purple-500/20
                                            blur-3xl
                                        "
                                    />


                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            -bottom-20
                                            left-1/3
                                            h-64
                                            w-64
                                            rounded-full
                                            bg-blue-500/10
                                            blur-3xl
                                        "
                                    />


                                    <div
                                        className="
                                            relative
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                bg-white
                                                text-gray-950
                                            "
                                        >

                                            <Sparkles size={18} />

                                        </div>


                                        <div>

                                            <p
                                                className="
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.18em]
                                                    text-gray-400
                                                "
                                            >

                                                NovaCart AI

                                            </p>

                                            <h3
                                                className="
                                                    mt-0.5
                                                    text-lg
                                                    font-black
                                                "
                                            >

                                                Your stylist's take

                                            </h3>

                                        </div>

                                    </div>


                                    <div
                                        className="
                                            relative
                                            mt-7
                                            whitespace-pre-line
                                            text-sm
                                            leading-7
                                            text-gray-300
                                        "
                                    >

                                        {result.recommendation}

                                    </div>

                                </div>

                            </section>

                        )}

                    </main>

                )}


            {/* ==================================
                INITIAL EMPTY STATE
            ================================== */}

            {!searched && (

                <section
                    className="
                        mx-auto
                        max-w-5xl
                        px-5
                        py-16
                        text-center
                        sm:px-6
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-white
                            text-gray-900
                            shadow-sm
                        "
                    >

                        <ShoppingBag size={25} />

                    </div>


                    <h2
                        className="
                            mt-5
                            text-xl
                            font-black
                            text-gray-900
                        "
                    >

                        What are you dressing for?

                    </h2>


                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-md
                            text-sm
                            leading-6
                            text-gray-500
                        "
                    >

                        College, a party, a casual day out,
                        summer vacation — tell us the vibe.

                    </p>

                </section>

            )}

        </div>

    );

};


// ==========================================
// FILTER BADGE
// ==========================================

const FilterBadge = ({
    icon,
    label,
    value,
}) => {

    return (

        <div
            className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-3
                py-2
                shadow-sm
            "
        >

            <span className="text-gray-500">
                {icon}
            </span>

            <span
                className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-400
                "
            >
                {label}
            </span>

            <span
                className="
                    text-xs
                    font-bold
                    text-gray-800
                "
            >
                {value}
            </span>

        </div>

    );

};


// ==========================================
// PRODUCT CARD
// ==========================================

const OutfitProductCard = ({
    category,
    product,
    index,
    onClick,
}) => {

    const image = getProductImage(product);

    const price = getProductPrice(product);

    const hasDiscount =
        product.discountPrice &&
        product.price &&
        Number(product.discountPrice) <
            Number(product.price);


    return (

        <button
            type="button"
            onClick={onClick}
            className="
                group
                overflow-hidden
                rounded-[24px]
                border
                border-gray-200
                bg-white
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-gray-300
                hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.25)]
                focus:outline-none
                focus:ring-2
                focus:ring-gray-900
                focus:ring-offset-2
            "
            style={{
                animation:
                    `fadeUp 0.55s ease-out ${
                        index * 100
                    }ms both`,
            }}
        >

            {/* IMAGE */}

            <div
                className="
                    relative
                    aspect-[4/3]
                    overflow-hidden
                    bg-gray-100
                "
            >

                {image ? (

                    <img
                        src={image}
                        alt={
                            product.title ||
                            "Product"
                        }
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                        "
                    />

                ) : (

                    <div
                        className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            text-gray-300
                        "
                    >

                        <Shirt size={35} />

                    </div>

                )}


                {/* CATEGORY */}

                <div
                    className="
                        absolute
                        left-3
                        top-3
                        rounded-full
                        border
                        border-white/70
                        bg-white/90
                        px-3
                        py-1.5
                        text-[10px]
                        font-black
                        uppercase
                        tracking-wide
                        text-gray-700
                        shadow-sm
                        backdrop-blur
                    "
                >

                    {category}

                </div>


                {/* ARROW */}

                <div
                    className="
                        absolute
                        bottom-3
                        right-3
                        flex
                        h-9
                        w-9
                        translate-y-2
                        items-center
                        justify-center
                        rounded-full
                        bg-gray-950
                        text-white
                        opacity-0
                        shadow-lg
                        transition-all
                        duration-300
                        group-hover:translate-y-0
                        group-hover:opacity-100
                    "
                >

                    <ArrowRight size={15} />

                </div>

            </div>


            {/* INFO */}

            <div className="p-5">

                {product.brand && (

                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-gray-400
                        "
                    >

                        {product.brand}

                    </p>

                )}


                <h3
                    className="
                        mt-1.5
                        line-clamp-2
                        min-h-[40px]
                        text-sm
                        font-bold
                        leading-5
                        text-gray-900
                    "
                >

                    {product.title}

                </h3>


                <div
                    className="
                        mt-4
                        flex
                        items-end
                        justify-between
                        gap-3
                    "
                >

                    <div>

                        <p
                            className="
                                text-lg
                                font-black
                                text-gray-950
                            "
                        >

                            ₹{formatPrice(price)}

                        </p>


                        {hasDiscount && (

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    line-through
                                "
                            >

                                ₹{formatPrice(
                                    product.price
                                )}

                            </p>

                        )}

                    </div>


                    <span
                        className="
                            flex
                            items-center
                            gap-1
                            text-[10px]
                            font-bold
                            text-gray-400
                            transition
                            group-hover:text-gray-900
                        "
                    >

                        View

                        <ChevronRight size={13} />

                    </span>

                </div>

            </div>

        </button>

    );

};


// ==========================================
// SKELETON
// ==========================================

const OutfitSkeleton = () => {

    return (

        <div
            className="
                overflow-hidden
                rounded-[24px]
                border
                border-gray-200
                bg-white
            "
        >

            <div
                className="
                    aspect-[4/3]
                    animate-pulse
                    bg-gray-200
                "
            />

            <div className="space-y-3 p-5">

                <div
                    className="
                        h-2.5
                        w-20
                        animate-pulse
                        rounded
                        bg-gray-200
                    "
                />

                <div
                    className="
                        h-4
                        w-full
                        animate-pulse
                        rounded
                        bg-gray-200
                    "
                />

                <div
                    className="
                        h-4
                        w-3/4
                        animate-pulse
                        rounded
                        bg-gray-100
                    "
                />

                <div
                    className="
                        mt-5
                        h-6
                        w-24
                        animate-pulse
                        rounded
                        bg-gray-200
                    "
                />

            </div>

        </div>

    );

};


export default OutfitRecommendation;