import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    Bot,
    Check,
    Image as ImageIcon,
    Loader2,
    Package,
    Search,
    Sparkles,
    Tag,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import { imageSearch } from "../../services/aiApi";


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


// ==========================================
// IMAGE SEARCH
// ==========================================

const ImageSearch = () => {

    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);

    const [filters, setFilters] = useState(null);

    const [totalResults, setTotalResults] = useState(0);

    const [searched, setSearched] = useState(false);


    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = async (customQuery = null) => {

        const searchQuery = (
            customQuery !== null
                ? customQuery
                : query
        ).trim();


        if (!searchQuery) {

            toast.error(
                "Describe the product you're looking for"
            );

            return;
        }


        if (loading) return;


        setQuery(searchQuery);

        setLoading(true);

        setSearched(true);

        setProducts([]);

        setFilters(null);

        setTotalResults(0);


        try {

            const response = await imageSearch(
                searchQuery
            );


            const data =
                response?.data?.data;


            setProducts(
                Array.isArray(data?.products)
                    ? data.products
                    : []
            );


            setFilters(
                data?.filters || {}
            );


            setTotalResults(
                data?.totalResults || 0
            );


        } catch (error) {

            console.error(
                "IMAGE SEARCH ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Image search failed"
            );


            setProducts([]);

            setFilters(null);

            setTotalResults(0);


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // ENTER
    // ==========================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSearch();

        }

    };


    // ==========================================
    // PRODUCT
    // ==========================================

    const handleProductClick = (product) => {

        const productId =
            product?._id ||
            product?.id;


        if (!productId) {

            toast.error(
                "Product details unavailable"
            );

            return;
        }


        navigate(
            `/products/${productId}`
        );

    };


    // ==========================================
    // RESET
    // ==========================================

    const handleReset = () => {

        setQuery("");

        setProducts([]);

        setFilters(null);

        setTotalResults(0);

        setSearched(false);

    };


    // ==========================================
    // SUGGESTIONS
    // ==========================================

    const suggestions = [

        "Find black sneakers",

        "Show me white shirts",

        "Blue casual jeans",

        "Black wireless headphones",

    ];


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="min-h-screen bg-[#f7f7f8]">

            {/* ==========================================
                HERO
            ========================================== */}

            <section className="relative overflow-hidden border-b border-gray-200 bg-white">

                {/* Background blobs */}

                <div className="pointer-events-none absolute inset-0">

                    <div
                        className="
                            absolute
                            -left-20
                            -top-32
                            h-[420px]
                            w-[420px]
                            rounded-full
                            bg-purple-200/40
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            -right-20
                            top-10
                            h-[360px]
                            w-[360px]
                            rounded-full
                            bg-blue-200/30
                            blur-3xl
                        "
                    />

                </div>


                <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-6 lg:pt-24">

                    {/* Badge */}

                    <div className="mb-7 flex justify-center">

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
                                tracking-wide
                                text-gray-600
                                shadow-sm
                                animate-[fadeIn_0.5s_ease-out]
                            "
                        >

                            <span
                                className="
                                    flex
                                    h-6
                                    w-6
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-gray-950
                                    text-white
                                "
                            >

                                <ImageIcon size={12} />

                            </span>

                            AI VISUAL SEARCH

                        </div>

                    </div>


                    {/* Heading */}

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

                        Find products.

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
                            Just describe them.
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

                        Tell NovaCart AI what you're looking
                        for and we'll find matching products
                        from your store.

                    </p>


                    {/* SEARCH */}

                    <div className="mx-auto mt-9 max-w-3xl">

                        <div
                            className="
                                group
                                rounded-[24px]
                                border
                                border-gray-200
                                bg-white
                                p-2
                                shadow-[0_25px_70px_-25px_rgba(0,0,0,0.2)]
                                transition-all
                                duration-300
                                focus-within:border-gray-400
                                focus-within:shadow-[0_30px_80px_-25px_rgba(0,0,0,0.3)]
                            "
                        >

                            <div className="flex items-center gap-3">

                                {/* Search Icon */}

                                <div
                                    className="
                                        ml-2
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-gray-100
                                        text-gray-700
                                        transition-all
                                        duration-300
                                        group-focus-within:bg-gray-950
                                        group-focus-within:text-white
                                    "
                                >

                                    {loading ? (

                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Search size={20} />

                                    )}

                                </div>


                                {/* Input */}

                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={handleKeyDown}
                                    disabled={loading}
                                    placeholder="Try “black sneakers”..."
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


                                {/* Clear */}

                                {query && !loading && (

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


                                {/* Search */}

                                <button
                                    type="button"
                                    disabled={
                                        loading ||
                                        !query.trim()
                                    }
                                    onClick={() =>
                                        handleSearch()
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
                                        hover:-translate-y-0.5
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

                                            <span className="hidden sm:block">
                                                Searching
                                            </span>

                                        </>

                                    ) : (

                                        <>

                                            Search

                                            <ArrowRight
                                                size={16}
                                            />

                                        </>

                                    )}

                                </button>

                            </div>

                        </div>


                        {/* Suggestions */}

                        {!searched && (

                            <div className="mt-5 flex flex-wrap justify-center gap-2">

                                {suggestions.map(
                                    (suggestion) => (

                                        <button
                                            type="button"
                                            key={suggestion}
                                            onClick={() =>
                                                handleSearch(
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
                                                font-semibold
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

                                            {suggestion}

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* ==========================================
                RESULTS
            ========================================== */}

            {searched && (

                <main
                    className="
                        mx-auto
                        max-w-7xl
                        px-5
                        py-10
                        sm:px-6
                    "
                >

                    {/* Result Header */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

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
                                    AI Results
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

                                {loading
                                    ? "Looking for matches..."
                                    : `${totalResults} products found`
                                }

                            </h2>


                            {!loading && (

                                <p className="mt-1 text-sm text-gray-500">

                                    Search for

                                    <span className="ml-1 font-semibold text-gray-800">

                                        “{query}”

                                    </span>

                                </p>

                            )}

                        </div>


                        {/* Filter summary */}

                        {!loading && filters && (

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-gray-600
                                    shadow-sm
                                "
                            >

                                <Sparkles size={14} />

                                AI detected filters

                            </div>

                        )}

                    </div>


                    {/* ==========================================
                        FILTERS
                    ========================================== */}

                    {!loading && filters && (

                        <div
                            className="
                                mt-6
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            {filters.brand && (

                                <FilterChip
                                    icon={<Tag size={13} />}
                                    label="Brand"
                                    value={filters.brand}
                                />

                            )}


                            {filters.category && (

                                <FilterChip
                                    icon={<Package size={13} />}
                                    label="Category"
                                    value={filters.category}
                                />

                            )}


                            {filters.color && (

                                <FilterChip
                                    icon={
                                        <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                                    }
                                    label="Color"
                                    value={filters.color}
                                />

                            )}

                        </div>

                    )}


                    {/* ==========================================
                        LOADING
                    ========================================== */}

                    {loading && (

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

                            {Array.from({
                                length: 8
                            }).map((_, index) => (

                                <ProductSkeleton
                                    key={index}
                                />

                            ))}

                        </div>

                    )}


                    {/* ==========================================
                        PRODUCTS
                    ========================================== */}

                    {!loading &&
                        products.length > 0 && (

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

                                {products.map(
                                    (
                                        product,
                                        index
                                    ) => (

                                        <ProductCard
                                            key={
                                                product._id ||
                                                product.id ||
                                                index
                                            }
                                            product={
                                                product
                                            }
                                            index={
                                                index
                                            }
                                            onClick={
                                                handleProductClick
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}


                    {/* ==========================================
                        EMPTY
                    ========================================== */}

                    {!loading &&
                        products.length === 0 && (

                            <div
                                className="
                                    mt-12
                                    flex
                                    flex-col
                                    items-center
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
                                        flex
                                        h-20
                                        w-20
                                        items-center
                                        justify-center
                                        rounded-3xl
                                        bg-gray-100
                                    "
                                >

                                    <ImageIcon
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
                                    No matching products
                                </h3>


                                <p
                                    className="
                                        mt-2
                                        max-w-md
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    "
                                >
                                    Try describing the product
                                    differently or use another
                                    color, category or brand.
                                </p>


                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="
                                        mt-6
                                        rounded-xl
                                        bg-gray-950
                                        px-5
                                        py-3
                                        text-xs
                                        font-bold
                                        text-white
                                        transition
                                        hover:-translate-y-0.5
                                        hover:bg-black
                                    "
                                >
                                    New Search
                                </button>

                            </div>

                        )}

                </main>

            )}

        </div>

    );

};


// ==========================================
// FILTER CHIP
// ==========================================

const FilterChip = ({
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
                animate-[fadeUp_0.4s_ease-out]
            "
        >

            <span className="text-gray-500">

                {icon}

            </span>

            <span
                className="
                    text-[10px]
                    font-bold
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

            <Check
                size={12}
                className="text-gray-400"
            />

        </div>

    );

};


// ==========================================
// PRODUCT CARD
// ==========================================

const ProductCard = ({
    product,
    index,
    onClick,
}) => {

    const image = getProductImage(product);


    return (

        <button
            type="button"
            onClick={() =>
                onClick(product)
            }
            className="
                group
                overflow-hidden
                rounded-[22px]
                border
                border-gray-200
                bg-white
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-gray-300
                hover:shadow-[0_20px_45px_-18px_rgba(0,0,0,0.25)]
                focus:outline-none
                focus:ring-2
                focus:ring-gray-900
                focus:ring-offset-2
            "
            style={{
                animation:
                    `fadeUp 0.5s ease-out ${index * 70}ms both`,
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

                        <Package size={36} />

                    </div>

                )}


                {/* AI BADGE */}

                <div
                    className="
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
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-black
                        text-gray-700
                        shadow-sm
                        backdrop-blur
                    "
                >

                    <Sparkles size={11} />

                    AI MATCH

                </div>


                {/* HOVER ARROW */}

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

            <div className="p-4">

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


                {product.category?.name && (

                    <p className="mt-2 text-xs text-gray-400">

                        {product.category.name}

                    </p>

                )}


                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div className="flex items-center gap-2">

                        <span
                            className="
                                text-lg
                                font-black
                                text-gray-950
                            "
                        >

                            ₹{formatPrice(
                                product.discountPrice ||
                                product.price
                            )}

                        </span>


                        {product.discountPrice > 0 &&
                            product.discountPrice <
                            product.price && (

                                <span
                                    className="
                                        text-xs
                                        text-gray-400
                                        line-through
                                    "
                                >

                                    ₹{formatPrice(
                                        product.price
                                    )}

                                </span>

                            )}

                    </div>


                    <span
                        className="
                            text-[10px]
                            font-bold
                            text-gray-400
                            transition
                            group-hover:text-gray-900
                        "
                    >
                        View →
                    </span>

                </div>

            </div>

        </button>

    );

};


// ==========================================
// SKELETON
// ==========================================

const ProductSkeleton = () => {

    return (

        <div
            className="
                overflow-hidden
                rounded-[22px]
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


            <div className="space-y-3 p-4">

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
                        mt-4
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


export default ImageSearch;