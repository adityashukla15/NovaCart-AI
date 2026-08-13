import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Bot,
    Check,
    ChevronRight,
    CircleDollarSign,
    GitCompare,
    Loader2,
    Package,
    Search,
    Sparkles,
    Star,
    ThumbsUp,
    Trophy,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import { compareProducts } from "../../services/aiApi";


// ======================================================
// HELPERS
// ======================================================

const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
};


const getImage = (product) => {
    if (!product) return null;

    return (
        product.images?.[0] ||
        product.image ||
        product.thumbnail ||
        null
    );
};


const getRating = (product) => {
    return Number(
        product?.averageRating ??
        product?.rating ??
        0
    );
};


const getTitle = (product) => {
    return (
        product?.title ||
        product?.name ||
        "Unnamed Product"
    );
};


const getCategory = (product) => {
    if (typeof product?.category === "object") {
        return product.category?.name || "Unknown";
    }

    return product?.category || "Unknown";
};


// ======================================================
// MAIN COMPONENT
// ======================================================

const CompareProducts = () => {

    const navigate = useNavigate();

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);

    const [comparison, setComparison] = useState("");

    const [searched, setSearched] = useState(false);


    // ==================================================
    // EXAMPLES
    // ==================================================

    const examples = [
        "Compare Nike Air Max and Adidas Ultraboost",

        "Compare Apple Watch Series 10 and Samsung Galaxy Watch",

        "Compare Sony headphones and JBL headphones",

        "Compare these laptops for college",
    ];


    // ==================================================
    // COMPARE
    // ==================================================

    const handleCompare = async (customMessage = null) => {

        const searchMessage = (
            customMessage !== null
                ? customMessage
                : message
        ).trim();


        if (!searchMessage) {

            toast.error(
                "Tell me which products you want to compare"
            );

            return;
        }


        if (loading) return;


        setMessage(searchMessage);

        setLoading(true);

        setSearched(true);

        setProducts([]);

        setComparison("");


        try {

            const response = await compareProducts(
                searchMessage
            );


            const data = response?.data?.data;


            const comparedProducts =
                Array.isArray(
                    data?.comparedProducts
                )
                    ? data.comparedProducts
                    : [];


            setProducts(
                comparedProducts
            );


            setComparison(
                data?.comparison || ""
            );


            if (comparedProducts.length < 2) {

                toast.error(
                    "At least two products are required."
                );

            }


        } catch (error) {

            console.error(
                "COMPARE ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Unable to compare products"
            );


            setProducts([]);

            setComparison("");

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // ENTER
    // ==================================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleCompare();

        }

    };


    // ==================================================
    // RESET
    // ==================================================

    const handleReset = () => {

        setMessage("");

        setProducts([]);

        setComparison("");

        setSearched(false);

    };


    // ==================================================
    // PRODUCT DETAILS
    // ==================================================

    const openProduct = (product) => {

        const id =
            product?._id ||
            product?.id;


        if (!id) {

            toast.error(
                "Product details unavailable"
            );

            return;
        }


        navigate(
            `/products/${id}`
        );

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="min-h-screen bg-[#f7f7f8]">


            {/* ==================================================
                HERO
            ================================================== */}

            <section className="relative overflow-hidden border-b border-gray-200 bg-white">


                {/* BACKGROUND */}

                <div className="pointer-events-none absolute inset-0">

                    <div className="
                        absolute
                        left-[8%]
                        top-[-180px]
                        h-[450px]
                        w-[450px]
                        rounded-full
                        bg-purple-200/30
                        blur-3xl
                    " />

                    <div className="
                        absolute
                        right-[5%]
                        top-[-150px]
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-blue-200/25
                        blur-3xl
                    " />

                </div>


                <div className="
                    relative
                    mx-auto
                    max-w-6xl
                    px-5
                    pb-16
                    pt-12
                    sm:px-6
                    lg:pb-20
                    lg:pt-20
                ">


                    {/* BACK BUTTON */}

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            mb-10
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-gray-600
                            shadow-sm
                            transition
                            hover:-translate-x-0.5
                            hover:border-gray-300
                            hover:text-gray-900
                        "
                    >

                        <ArrowLeft size={14} />

                        Back

                    </button>


                    {/* BADGE */}

                    <div className="flex justify-center">

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
                            tracking-wide
                            text-gray-600
                            shadow-sm
                        ">

                            <span className="
                                flex
                                h-6
                                w-6
                                items-center
                                justify-center
                                rounded-full
                                bg-gray-950
                                text-white
                            ">

                                <GitCompare size={12} />

                            </span>

                            AI PRODUCT COMPARISON

                        </div>

                    </div>


                    {/* TITLE */}

                    <h1 className="
                        mx-auto
                        mt-7
                        max-w-4xl
                        text-center
                        text-4xl
                        font-black
                        tracking-tight
                        text-gray-950
                        sm:text-5xl
                        lg:text-6xl
                    ">

                        Compare smarter.

                        <span className="
                            block
                            bg-gradient-to-r
                            from-gray-950
                            via-gray-600
                            to-gray-400
                            bg-clip-text
                            text-transparent
                        ">

                            Choose with confidence.

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

                        Tell NovaCart which products you're
                        considering. Our AI will analyze them
                        and help you choose the right one.

                    </p>


                    {/* SEARCH */}

                    <div className="
                        mx-auto
                        mt-9
                        max-w-3xl
                    ">

                        <div className="
                            group
                            rounded-[24px]
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

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">


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
                                    transition
                                    group-focus-within:bg-gray-950
                                    group-focus-within:text-white
                                ">

                                    {loading ? (

                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <GitCompare
                                            size={19}
                                        />

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
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    disabled={loading}
                                    placeholder="Compare Nike Air Max and Adidas Ultraboost..."
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
                                            hover:text-gray-800
                                        "
                                    >

                                        <X size={17} />

                                    </button>

                                )}


                                {/* BUTTON */}

                                <button
                                    type="button"
                                    disabled={
                                        loading ||
                                        !message.trim()
                                    }
                                    onClick={() =>
                                        handleCompare()
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
                                                Comparing...
                                            </span>
                                        </>

                                    ) : (

                                        <>
                                            Compare

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

                            <div className="mt-6">

                                <p className="
                                    mb-3
                                    text-center
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-gray-400
                                ">

                                    Try an example

                                </p>


                                <div className="
                                    flex
                                    flex-wrap
                                    justify-center
                                    gap-2
                                ">

                                    {examples.map(
                                        (example) => (

                                            <button
                                                key={example}
                                                type="button"
                                                onClick={() =>
                                                    handleCompare(
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
                                                    transition
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

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* ==================================================
                RESULTS
            ================================================== */}

            {searched && (

                <main className="
                    mx-auto
                    max-w-7xl
                    px-5
                    py-10
                    sm:px-6
                    lg:py-14
                ">


                    {/* LOADING */}

                    {loading && (

                        <LoadingState />

                    )}


                    {/* PRODUCTS */}

                    {!loading &&
                        products.length >= 2 && (

                            <>

                                {/* HEADER */}

                                <div className="
                                    mb-8
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-end
                                    sm:justify-between
                                ">

                                    <div>

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                        ">

                                            <div className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-gray-950
                                                text-white
                                            ">

                                                <Sparkles
                                                    size={14}
                                                />

                                            </div>

                                            <span className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.15em]
                                                text-gray-400
                                            ">

                                                AI Comparison

                                            </span>

                                        </div>


                                        <h2 className="
                                            mt-3
                                            text-2xl
                                            font-black
                                            tracking-tight
                                            text-gray-950
                                            sm:text-3xl
                                        ">

                                            Side-by-side comparison

                                        </h2>


                                        <p className="
                                            mt-1
                                            text-sm
                                            text-gray-500
                                        ">

                                            Comparing{" "}

                                            <span className="
                                                font-semibold
                                                text-gray-800
                                            ">

                                                {products.length}

                                            </span>

                                            {" "}products

                                        </p>

                                    </div>


                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                        shadow-sm
                                    ">

                                        <Bot size={14} />

                                        AI analyzed

                                    </div>

                                </div>


                                {/* PRODUCT CARDS */}

                                <div className="
                                    grid
                                    gap-5
                                    md:grid-cols-2
                                    xl:grid-cols-4
                                ">

                                    {products.map(
                                        (product, index) => (

                                            <ComparisonProductCard
                                                key={
                                                    product._id ||
                                                    index
                                                }
                                                product={
                                                    product
                                                }
                                                index={
                                                    index
                                                }
                                                onClick={
                                                    openProduct
                                                }
                                            />

                                        )
                                    )}

                                </div>


                                {/* COMPARISON TABLE */}

                                <ComparisonTable
                                    products={
                                        products
                                    }
                                />


                                {/* AI RESULT */}

                                {comparison && (

                                    <AIRecommendation
                                        comparison={
                                            comparison
                                        }
                                        products={
                                            products
                                        }
                                    />

                                )}

                            </>

                        )}


                    {/* EMPTY */}

                    {!loading &&
                        searched &&
                        products.length < 2 && (

                            <EmptyState
                                onExample={
                                    handleCompare
                                }
                                examples={
                                    examples
                                }
                            />

                        )}

                </main>

            )}

        </div>

    );

};


// ======================================================
// PRODUCT CARD
// ======================================================

const ComparisonProductCard = ({
    product,
    index,
    onClick,
}) => {

    const image = getImage(product);

    const rating = getRating(product);

    return (

        <div
            className="
                group
                overflow-hidden
                rounded-[24px]
                border
                border-gray-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-gray-300
                hover:shadow-xl
            "
            style={{
                animation:
                    `fadeUp 0.5s ease-out ${index * 90}ms both`,
            }}
        >


            {/* IMAGE */}

            <div className="
                relative
                aspect-[4/3]
                overflow-hidden
                bg-gray-100
            ">

                {image ? (

                    <img
                        src={image}
                        alt={getTitle(product)}
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

                    <div className="
                        flex
                        h-full
                        items-center
                        justify-center
                        text-gray-300
                    ">

                        <Package size={40} />

                    </div>

                )}


                {/* NUMBER */}

                <div className="
                    absolute
                    left-3
                    top-3
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/90
                    text-xs
                    font-black
                    text-gray-900
                    shadow-sm
                    backdrop-blur
                ">

                    {index + 1}

                </div>


                {/* RATING */}

                <div className="
                    absolute
                    bottom-3
                    left-3
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-gray-950/90
                    px-2.5
                    py-1.5
                    text-[11px]
                    font-bold
                    text-white
                    backdrop-blur
                ">

                    <Star
                        size={11}
                        fill="currentColor"
                    />

                    {rating.toFixed(1)}

                </div>

            </div>


            {/* INFO */}

            <div className="p-5">

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
                    line-clamp-2
                    min-h-[44px]
                    text-base
                    font-black
                    leading-6
                    text-gray-900
                ">

                    {getTitle(product)}

                </h3>


                <div className="
                    mt-4
                    flex
                    items-center
                    justify-between
                ">

                    <span className="
                        text-xl
                        font-black
                        text-gray-950
                    ">

                        ₹{formatPrice(product.price)}

                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            onClick(product)
                        }
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-gray-100
                            text-gray-700
                            transition
                            hover:bg-gray-950
                            hover:text-white
                        "
                    >

                        <ChevronRight size={16} />

                    </button>

                </div>

            </div>

        </div>

    );

};


// ======================================================
// COMPARISON TABLE
// ======================================================

const ComparisonTable = ({
    products,
}) => {

    const rows = [

        {
            label: "Brand",
            icon: <Package size={15} />,
            getValue: (p) =>
                p.brand || "—",
        },

        {
            label: "Category",
            icon: <GitCompare size={15} />,
            getValue: (p) =>
                getCategory(p),
        },

        {
            label: "Price",
            icon: <CircleDollarSign size={15} />,
            getValue: (p) =>
                `₹${formatPrice(p.price)}`,
        },

        {
            label: "Discount Price",
            icon: <CircleDollarSign size={15} />,
            getValue: (p) =>
                p.discountPrice
                    ? `₹${formatPrice(
                        p.discountPrice
                    )}`
                    : "—",
        },

        {
            label: "Rating",
            icon: <Star size={15} />,
            getValue: (p) =>
                `${getRating(p).toFixed(1)} / 5`,
        },

        {
            label: "Reviews",
            icon: <ThumbsUp size={15} />,
            getValue: (p) =>
                p.totalReviews || 0,
        },

        {
            label: "Stock",
            icon: <Package size={15} />,
            getValue: (p) =>
                p.stock > 0
                    ? `${p.stock} available`
                    : "Out of stock",
        },

        {
            label: "Colors",
            icon: <Sparkles size={15} />,
            getValue: (p) =>
                p.colors?.length
                    ? p.colors.join(", ")
                    : "—",
        },

        {
            label: "Sizes",
            icon: <Sparkles size={15} />,
            getValue: (p) =>
                p.sizes?.length
                    ? p.sizes.join(", ")
                    : "—",
        },

    ];


    return (

        <section className="mt-10 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">

            <div className="
                border-b
                border-gray-100
                px-5
                py-5
                sm:px-6
            ">

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-gray-950
                        text-white
                    ">

                        <GitCompare size={17} />

                    </div>

                    <div>

                        <h3 className="
                            text-sm
                            font-black
                            text-gray-900
                        ">

                            Detailed comparison

                        </h3>

                        <p className="
                            mt-0.5
                            text-xs
                            text-gray-400
                        ">

                            Compare every important specification

                        </p>

                    </div>

                </div>

            </div>


            {/* HORIZONTAL SCROLL ON MOBILE */}

            <div className="overflow-x-auto">

                <table className="
                    min-w-[760px]
                    w-full
                    border-collapse
                ">

                    <thead>

                        <tr className="
                            border-b
                            border-gray-100
                            bg-gray-50/70
                        ">

                            <th className="
                                sticky
                                left-0
                                z-10
                                w-40
                                bg-gray-50/95
                                px-5
                                py-4
                                text-left
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-gray-400
                            ">

                                Specification

                            </th>


                            {products.map(
                                (product) => (

                                    <th
                                        key={
                                            product._id
                                        }
                                        className="
                                            min-w-[210px]
                                            px-5
                                            py-4
                                            text-left
                                        "
                                    >

                                        <div className="
                                            line-clamp-1
                                            text-sm
                                            font-black
                                            text-gray-900
                                        ">

                                            {getTitle(
                                                product
                                            )}

                                        </div>

                                    </th>

                                )
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {rows.map(
                            (row) => (

                                <tr
                                    key={
                                        row.label
                                    }
                                    className="
                                        border-b
                                        border-gray-100
                                        last:border-0
                                        hover:bg-gray-50/50
                                    "
                                >

                                    <td className="
                                        sticky
                                        left-0
                                        z-10
                                        bg-white
                                        px-5
                                        py-4
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-bold
                                            text-gray-600
                                        ">

                                            <span className="
                                                text-gray-400
                                            ">

                                                {row.icon}

                                            </span>

                                            {row.label}

                                        </div>

                                    </td>


                                    {products.map(
                                        (product) => (

                                            <td
                                                key={
                                                    `${product._id}-${row.label}`
                                                }
                                                className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    font-semibold
                                                    text-gray-800
                                                "
                                            >

                                                {row.getValue(
                                                    product
                                                )}

                                            </td>

                                        )
                                    )}

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </section>

    );

};


// ======================================================
// AI RECOMMENDATION
// ======================================================

const AIRecommendation = ({
    comparison,
    products,
}) => {

    return (

        <section className="
            relative
            mt-10
            overflow-hidden
            rounded-[30px]
            border
            border-gray-200
            bg-gray-950
            text-white
            shadow-[0_25px_70px_-30px_rgba(0,0,0,0.6)]
        ">


            {/* BACKGROUND */}

            <div className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                bg-white/10
                blur-3xl
            " />


            <div className="
                pointer-events-none
                absolute
                -bottom-20
                -left-20
                h-64
                w-64
                rounded-full
                bg-purple-400/10
                blur-3xl
            " />


            <div className="
                relative
                p-6
                sm:p-8
                lg:p-10
            ">


                {/* HEADER */}

                <div className="
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-white
                            text-gray-950
                            shadow-lg
                        ">

                            <Bot size={22} />

                        </div>


                        <div>

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <Sparkles
                                    size={14}
                                />

                                <span className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-gray-400
                                ">

                                    NovaCart AI

                                </span>

                            </div>


                            <h3 className="
                                mt-1
                                text-xl
                                font-black
                            ">

                                AI's recommendation

                            </h3>

                        </div>

                    </div>


                    <div className="
                        inline-flex
                        items-center
                        gap-2
                        self-start
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-gray-300
                    ">

                        <Trophy size={14} />

                        Smart analysis

                    </div>

                </div>


                {/* COMPARISON */}

                <div className="
                    mt-7
                    whitespace-pre-line
                    text-sm
                    leading-7
                    text-gray-300
                ">

                    {comparison}

                </div>


                {/* PRODUCTS */}

                <div className="
                    mt-8
                    grid
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                ">

                    {products.map(
                        (product) => (

                            <div
                                key={
                                    product._id
                                }
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/5
                                    p-3
                                "
                            >

                                <div className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-gray-950
                                ">

                                    <Check size={15} />

                                </div>


                                <div className="min-w-0">

                                    <p className="
                                        truncate
                                        text-xs
                                        font-bold
                                        text-white
                                    ">

                                        {getTitle(
                                            product
                                        )}

                                    </p>


                                    <p className="
                                        mt-0.5
                                        text-[10px]
                                        text-gray-500
                                    ">

                                        ₹
                                        {formatPrice(
                                            product.price
                                        )}

                                    </p>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>

        </section>

    );

};


// ======================================================
// LOADING
// ======================================================

const LoadingState = () => {

    return (

        <div className="mt-2">

            <div className="
                flex
                flex-col
                items-center
                justify-center
                rounded-[28px]
                border
                border-gray-200
                bg-white
                px-6
                py-20
                text-center
                shadow-sm
            ">

                <div className="
                    flex
                    h-16
                    w-16
                    animate-pulse
                    items-center
                    justify-center
                    rounded-3xl
                    bg-gray-950
                    text-white
                ">

                    <GitCompare size={25} />

                </div>


                <h3 className="
                    mt-6
                    text-xl
                    font-black
                    text-gray-900
                ">

                    AI is comparing your products

                </h3>


                <p className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-gray-500
                ">

                    Finding the products, analyzing their
                    specifications and preparing your
                    recommendation.

                </p>


                <div className="
                    mt-6
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-gray-400
                ">

                    <Loader2
                        size={14}
                        className="animate-spin"
                    />

                    Please wait...

                </div>

            </div>

        </div>

    );

};


// ======================================================
// EMPTY STATE
// ======================================================

const EmptyState = ({
    onExample,
    examples,
}) => {

    return (

        <div className="
            flex
            flex-col
            items-center
            rounded-[30px]
            border
            border-gray-200
            bg-white
            px-6
            py-20
            text-center
            shadow-sm
        ">

            <div className="
                relative
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-gray-100
                text-gray-500
            ">

                <Search size={30} />

                <div className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-950
                    text-white
                ">

                    <X size={14} />

                </div>

            </div>


            <h3 className="
                mt-6
                text-xl
                font-black
                text-gray-900
            ">

                Couldn't find enough products

            </h3>


            <p className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-gray-500
            ">

                Make sure you mention at least two product
                names that exist in your NovaCart catalog.

            </p>


            <div className="
                mt-7
                flex
                flex-wrap
                justify-center
                gap-2
            ">

                {examples.slice(0, 3).map(
                    (example) => (

                        <button
                            key={example}
                            type="button"
                            onClick={() =>
                                onExample(
                                    example
                                )
                            }
                            className="
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                text-gray-600
                                transition
                                hover:bg-gray-950
                                hover:text-white
                            "
                        >

                            {example}

                        </button>

                    )
                )}

            </div>

        </div>

    );

};


export default CompareProducts;