import {
    useCallback,
    useState,
} from "react";

import {
    Bot,
    ChevronRight,
    Copy,
    History,
    Loader2,
    MessageCircle,
    Package,
    Plus,
    RefreshCw,
    Send,
    Sparkles,
    Trash2,
    User,
    X,
    ExternalLink,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
    chatWithAI,
    clearChat,
    getChatHistory,
} from "../../services/aiApi";


// ==========================================
// HELPERS
// ==========================================

const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};


const getProductImage = (product) => {
    if (!product) return null;

    return (
        product.image ||
        product.images?.[0] ||
        product.thumbnail ||
        null
    );
};


// ==========================================
// AI CHAT
// ==========================================

const AIChat = () => {

    const navigate = useNavigate();


    // ======================================
    // STATES
    // ======================================

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const [historyLoading, setHistoryLoading] =
        useState(false);

    const [clearing, setClearing] =
        useState(false);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [copiedIndex, setCopiedIndex] =
        useState(null);


    // ======================================
    // LOAD CHAT HISTORY
    // ======================================

    const loadHistory = useCallback(
        async () => {

            try {

                setHistoryLoading(true);

                const response =
                    await getChatHistory();

                const history =
                    response?.data?.data;

                if (Array.isArray(history)) {

                    setMessages(
                        history.map(
                            (message) => ({
                                role:
                                    message.role,

                                content:
                                    message.content,

                                createdAt:
                                    message.createdAt,

                                products:
                                    Array.isArray(
                                        message.products
                                    )
                                        ? message.products
                                        : [],
                            })
                        )
                    );

                }

            } catch (error) {

                console.error(
                    "CHAT HISTORY ERROR:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load chat history"
                );

            } finally {

                setHistoryLoading(false);

            }

        },
        []
    );


    // ======================================
    // OPEN HISTORY
    // ======================================

    const handleOpenHistory = async () => {

        setSidebarOpen(true);

        await loadHistory();

    };


    // ======================================
    // OPEN PRODUCT
    // ======================================

    const handleProductClick = (product) => {

        if (!product) {

            toast.error(
                "Product details unavailable"
            );

            return;

        }

        // MongoDB product ID
        const productId =
            product._id ||
            product.id;

        if (!productId) {

            console.error(
                "PRODUCT ID MISSING:",
                product
            );

            toast.error(
                "Product ID unavailable"
            );

            return;

        }

        /*
         * IMPORTANT
         *
         * This is the FRONTEND route.
         *
         * Backend:
         * GET /api/products/:id
         *
         * Frontend:
         * /products/:id
         */

        navigate(`/products/${productId}`);

    };


    // ======================================
    // SEND MESSAGE
    // ======================================

    const handleSend = async (
        customMessage = null
    ) => {

        const message = (
            customMessage !== null
                ? customMessage
                : input
        ).trim();

        if (!message || loading) {
            return;
        }


        // ==================================
        // OPTIMISTIC USER MESSAGE
        // ==================================

        const userMessage = {

            role: "user",

            content: message,

            createdAt:
                new Date().toISOString(),

            products: [],
        };


        setMessages(
            (previous) => [
                ...previous,
                userMessage,
            ]
        );


        setInput("");

        setLoading(true);


        // ==================================
        // API CALL
        // ==================================

        try {

            const response =
                await chatWithAI(message);


            const data =
                response?.data?.data;


            const aiMessage = {

                role: "assistant",

                content:
                    data?.reply ||
                    "Sorry, I couldn't generate a response.",

                products:
                    Array.isArray(
                        data?.products
                    )
                        ? data.products
                        : [],

                createdAt:
                    new Date().toISOString(),

            };


            setMessages(
                (previous) => [
                    ...previous,
                    aiMessage,
                ]
            );


        } catch (error) {

            console.error(
                "AI CHAT ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "AI assistant is unavailable"
            );


            setMessages(
                (previous) => [
                    ...previous,
                    {

                        role: "assistant",

                        content:
                            "Sorry, something went wrong while processing your request.",

                        createdAt:
                            new Date().toISOString(),

                        products: [],

                    },
                ]
            );

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

            handleSend();

        }

    };


    // ======================================
    // CLEAR CHAT
    // ======================================

    const handleClearChat = async () => {

        if (clearing) {
            return;
        }


        const confirmed =
            window.confirm(
                "Clear your entire AI conversation?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setClearing(true);

            await clearChat();

            setMessages([]);

            toast.success(
                "Conversation cleared"
            );

        } catch (error) {

            console.error(
                "CLEAR CHAT ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to clear conversation"
            );

        } finally {

            setClearing(false);

        }

    };


    // ======================================
    // NEW CHAT
    // ======================================

    const handleNewChat = () => {

        setMessages([]);

        setInput("");

        setSidebarOpen(false);

    };


    // ======================================
    // COPY MESSAGE
    // ======================================

    const handleCopy = async (
        content,
        index
    ) => {

        try {

            await navigator.clipboard.writeText(
                content
            );

            setCopiedIndex(index);


            setTimeout(() => {

                setCopiedIndex(null);

            }, 1500);


        } catch {

            toast.error(
                "Unable to copy message"
            );

        }

    };


    // ======================================
    // SUGGESTIONS
    // ======================================

    const suggestions = [

        "Find black sneakers under ₹5000",

        "Suggest a laptop for college",

        "Show me trending products",

        "I need a stylish outfit",

    ];


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-[calc(100vh-73px)] bg-[#f7f7f8]">

            <div className="mx-auto flex h-[calc(100vh-73px)] max-w-[1500px] overflow-hidden">


                {/* ==================================
                    SIDEBAR
                ================================== */}

                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50
                        w-[310px]
                        transform border-r border-gray-200
                        bg-white
                        transition-transform duration-300
                        lg:static lg:translate-x-0
                        ${
                            sidebarOpen
                                ? "translate-x-0"
                                : "-translate-x-full"
                        }
                    `}
                >

                    {/* SIDEBAR HEADER */}

                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm">

                                <History size={18} />

                            </div>

                            <div>

                                <h2 className="text-sm font-bold text-gray-900">
                                    AI History
                                </h2>

                                <p className="text-xs text-gray-400">
                                    Your conversations
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                        >

                            <X size={18} />

                        </button>

                    </div>


                    {/* NEW CHAT */}

                    <div className="p-4">

                        <button
                            type="button"
                            onClick={handleNewChat}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
                        >

                            <Plus size={17} />

                            New conversation

                        </button>

                    </div>


                    {/* HISTORY */}

                    <div className="flex h-[calc(100%-142px)] flex-col">

                        <div className="flex items-center justify-between px-5 py-2">

                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                Recent messages
                            </span>


                            <button
                                type="button"
                                onClick={loadHistory}
                                disabled={historyLoading}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >

                                <RefreshCw
                                    size={14}
                                    className={
                                        historyLoading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                            </button>

                        </div>


                        <div className="flex-1 overflow-y-auto px-3 pb-4">

                            {historyLoading ? (

                                <div className="space-y-3 px-2 py-4">

                                    {[1, 2, 3, 4].map(
                                        (item) => (

                                            <div
                                                key={item}
                                                className="animate-pulse rounded-xl border border-gray-100 p-3"
                                            >

                                                <div className="h-3 w-3/4 rounded bg-gray-200" />

                                                <div className="mt-2 h-2 w-1/2 rounded bg-gray-100" />

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : messages.length === 0 ? (

                                <div className="flex h-full flex-col items-center justify-center px-5 text-center">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">

                                        <MessageCircle
                                            size={21}
                                            className="text-gray-400"
                                        />

                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-gray-700">
                                        No conversations yet
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-400">
                                        Start chatting with NovaCart AI.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-1">

                                    {messages.map(
                                        (
                                            message,
                                            index
                                        ) => (

                                            <button
                                                type="button"
                                                key={`${message.createdAt || index}-${index}`}
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                                className="group w-full rounded-xl px-3 py-3 text-left transition hover:bg-gray-50"
                                            >

                                                <div className="flex items-start gap-3">

                                                    <div
                                                        className={`
                                                            mt-0.5 flex
                                                            h-7 w-7
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            ${
                                                                message.role ===
                                                                "user"
                                                                    ? "bg-gray-100"
                                                                    : "bg-gray-900"
                                                            }
                                                        `}
                                                    >

                                                        {message.role ===
                                                        "user" ? (

                                                            <User
                                                                size={13}
                                                                className="text-gray-600"
                                                            />

                                                        ) : (

                                                            <Sparkles
                                                                size={13}
                                                                className="text-white"
                                                            />

                                                        )}

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-xs font-medium text-gray-700">
                                                            {message.content}
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-gray-400">
                                                            {formatTime(
                                                                message.createdAt
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* CLEAR */}

                        <div className="border-t border-gray-100 p-4">

                            <button
                                type="button"
                                onClick={
                                    handleClearChat
                                }
                                disabled={
                                    clearing ||
                                    messages.length ===
                                        0
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >

                                {clearing ? (

                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Trash2 size={15} />

                                )}

                                Clear conversation

                            </button>

                        </div>

                    </div>

                </aside>


                {/* MOBILE OVERLAY */}

                {sidebarOpen && (

                    <button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    />

                )}


                {/* ==================================
                    MAIN CHAT
                ================================== */}

                <main className="flex min-w-0 flex-1 flex-col">


                    {/* HEADER */}

                    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">

                        <div className="flex min-w-0 items-center gap-3">

                            <button
                                type="button"
                                onClick={
                                    handleOpenHistory
                                }
                                className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50 lg:hidden"
                            >

                                <History size={18} />

                            </button>


                            <div className="relative">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 text-white shadow-sm">

                                    <Sparkles size={20} />

                                </div>

                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />

                            </div>


                            <div className="min-w-0">

                                <h1 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                                    NovaCart AI
                                </h1>

                                <div className="mt-0.5 flex items-center gap-1.5">

                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                                    <p className="text-xs text-gray-400">
                                        Shopping assistant
                                    </p>

                                </div>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleClearChat
                            }
                            disabled={
                                clearing ||
                                messages.length ===
                                    0
                            }
                            className="rounded-xl p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                            title="Clear chat"
                        >

                            <Trash2 size={18} />

                        </button>

                    </header>


                    {/* ==================================
                        MESSAGES
                    ================================== */}

                    <div className="flex-1 overflow-y-auto">

                        {messages.length === 0 ? (

                            <div className="flex min-h-full flex-col items-center justify-center px-5 py-12">

                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-900 to-gray-600 text-white shadow-xl">

                                    <Bot size={28} />

                                </div>


                                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                    What can I help you find?
                                </h2>


                                <p className="mt-3 max-w-lg text-center text-sm leading-6 text-gray-500">
                                    Tell NovaCart AI what you're looking for.
                                    I can understand your preferences and find
                                    matching products for you.
                                </p>


                                {/* SUGGESTIONS */}

                                <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">

                                    {suggestions.map(
                                        (
                                            suggestion
                                        ) => (

                                            <button
                                                type="button"
                                                key={
                                                    suggestion
                                                }
                                                onClick={() =>
                                                    handleSend(
                                                        suggestion
                                                    )
                                                }
                                                className="group rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                                            >

                                                <div className="flex items-center justify-between gap-3">

                                                    <p className="text-sm font-medium text-gray-700">
                                                        {
                                                            suggestion
                                                        }
                                                    </p>

                                                    <ChevronRight
                                                        size={
                                                            16
                                                        }
                                                        className="shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-700"
                                                    />

                                                </div>

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        ) : (

                            <div className="mx-auto w-full max-w-4xl space-y-7 px-4 py-8 sm:px-6">

                                {messages.map(
                                    (
                                        message,
                                        index
                                    ) => {

                                        const isUser =
                                            message.role ===
                                            "user";


                                        return (

                                            <div
                                                key={`${message.createdAt || index}-${index}`}
                                                className={`flex gap-3 sm:gap-4 ${
                                                    isUser
                                                        ? "flex-row-reverse"
                                                        : ""
                                                }`}
                                            >

                                                {/* AVATAR */}

                                                <div
                                                    className={`
                                                        flex h-9 w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        ${
                                                            isUser
                                                                ? "bg-gray-100 text-gray-600"
                                                                : "bg-gray-900 text-white"
                                                        }
                                                    `}
                                                >

                                                    {isUser ? (

                                                        <User
                                                            size={16}
                                                        />

                                                    ) : (

                                                        <Sparkles
                                                            size={16}
                                                        />

                                                    )}

                                                </div>


                                                {/* CONTENT */}

                                                <div
                                                    className={`
                                                        min-w-0
                                                        max-w-[85%]
                                                        sm:max-w-[78%]
                                                        ${
                                                            isUser
                                                                ? "items-end"
                                                                : "items-start"
                                                        }
                                                        flex flex-col
                                                    `}
                                                >

                                                    {/* MESSAGE */}

                                                    <div
                                                        className={`
                                                            rounded-2xl
                                                            px-4 py-3.5
                                                            text-sm
                                                            leading-6
                                                            ${
                                                                isUser
                                                                    ? "rounded-tr-md bg-gray-900 text-white"
                                                                    : "rounded-tl-md border border-gray-200 bg-white text-gray-700 shadow-sm"
                                                            }
                                                        `}
                                                    >

                                                        <p className="whitespace-pre-wrap break-words">
                                                            {
                                                                message.content
                                                            }
                                                        </p>

                                                    </div>


                                                    {/* META */}

                                                    <div
                                                        className={`
                                                            mt-1.5 flex
                                                            items-center
                                                            gap-2
                                                            ${
                                                                isUser
                                                                    ? "flex-row-reverse"
                                                                    : ""
                                                            }
                                                        `}
                                                    >

                                                        <span className="text-[10px] text-gray-400">

                                                            {formatTime(
                                                                message.createdAt
                                                            )}

                                                        </span>


                                                        {!isUser && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        message.content,
                                                                        index
                                                                    )
                                                                }
                                                                className="rounded-md p-1 text-gray-300 transition hover:bg-gray-100 hover:text-gray-600"
                                                                title="Copy"
                                                            >

                                                                <Copy
                                                                    size={
                                                                        12
                                                                    }
                                                                />

                                                            </button>

                                                        )}


                                                        {copiedIndex ===
                                                            index && (

                                                            <span className="text-[10px] font-medium text-green-600">
                                                                Copied
                                                            </span>

                                                        )}

                                                    </div>


                                                    {/* ==================================
                                                        PRODUCTS
                                                    ================================== */}

                                                    {!isUser &&
                                                        Array.isArray(
                                                            message.products
                                                        ) &&
                                                        message.products
                                                            .length >
                                                            0 && (

                                                            <div className="mt-4 w-full">

                                                                <div className="mb-3 flex items-center gap-2">

                                                                    <Package
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="text-gray-500"
                                                                    />

                                                                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                                                        Recommended products
                                                                    </span>

                                                                </div>


                                                                <div className="grid gap-3 sm:grid-cols-2">

                                                                    {message.products.map(
                                                                        (
                                                                            product
                                                                        ) => {

                                                                            const image =
                                                                                getProductImage(
                                                                                    product
                                                                                );


                                                                            return (

                                                                                <button
                                                                                    type="button"
                                                                                    key={
                                                                                        product._id ||
                                                                                        product.id
                                                                                    }
                                                                                    onClick={() =>
                                                                                        handleProductClick(
                                                                                            product
                                                                                        )
                                                                                    }
                                                                                    className="group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                                                                                >

                                                                                    <div className="flex gap-3 p-3">

                                                                                        {/* IMAGE */}

                                                                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                                                                                            {image ? (

                                                                                                <img
                                                                                                    src={
                                                                                                        image
                                                                                                    }
                                                                                                    alt={
                                                                                                        product.name ||
                                                                                                        "Product"
                                                                                                    }
                                                                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                                                                />

                                                                                            ) : (

                                                                                                <div className="flex h-full w-full items-center justify-center text-gray-300">

                                                                                                    <Package
                                                                                                        size={
                                                                                                            22
                                                                                                        }
                                                                                                    />

                                                                                                </div>

                                                                                            )}

                                                                                        </div>


                                                                                        {/* INFO */}

                                                                                        <div className="min-w-0 flex-1">

                                                                                            <div className="flex items-start justify-between gap-2">

                                                                                                <h3 className="truncate text-sm font-bold text-gray-900">

                                                                                                    {
                                                                                                        product.name ||
                                                                                                        "Unnamed product"
                                                                                                    }

                                                                                                </h3>


                                                                                                <ExternalLink
                                                                                                    size={
                                                                                                        14
                                                                                                    }
                                                                                                    className="mt-0.5 shrink-0 text-gray-300 transition group-hover:text-gray-700"
                                                                                                />

                                                                                            </div>


                                                                                            {product.brand && (

                                                                                                <p className="mt-1 truncate text-xs text-gray-400">

                                                                                                    {
                                                                                                        product.brand
                                                                                                    }

                                                                                                </p>

                                                                                            )}


                                                                                            <p className="mt-2 text-sm font-bold text-gray-900">

                                                                                                ₹
                                                                                                {Number(
                                                                                                    product.price ||
                                                                                                        0
                                                                                                ).toLocaleString(
                                                                                                    "en-IN"
                                                                                                )}

                                                                                            </p>


                                                                                            <p className="mt-1 text-[10px] font-medium text-gray-400 transition group-hover:text-gray-700">

                                                                                                View product →

                                                                                            </p>

                                                                                        </div>

                                                                                    </div>

                                                                                </button>

                                                                            );

                                                                        }
                                                                    )}

                                                                </div>

                                                            </div>

                                                        )}

                                                </div>

                                            </div>

                                        );

                                    }
                                )}


                                {/* ==================================
                                    TYPING
                                ================================== */}

                                {loading && (

                                    <div className="flex gap-3 sm:gap-4">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">

                                            <Sparkles
                                                size={16}
                                            />

                                        </div>


                                        <div className="rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3.5 shadow-sm">

                                            <div className="flex items-center gap-1.5">

                                                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />

                                                <span
                                                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                                    style={{
                                                        animationDelay:
                                                            "120ms",
                                                    }}
                                                />

                                                <span
                                                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                                    style={{
                                                        animationDelay:
                                                            "240ms",
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* ==================================
                        INPUT
                    ================================== */}

                    <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6">

                        <div className="mx-auto max-w-4xl">

                            <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm transition focus-within:border-gray-400 focus-within:bg-white focus-within:shadow-md">

                                <textarea
                                    value={input}
                                    onChange={(event) =>
                                        setInput(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    disabled={loading}
                                    rows={1}
                                    placeholder="Ask NovaCart AI anything..."
                                    className="max-h-32 min-h-[48px] w-full resize-none bg-transparent px-3 py-3 pr-14 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSend()
                                    }
                                    disabled={
                                        !input.trim() ||
                                        loading
                                    }
                                    className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                                >

                                    {loading ? (

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Send size={17} />

                                    )}

                                </button>

                            </div>


                            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-gray-400">

                                <Sparkles size={10} />

                                NovaCart AI can help you discover products faster.

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );

};


export default AIChat;