import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    Bot,
    Check,
    ChevronDown,
    Filter,
    Loader2,
    Package,
    Search,
    Sparkles,
    SlidersHorizontal,
    Star,
    Tag,
    X,
    Zap,
} from "lucide-react";

import toast from "react-hot-toast";

import { smartSearch } from "../../services/aiApi";


// ======================================================
// HELPERS
// ======================================================

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


const getProductTitle = (product) => {
    return (
        product?.title ||
        product?.name ||
        "Untitled Product"
    );
};


const getProductId = (product) => {
    return (
        product?._id ||
        product?.id ||
        null
    );
};


// ======================================================
// SMART SEARCH
// ======================================================

const SmartSearch = () => {

    const navigate = useNavigate();


    // ==================================================
    // STATES
    // ==================================================

    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);

    const [filters, setFilters] = useState(null);

    const [totalProducts, setTotalProducts] = useState(0);

    const [searched, setSearched] = useState(false);

    const [showFilters, setShowFilters] = useState(false);


    // ==================================================
    // SEARCH
    // ==================================================

    const handleSearch = async (customQuery = null) => {

        const searchQuery = (
            customQuery !== null
                ? customQuery
                : query
        ).trim();


        if (!searchQuery) {

            toast.error(
                "Tell me what you're looking for"
            );

            return;
        }


        if (loading) {
            return;
        }


        setQuery(searchQuery);

        setLoading(true);

        setSearched(true);

        setProducts([]);

        setFilters(null);

        setTotalProducts(0);

        setShowFilters(false);


        try {

            const response = await smartSearch(
                searchQuery
            );


            console.log(
                "SMART SEARCH RESPONSE:",
                response
            );


            const data = response?.data?.data;


            setProducts(
                Array.isArray(data?.products)
                    ? data.products
                    : []
            );


            setFilters(
                data?.filters || {}
            );


            setTotalProducts(
                Number(data?.totalProducts || 0)
            );


        } catch (error) {

            console.error(
                "SMART SEARCH ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "AI search failed"
            );


            setProducts([]);

            setFilters(null);

            setTotalProducts(0);

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // ENTER KEY
    // ==================================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSearch();

        }

    };


    // ==================================================
    // PRODUCT CLICK
    // ==================================================

    const handleProductClick = (product) => {

        const productId = getProductId(product);


        if (!productId) {

            console.error(
                "PRODUCT ID MISSING:",
                product
            );

            toast.error(
                "Product details unavailable"
            );

            return;
        }


        console.log(
            "Opening Product:",
            productId
        );


        navigate(
            `/products/${productId}`
        );

    };


    // ==================================================
    // SUGGESTIONS
    // ==================================================

    const suggestions = [

        "Black sneakers under ₹5000",

        "Laptop for college",

        "White casual shirts",

        "Wireless headphones",

    ];


    // ==================================================
    // RESET
    // ==================================================

    const handleReset = () => {

        setQuery("");

        setProducts([]);

        setFilters(null);

        setTotalProducts(0);

        setSearched(false);

        setShowFilters(false);

    };


    // ==================================================
    // ACTIVE FILTERS
    // ==================================================

    const activeFilters = filters
        ? Object.entries(filters).filter(
            ([key, value]) => {

                if (
                    key === "keywords" &&
                    Array.isArray(value)
                ) {

                    return value.length > 0;

                }


                return (
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                );

            }
        )
        : [];


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="min-h-screen bg-[#f7f7f8]">


            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="relative overflow-hidden border-b border-gray-200 bg-white">


                {/* BACKGROUND */}

                <div className="pointer-events-none absolute inset-0">

                    <div className="absolute left-[8%] top-[-180px] h-[450px] w-[450px] rounded-full bg-purple-200/30 blur-3xl" />

                    <div className="absolute right-[5%] top-[-150px] h-[420px] w-[420px] rounded-full bg-blue-200/25 blur-3xl" />

                    <div className="absolute bottom-[-200px] left-[40%] h-[350px] w-[350px] rounded-full bg-pink-100/30 blur-3xl" />

                </div>


                <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-6 lg:pb-20 lg:pt-24">


                    {/* BADGE */}

                    <div className="mb-7 flex justify-center">

                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-gray-200
                            bg-white/90
                            px-4
                            py-2
                            text-xs
                            font-bold
                            tracking-wide
                            text-gray-600
                            shadow-sm
                            backdrop-blur
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

                                <Sparkles size={12} />

                            </span>

                            NOVACART AI

                            <span className="text-gray-300">
                                •
                            </span>

                            SMART SHOPPING

                        </div>

                    </div>


                    {/* TITLE */}

                    <h1 className="
                        mx-auto
                        max-w-4xl
                        text-center
                        text-4xl
                        font-black
                        leading-[1.05]
                        tracking-[-0.04em]
                        text-gray-950
                        sm:text-5xl
                        lg:text-7xl
                    ">

                        Search smarter.

                        <span className="
                            block
                            bg-gradient-to-r
                            from-gray-950
                            via-gray-600
                            to-gray-300
                            bg-clip-text
                            text-transparent
                        ">

                            Shop better.

                        </span>

                    </h1>


                    {/* DESCRIPTION */}

                    <p className="
                        mx-auto
                        mt-6
                        max-w-2xl
                        text-center
                        text-sm
                        leading-7
                        text-gray-500
                        sm:text-base
                    ">

                        Just describe what you want.
                        Our AI understands your requirements,
                        finds matching products and ranks them
                        for you.

                    </p>


                    {/* SEARCH */}

                    <div className="mx-auto mt-10 max-w-3xl">

                        <div className="
                            group
                            rounded-[26px]
                            border
                            border-gray-200
                            bg-white
                            p-2
                            shadow-[0_25px_70px_-25px_rgba(0,0,0,0.22)]
                            transition-all
                            duration-300
                            focus-within:border-gray-400
                            focus-within:shadow-[0_30px_80px_-25px_rgba(0,0,0,0.28)]
                        ">

                            <div className="flex items-center gap-2 sm:gap-3">


                                {/* SEARCH ICON */}

                                <div className="
                                    ml-1
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
                                    duration-300
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
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={handleKeyDown}
                                    disabled={loading}
                                    placeholder='Try "black sneakers under ₹5000"...'
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
                                            hover:text-gray-900
                                        "
                                    >

                                        <X size={17} />

                                    </button>

                                )}


                                {/* SEARCH BUTTON */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSearch()
                                    }
                                    disabled={
                                        loading ||
                                        !query.trim()
                                    }
                                    className="
                                        flex
                                        h-11
                                        shrink-0
                                        items-center
                                        gap-2
                                        rounded-2xl
                                        bg-gray-950
                                        px-4
                                        text-sm
                                        font-bold
                                        text-white
                                        transition-all
                                        duration-300
                                        hover:bg-black
                                        hover:shadow-lg
                                        hover:-translate-y-0.5
                                        disabled:cursor-not-allowed
                                        disabled:bg-gray-200
                                        disabled:text-gray-400
                                        sm:px-5
                                    "
                                >

                                    {loading ? (

                                        <>

                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />

                                            <span className="hidden sm:inline">
                                                Finding...
                                            </span>

                                        </>

                                    ) : (

                                        <>

                                            <span>
                                                Search
                                            </span>

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


                    {/* SMALL TRUST ROW */}

                    <div className="
                        mt-7
                        flex
                        flex-wrap
                        justify-center
                        gap-x-6
                        gap-y-2
                        text-[11px]
                        font-semibold
                        text-gray-400
                    ">

                        <span className="flex items-center gap-1.5">

                            <Zap size={13} />

                            AI powered matching

                        </span>

                        <span className="flex items-center gap-1.5">

                            <Check size={13} />

                            Natural language search

                        </span>

                        <span className="flex items-center gap-1.5">

                            <Package size={13} />

                            Real products

                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================================
                RESULTS
            ===================================================== */}

            {searched && (

                <main className="
                    mx-auto
                    max-w-7xl
                    px-5
                    py-10
                    sm:px-6
                    lg:py-14
                ">


                    {/* RESULT HEADER */}

                    <div className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    ">

                        <div>

                            <div className="flex items-center gap-2">

                                <div className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-gray-950
                                    text-white
                                    shadow-sm
                                ">

                                    <Bot size={16} />

                                </div>

                                <span className="
                                    text-[11px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-gray-400
                                ">

                                    AI Results

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

                                {loading
                                    ? "Finding your matches..."
                                    : `${totalProducts} products found`
                                }

                            </h2>


                            {!loading && (

                                <p className="
                                    mt-2
                                    text-sm
                                    text-gray-500
                                ">

                                    Results tailored to:

                                    <span className="
                                        ml-1
                                        font-bold
                                        text-gray-800
                                    ">

                                        “{query}”

                                    </span>

                                </p>

                            )}

                        </div>


                        {/* FILTER BUTTON */}

                        {!loading && filters && (

                            <button
                                type="button"
                                onClick={() =>
                                    setShowFilters(
                                        !showFilters
                                    )
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    self-start
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-gray-700
                                    shadow-sm
                                    transition-all
                                    hover:border-gray-300
                                    hover:shadow-md
                                    sm:self-auto
                                "
                            >

                                <SlidersHorizontal
                                    size={15}
                                />

                                AI filters


                                {activeFilters.length > 0 && (

                                    <span className="
                                        flex
                                        h-5
                                        min-w-5
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-gray-950
                                        px-1.5
                                        text-[10px]
                                        text-white
                                    ">

                                        {activeFilters.length}

                                    </span>

                                )}


                                <ChevronDown
                                    size={14}
                                    className={`
                                        transition-transform
                                        duration-300
                                        ${showFilters
                                            ? "rotate-180"
                                            : ""
                                        }
                                    `}
                                />

                            </button>

                        )}

                    </div>


                    {/* =================================================
                        FILTER PANEL
                    ================================================= */}

                    {!loading &&
                        showFilters &&
                        filters && (

                            <div className="
                                mt-6
                                overflow-hidden
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                shadow-sm
                            ">

                                <div className="
                                    border-b
                                    border-gray-100
                                    px-5
                                    py-4
                                ">

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
                                            rounded-lg
                                            bg-gray-100
                                        ">

                                            <Filter
                                                size={15}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="
                                                text-sm
                                                font-black
                                                text-gray-900
                                            ">

                                                AI detected preferences

                                            </h3>

                                            <p className="
                                                mt-0.5
                                                text-[11px]
                                                text-gray-400
                                            ">

                                                These filters were
                                                extracted from your query.

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="
                                    flex
                                    flex-wrap
                                    gap-2
                                    p-5
                                ">

                                    {filters.brand && (

                                        <FilterChip
                                            icon={
                                                <Tag
                                                    size={13}
                                                />
                                            }
                                            label="Brand"
                                            value={
                                                filters.brand
                                            }
                                        />

                                    )}


                                    {filters.category && (

                                        <FilterChip
                                            icon={
                                                <Package
                                                    size={13}
                                                />
                                            }
                                            label="Category"
                                            value={
                                                filters.category
                                            }
                                        />

                                    )}


                                    {filters.color && (

                                        <FilterChip
                                            icon={
                                                <span className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-gray-900
                                                " />
                                            }
                                            label="Color"
                                            value={
                                                filters.color
                                            }
                                        />

                                    )}


                                    {filters.minPrice !== undefined &&
                                        filters.minPrice !== null &&
                                        filters.minPrice !== "" && (

                                            <FilterChip
                                                icon={
                                                    <span className="text-xs">
                                                        ₹
                                                    </span>
                                                }
                                                label="Min price"
                                                value={`₹${formatPrice(
                                                    filters.minPrice
                                                )}`}
                                            />

                                        )}


                                    {filters.maxPrice !== undefined &&
                                        filters.maxPrice !== null &&
                                        filters.maxPrice !== "" && (

                                            <FilterChip
                                                icon={
                                                    <span className="text-xs">
                                                        ₹
                                                    </span>
                                                }
                                                label="Max price"
                                                value={`₹${formatPrice(
                                                    filters.maxPrice
                                                )}`}
                                            />

                                        )}


                                    {Array.isArray(
                                        filters.keywords
                                    ) &&
                                        filters.keywords.map(
                                            (keyword) => (

                                                <FilterChip
                                                    key={keyword}
                                                    icon={
                                                        <Check
                                                            size={13}
                                                        />
                                                    }
                                                    label="Keyword"
                                                    value={
                                                        keyword
                                                    }
                                                />

                                            )
                                        )}

                                </div>

                            </div>

                        )}


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="
                            mt-10
                            grid
                            gap-5
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                        ">

                            {Array.from({
                                length: 8
                            }).map((_, index) => (

                                <ProductSkeleton
                                    key={index}
                                />

                            ))}

                        </div>

                    )}


                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    {!loading &&
                        products.length > 0 && (

                            <div className="
                                mt-10
                                grid
                                gap-5
                                sm:grid-cols-2
                                lg:grid-cols-3
                                xl:grid-cols-4
                            ">

                                {products.map(
                                    (
                                        product,
                                        index
                                    ) => (

                                        <ProductCard
                                            key={
                                                getProductId(
                                                    product
                                                ) ||
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


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {!loading &&
                        searched &&
                        products.length === 0 && (

                            <div className="
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
                            ">

                                <div className="relative">

                                    <div className="
                                        flex
                                        h-20
                                        w-20
                                        items-center
                                        justify-center
                                        rounded-3xl
                                        bg-gray-100
                                    ">

                                        <Package
                                            size={30}
                                            className="text-gray-400"
                                        />

                                    </div>

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

                                        <Search size={14} />

                                    </div>

                                </div>


                                <h3 className="
                                    mt-6
                                    text-xl
                                    font-black
                                    text-gray-900
                                ">

                                    No perfect matches yet

                                </h3>


                                <p className="
                                    mt-2
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-gray-500
                                ">

                                    Try changing the color,
                                    category, price range,
                                    or describe your requirements
                                    differently.

                                </p>


                                <div className="
                                    mt-6
                                    flex
                                    flex-wrap
                                    justify-center
                                    gap-2
                                ">

                                    {suggestions
                                        .slice(0, 3)
                                        .map(
                                            (suggestion) => (

                                                <button
                                                    type="button"
                                                    key={
                                                        suggestion
                                                    }
                                                    onClick={() =>
                                                        handleSearch(
                                                            suggestion
                                                        )
                                                    }
                                                    className="
                                                        rounded-xl
                                                        border
                                                        border-gray-200
                                                        px-4
                                                        py-2
                                                        text-xs
                                                        font-bold
                                                        text-gray-600
                                                        transition-all
                                                        hover:bg-gray-950
                                                        hover:text-white
                                                    "
                                                >

                                                    {suggestion}

                                                </button>

                                            )
                                        )}

                                </div>

                            </div>

                        )}

                </main>

            )}

        </div>

    );

};


// ======================================================
// FILTER CHIP
// ======================================================

const FilterChip = ({
    icon,
    label,
    value,
}) => {

    return (

        <div className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            px-3
            py-2
            transition
            hover:border-gray-300
            hover:bg-white
        ">

            <span className="text-gray-500">

                {icon}

            </span>

            <span className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-gray-400
            ">

                {label}

            </span>

            <span className="
                text-xs
                font-black
                text-gray-800
            ">

                {value}

            </span>

        </div>

    );

};


// ======================================================
// PRODUCT CARD
// ======================================================

const ProductCard = ({
    product,
    index,
    onClick,
}) => {

    const image = getProductImage(product);

    const title = getProductTitle(product);

    const productId = getProductId(product);

    const originalPrice = Number(
        product?.price || 0
    );

    const discountPrice = Number(
        product?.discountPrice || 0
    );

    const finalPrice =
        discountPrice > 0 &&
        discountPrice < originalPrice
            ? discountPrice
            : originalPrice;


    const discountPercent =
        discountPrice > 0 &&
        discountPrice < originalPrice
            ? Math.round(
                (
                    (originalPrice - discountPrice) /
                    originalPrice
                ) * 100
            )
            : 0;


    return (

        <button
            type="button"
            onClick={() =>
                onClick(product)
            }
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
                    `fadeUp 0.5s ease-out ${index * 70}ms both`,
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
                        alt={title}
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                        "
                    />

                ) : (

                    <div className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        text-gray-300
                    ">

                        <Package size={34} />

                    </div>

                )}


                {/* IMAGE GRADIENT */}

                <div className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0
                    h-24
                    bg-gradient-to-t
                    from-black/20
                    to-transparent
                " />


                {/* AI BADGE */}

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
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-black
                    text-gray-700
                    shadow-sm
                    backdrop-blur
                ">

                    <Sparkles size={11} />

                    AI MATCH

                </div>


                {/* DISCOUNT */}

                {discountPercent > 0 && (

                    <div className="
                        absolute
                        right-3
                        top-3
                        rounded-full
                        bg-gray-950
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-black
                        text-white
                        shadow-lg
                    ">

                        {discountPercent}% OFF

                    </div>

                )}


                {/* HOVER ARROW */}

                <div className="
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
                ">

                    <ArrowRight size={15} />

                </div>

            </div>


            {/* INFO */}

            <div className="p-4">


                {/* BRAND */}

                {product?.brand && (

                    <p className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-gray-400
                    ">

                        {product.brand}

                    </p>

                )}


                {/* TITLE */}

                <h3 className="
                    mt-1.5
                    line-clamp-2
                    min-h-[40px]
                    text-sm
                    font-black
                    leading-5
                    text-gray-900
                ">

                    {title}

                </h3>


                {/* CATEGORY */}

                {product?.category?.name && (

                    <p className="
                        mt-2
                        text-xs
                        font-medium
                        text-gray-400
                    ">

                        {product.category.name}

                    </p>

                )}


                {/* RATING */}

                <div className="
                    mt-3
                    flex
                    items-center
                    gap-1.5
                ">

                    <div className="
                        flex
                        items-center
                        gap-1
                        rounded-md
                        bg-gray-100
                        px-1.5
                        py-1
                    ">

                        <Star
                            size={11}
                            className="fill-gray-700 text-gray-700"
                        />

                        <span className="
                            text-[10px]
                            font-bold
                            text-gray-700
                        ">

                            {Number(
                                product?.averageRating ||
                                product?.rating ||
                                0
                            ).toFixed(1)}

                        </span>

                    </div>


                    {product?.totalReviews > 0 && (

                        <span className="
                            text-[10px]
                            text-gray-400
                        ">

                            ({product.totalReviews})

                        </span>

                    )}

                </div>


                {/* PRICE */}

                <div className="
                    mt-4
                    flex
                    items-end
                    justify-between
                    gap-2
                ">

                    <div>

                        <span className="
                            text-lg
                            font-black
                            text-gray-950
                        ">

                            ₹{formatPrice(
                                finalPrice
                            )}

                        </span>


                        {discountPercent > 0 && (

                            <span className="
                                ml-2
                                text-xs
                                font-medium
                                text-gray-400
                                line-through
                            ">

                                ₹{formatPrice(
                                    originalPrice
                                )}

                            </span>

                        )}

                    </div>


                    <span className="
                        text-[10px]
                        font-bold
                        text-gray-400
                        transition
                        group-hover:text-gray-900
                    ">

                        View →

                    </span>

                </div>


                {/* STOCK */}

                {product?.stock !== undefined && (

                    <div className="mt-3">

                        {product.stock > 0 ? (

                            <span className="
                                text-[10px]
                                font-bold
                                text-gray-500
                            ">

                                ✓ In stock

                            </span>

                        ) : (

                            <span className="
                                text-[10px]
                                font-bold
                                text-red-500
                            ">

                                Out of stock

                            </span>

                        )}

                    </div>

                )}

            </div>

        </button>

    );

};


// ======================================================
// SKELETON
// ======================================================

const ProductSkeleton = () => {

    return (

        <div className="
            overflow-hidden
            rounded-[24px]
            border
            border-gray-200
            bg-white
        ">

            <div className="
                aspect-[4/3]
                animate-pulse
                bg-gray-200
            " />

            <div className="
                space-y-3
                p-4
            ">

                <div className="
                    h-2.5
                    w-20
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
                    w-3/4
                    animate-pulse
                    rounded
                    bg-gray-100
                " />

                <div className="
                    h-3
                    w-20
                    animate-pulse
                    rounded
                    bg-gray-100
                " />

                <div className="
                    mt-4
                    h-6
                    w-24
                    animate-pulse
                    rounded
                    bg-gray-200
                " />

            </div>

        </div>

    );

};


export default SmartSearch;