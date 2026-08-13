import { useState } from "react";
import {
    ArrowRight,
    Bot,
    CheckCircle2,
    Loader2,
    Package,
    Search,
    Sparkles,
    Star,
    Tag,
    X,
} from "lucide-react";

import toast from "react-hot-toast";
import { productSummary } from "../../services/aiApi";


// ==========================================
// HELPERS
// ==========================================

const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";

    return Number(price).toLocaleString("en-IN");
};


const getProductImage = (product) => {
    return (
        product?.images?.[0] ||
        product?.image ||
        product?.thumbnail ||
        null
    );
};


// ==========================================
// COMPONENT
// ==========================================

const ProductSummary = () => {

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [searched, setSearched] = useState(false);


    // ==========================================
    // SUMMARY
    // ==========================================

    const handleSummary = async (customMessage = null) => {

        const searchMessage = (
            customMessage !== null
                ? customMessage
                : message
        ).trim();


        if (!searchMessage) {

            toast.error(
                "Tell me which product you want summarized"
            );

            return;
        }


        if (loading) return;


        setMessage(searchMessage);

        setLoading(true);

        setSearched(true);

        setResult(null);


        try {

            const response = await productSummary(
                searchMessage
            );


            const data = response?.data?.data;


            if (!data?.product) {

                throw new Error(
                    "Product data missing"
                );

            }


            setResult(data);


        } catch (error) {

            console.error(
                "PRODUCT SUMMARY ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Unable to generate product summary"
            );


            setResult(null);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // ENTER KEY
    // ==========================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSummary();

        }

    };


    // ==========================================
    // RESET
    // ==========================================

    const handleReset = () => {

        setMessage("");

        setResult(null);

        setSearched(false);

    };


    // ==========================================
    // SUGGESTIONS
    // ==========================================

    const suggestions = [
        "Summarize Apple Watch Series 10",
        "Give me a summary of Sony WH-1000XM5",
        "Tell me about Adidas Ultraboost",
    ];


    return (

        <div className="min-h-screen bg-[#f7f7f8]">

            {/* ======================================
                HERO
            ====================================== */}

            <section className="relative overflow-hidden border-b border-gray-200 bg-white">

                {/* Background blobs */}

                <div className="pointer-events-none absolute inset-0">

                    <div className="
                        absolute
                        left-[8%]
                        top-[-180px]
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-purple-200/30
                        blur-3xl
                    " />

                    <div className="
                        absolute
                        right-[5%]
                        top-[-150px]
                        h-[400px]
                        w-[400px]
                        rounded-full
                        bg-blue-200/20
                        blur-3xl
                    " />

                </div>


                <div className="
                    relative
                    mx-auto
                    max-w-5xl
                    px-5
                    pb-16
                    pt-16
                    sm:px-6
                    lg:pb-20
                    lg:pt-24
                ">


                    {/* BADGE */}

                    <div className="mb-6 flex justify-center">

                        <div className="
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
                        ">

                            <span className="
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-gray-950
                                text-white
                            ">

                                <Sparkles size={11} />

                            </span>

                            AI PRODUCT SUMMARY

                        </div>

                    </div>


                    {/* TITLE */}

                    <h1 className="
                        mx-auto
                        max-w-3xl
                        text-center
                        text-4xl
                        font-black
                        tracking-tight
                        text-gray-950
                        sm:text-5xl
                        lg:text-6xl
                    ">

                        Understand products

                        <span className="
                            block
                            bg-gradient-to-r
                            from-gray-950
                            via-gray-600
                            to-gray-400
                            bg-clip-text
                            text-transparent
                        ">

                            in seconds.

                        </span>

                    </h1>


                    <p className="
                        mx-auto
                        mt-5
                        max-w-2xl
                        text-center
                        text-sm
                        leading-6
                        text-gray-500
                        sm:text-base
                    ">

                        Ask NovaCart AI about any product and
                        get a quick, easy-to-understand summary
                        using the actual product information.

                    </p>


                    {/* ======================================
                        SEARCH
                    ====================================== */}

                    <div className="mx-auto mt-9 max-w-3xl">

                        <div className="
                            group
                            rounded-[22px]
                            border
                            border-gray-200
                            bg-white
                            p-2
                            shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)]
                            transition-all
                            duration-300
                            focus-within:border-gray-400
                            focus-within:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.25)]
                        ">

                            <div className="flex items-center gap-3">

                                {/* ICON */}

                                <div className="
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
                                    transition-all
                                    group-focus-within:bg-gray-950
                                    group-focus-within:text-white
                                ">

                                    {loading ? (

                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Search size={19} />

                                    )}

                                </div>


                                {/* INPUT */}

                                <input
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={handleKeyDown}
                                    disabled={loading}
                                    placeholder='Try "Summarize Apple Watch Series 10"...'
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

                                {message && !loading && (

                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="
                                            rounded-xl
                                            p-2
                                            text-gray-400
                                            transition
                                            hover:bg-gray-100
                                            hover:text-gray-700
                                        "
                                    >

                                        <X size={17} />

                                    </button>

                                )}


                                {/* BUTTON */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSummary()
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
                                                Analyzing...
                                            </span>

                                        </>

                                    ) : (

                                        <>

                                            Summarize

                                            <ArrowRight
                                                size={16}
                                            />

                                        </>

                                    )}

                                </button>

                            </div>

                        </div>


                        {/* SUGGESTIONS */}

                        {!searched && (

                            <div className="
                                mt-5
                                flex
                                flex-wrap
                                justify-center
                                gap-2
                            ">

                                {suggestions.map(
                                    (suggestion) => (

                                        <button
                                            type="button"
                                            key={suggestion}
                                            onClick={() =>
                                                handleSummary(
                                                    suggestion
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
                                                hover:-translate-y-0.5
                                                hover:border-gray-400
                                                hover:text-gray-900
                                                hover:shadow-md
                                            "
                                        >

                                            {suggestion}

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* ======================================
                RESULT
            ====================================== */}

            {searched && (

                <main className="
                    mx-auto
                    max-w-5xl
                    px-5
                    py-10
                    sm:px-6
                ">


                    {/* LOADING */}

                    {loading && (

                        <SummarySkeleton />

                    )}


                    {/* RESULT */}

                    {!loading && result && (

                        <SummaryResult
                            result={result}
                        />

                    )}


                    {/* EMPTY */}

                    {!loading && !result && (

                        <div className="
                            rounded-[28px]
                            border
                            border-gray-200
                            bg-white
                            px-6
                            py-16
                            text-center
                            shadow-sm
                        ">

                            <div className="
                                mx-auto
                                flex
                                h-20
                                w-20
                                items-center
                                justify-center
                                rounded-3xl
                                bg-gray-100
                            ">

                                <Package
                                    size={32}
                                    className="text-gray-400"
                                />

                            </div>


                            <h3 className="
                                mt-6
                                text-xl
                                font-black
                                text-gray-900
                            ">

                                Product summary unavailable

                            </h3>


                            <p className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-gray-500
                            ">

                                Try searching with the exact
                                product name.

                            </p>

                        </div>

                    )}

                </main>

            )}

        </div>

    );

};


// ==========================================
// RESULT COMPONENT
// ==========================================

const SummaryResult = ({ result }) => {

    const product = result.product;

    const image = getProductImage(product);


    return (

        <div
            className="
                space-y-6
            "
            style={{
                animation:
                    "fadeUp 0.5s ease-out both",
            }}
        >

            {/* RESULT HEADER */}

            <div className="flex items-center gap-3">

                <div className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-gray-950
                    text-white
                ">

                    <Bot size={16} />

                </div>


                <div>

                    <p className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-gray-400
                    ">

                        AI Product Summary

                    </p>

                    <h2 className="
                        mt-1
                        text-xl
                        font-black
                        text-gray-950
                    ">

                        Here's what you need to know

                    </h2>

                </div>

            </div>


            {/* PRODUCT + SUMMARY */}

            <div className="
                overflow-hidden
                rounded-[28px]
                border
                border-gray-200
                bg-white
                shadow-[0_20px_50px_-25px_rgba(0,0,0,0.2)]
            ">

                <div className="
                    grid
                    lg:grid-cols-[320px_1fr]
                ">


                    {/* PRODUCT */}

                    <div className="
                        border-b
                        border-gray-100
                        bg-gray-50
                        p-6
                        lg:border-b-0
                        lg:border-r
                    ">

                        {/* IMAGE */}

                        <div className="
                            relative
                            aspect-square
                            overflow-hidden
                            rounded-2xl
                            bg-gray-100
                        ">

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
                                    "
                                />

                            ) : (

                                <div className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                    text-gray-300
                                ">

                                    <Package size={42} />

                                </div>

                            )}


                            <div className="
                                absolute
                                left-3
                                top-3
                                flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                border-white/70
                                bg-white/90
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                text-gray-700
                                shadow-sm
                                backdrop-blur
                            ">

                                <Sparkles size={11} />

                                AI ANALYZED

                            </div>

                        </div>


                        {/* PRODUCT INFO */}

                        <div className="mt-5">

                            {product.brand && (

                                <p className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.15em]
                                    text-gray-400
                                ">

                                    {product.brand}

                                </p>

                            )}


                            <h3 className="
                                mt-1.5
                                text-xl
                                font-black
                                leading-tight
                                text-gray-950
                            ">

                                {product.title}

                            </h3>


                            {product.category?.name && (

                                <div className="
                                    mt-3
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-white
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-gray-600
                                    shadow-sm
                                ">

                                    <Tag size={12} />

                                    {product.category.name}

                                </div>

                            )}


                            {/* PRICE */}

                            <div className="
                                mt-5
                                flex
                                items-center
                                gap-3
                            ">

                                <span className="
                                    text-2xl
                                    font-black
                                    text-gray-950
                                ">

                                    ₹{formatPrice(
                                        product.price
                                    )}

                                </span>


                                {product.discountPrice > 0 && (

                                    <span className="
                                        rounded-full
                                        bg-green-100
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-bold
                                        text-green-700
                                    ">

                                        ₹{formatPrice(
                                            product.discountPrice
                                        )}

                                    </span>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* AI SUMMARY */}

                    <div className="p-6 sm:p-8">

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <div className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                bg-gray-100
                                text-gray-800
                            ">

                                <Sparkles size={16} />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    font-bold
                                    text-gray-900
                                ">

                                    NovaCart AI

                                </p>

                                <p className="
                                    text-[10px]
                                    text-gray-400
                                ">

                                    Quick product breakdown

                                </p>

                            </div>

                        </div>


                        {/* SUMMARY TEXT */}

                        <div className="
                            mt-6
                            rounded-2xl
                            border
                            border-gray-100
                            bg-gray-50
                            p-5
                        ">

                            <p className="
                                whitespace-pre-line
                                text-sm
                                leading-7
                                text-gray-700
                            ">

                                {result.summary}

                            </p>

                        </div>


                        {/* PRODUCT DETAILS */}

                        <div className="
                            mt-6
                            grid
                            gap-3
                            sm:grid-cols-2
                        ">

                            {product.colors?.length > 0 && (

                                <InfoBox
                                    title="Colors"
                                    icon={
                                        <span className="
                                            h-2.5
                                            w-2.5
                                            rounded-full
                                            bg-gray-900
                                        " />
                                    }
                                    value={
                                        product.colors.join(
                                            ", "
                                        )
                                    }
                                />

                            )}


                            {product.sizes?.length > 0 && (

                                <InfoBox
                                    title="Sizes"
                                    icon={
                                        <CheckCircle2
                                            size={14}
                                        />
                                    }
                                    value={
                                        product.sizes.join(
                                            ", "
                                        )
                                    }
                                />

                            )}


                            {product.stock !== undefined && (

                                <InfoBox
                                    title="Availability"
                                    icon={
                                        <Package
                                            size={14}
                                        />
                                    }
                                    value={
                                        product.stock > 0
                                            ? `${product.stock} in stock`
                                            : "Out of stock"
                                    }
                                />

                            )}


                            {product.averageRating > 0 && (

                                <InfoBox
                                    title="Rating"
                                    icon={
                                        <Star
                                            size={14}
                                        />
                                    }
                                    value={
                                        `${product.averageRating}/5`
                                    }
                                />

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};


// ==========================================
// INFO BOX
// ==========================================

const InfoBox = ({
    title,
    icon,
    value,
}) => {

    return (

        <div className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-4
        ">

            <div className="
                flex
                items-center
                gap-2
                text-gray-500
            ">

                {icon}

                <span className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400
                ">

                    {title}

                </span>

            </div>


            <p className="
                mt-2
                text-xs
                font-bold
                leading-5
                text-gray-800
            ">

                {value}

            </p>

        </div>

    );

};


// ==========================================
// SKELETON
// ==========================================

const SummarySkeleton = () => {

    return (

        <div className="
            overflow-hidden
            rounded-[28px]
            border
            border-gray-200
            bg-white
        ">

            <div className="
                grid
                lg:grid-cols-[320px_1fr]
            ">

                <div className="
                    aspect-square
                    animate-pulse
                    bg-gray-200
                " />


                <div className="
                    space-y-5
                    p-6
                    sm:p-8
                ">

                    <div className="
                        h-10
                        w-40
                        animate-pulse
                        rounded-xl
                        bg-gray-200
                    " />

                    <div className="
                        space-y-3
                    ">

                        <div className="
                            h-4
                            w-full
                            animate-pulse
                            rounded
                            bg-gray-200
                        " />

                        <div className="
                            h-4
                            w-full
                            animate-pulse
                            rounded
                            bg-gray-200
                        " />

                        <div className="
                            h-4
                            w-4/5
                            animate-pulse
                            rounded
                            bg-gray-100
                        " />

                        <div className="
                            h-4
                            w-3/5
                            animate-pulse
                            rounded
                            bg-gray-100
                        " />

                    </div>


                    <div className="
                        grid
                        grid-cols-2
                        gap-3
                        pt-4
                    ">

                        <div className="
                            h-20
                            animate-pulse
                            rounded-2xl
                            bg-gray-100
                        " />

                        <div className="
                            h-20
                            animate-pulse
                            rounded-2xl
                            bg-gray-100
                        " />

                    </div>

                </div>

            </div>

        </div>

    );

};


export default ProductSummary;