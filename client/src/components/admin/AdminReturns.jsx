import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    RefreshCw,
    Search,
    RotateCcw,
    CheckCircle,
    Clock,
    PackageCheck,
    CreditCard,
    ArrowRightLeft,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAdminReturns,
    updateReturnStatus,
} from "../../services/returnApi";


const STATUS_STYLES = {
    Requested:
        "bg-yellow-100 text-yellow-700",

    Accepted:
        "bg-blue-100 text-blue-700",

    Returned:
        "bg-purple-100 text-purple-700",

    "Refund Initiated":
        "bg-indigo-100 text-indigo-700",

    "Refund Completed":
        "bg-green-100 text-green-700",

    Exchanged:
        "bg-green-100 text-green-700",

    Rejected:
        "bg-red-100 text-red-700",
};


const AdminReturns = () => {

    const [returns, setReturns] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState("all");

    const [selected, setSelected] =
        useState(null);

    const [actionLoading, setActionLoading] =
        useState(false);


    // ==========================================
    // LOAD RETURNS
    // ==========================================

    const loadReturns = useCallback(
        async () => {

            try {

                setLoading(true);

                const response =
                    await getAdminReturns();

                const data =
                    response?.data?.data;

                setReturns(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "ADMIN RETURNS ERROR:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load return requests"
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        const timer = setTimeout(() => {
            loadReturns();
        }, 0);

        return () => {
            clearTimeout(timer);
        };

    }, [loadReturns]);


    // ==========================================
    // FILTER RETURNS
    // ==========================================

    const filteredReturns =
        useMemo(() => {

            const query =
                search
                    .toLowerCase()
                    .trim();

            return returns.filter(
                (item) => {

                    const orderId =
                        item?.orderId
                            ?.toLowerCase() ||
                        "";

                    const name =
                        item?.user?.name
                            ?.toLowerCase() ||
                        "";

                    const email =
                        item?.user?.email
                            ?.toLowerCase() ||
                        "";

                    const matchesSearch =
                        !query ||
                        orderId.includes(query) ||
                        name.includes(query) ||
                        email.includes(query);

                    const matchesFilter =
                        filter === "all" ||
                        item.returnStatus === filter;

                    return (
                        matchesSearch &&
                        matchesFilter
                    );

                }
            );

        }, [
            returns,
            search,
            filter,
        ]);


    // ==========================================
    // STATS
    // ==========================================

    const stats = useMemo(() => {

        return {

            requested:
                returns.filter(
                    (item) =>
                        item.returnStatus ===
                        "Requested"
                ).length,

            accepted:
                returns.filter(
                    (item) =>
                        item.returnStatus ===
                        "Accepted"
                ).length,

            refund:
                returns.filter(
                    (item) =>
                        item.returnStatus ===
                        "Refund Initiated"
                ).length,

            completed:
                returns.filter(
                    (item) =>
                        item.returnStatus ===
                            "Refund Completed" ||
                        item.returnStatus ===
                            "Exchanged"
                ).length,

        };

    }, [returns]);


    // ==========================================
    // UPDATE RETURN STATUS
    // ==========================================

    const handleStatusChange =
        async (returnId, status) => {

            try {

                setActionLoading(true);

                const response =
                    await updateReturnStatus(
                        returnId,
                        status
                    );

                const updated =
                    response?.data?.data;


                if (updated) {

                    // Update table
                    setReturns((current) =>
                        current.map((item) =>
                            item._id === returnId
                                ? {
                                      ...item,
                                      ...updated,
                                  }
                                : item
                        )
                    );


                    // Update opened modal
                    setSelected((current) =>
                        current?._id === returnId
                            ? {
                                  ...current,
                                  ...updated,
                              }
                            : current
                    );

                }


                toast.success(
                    `Return marked as ${status}`
                );

            } catch (error) {

                console.error(
                    "UPDATE RETURN STATUS ERROR:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update return"
                );

            } finally {

                setActionLoading(false);

            }

        };


    // ==========================================
    // ACTION BUTTONS
    // ==========================================

    const renderActions = (item) => {

        // REQUESTED
        if (
            item.returnStatus ===
            "Requested"
        ) {

            return (
                <div className="flex gap-2">

                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                            handleStatusChange(
                                item._id,
                                "Accepted"
                            )
                        }
                        className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Accept
                    </button>


                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                            handleStatusChange(
                                item._id,
                                "Rejected"
                            )
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reject
                    </button>

                </div>
            );

        }


        // ACCEPTED
        if (
            item.returnStatus ===
            "Accepted"
        ) {

            return (
                <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                        handleStatusChange(
                            item._id,
                            "Returned"
                        )
                    }
                    className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Mark Returned
                </button>
            );

        }


        // RETURNED
        if (
            item.returnStatus ===
            "Returned"
        ) {

            // EXCHANGE
            if (
                item.returnType ===
                "Exchange"
            ) {

                return (
                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                            handleStatusChange(
                                item._id,
                                "Exchanged"
                            )
                        }
                        className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Mark Exchanged
                    </button>
                );

            }


            // REFUND
            return (
                <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                        handleStatusChange(
                            item._id,
                            "Refund Initiated"
                        )
                    }
                    className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Initiate Refund
                </button>
            );

        }


        // REFUND INITIATED
        if (
            item.returnStatus ===
            "Refund Initiated"
        ) {

            return (
                <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                        handleStatusChange(
                            item._id,
                            "Refund Completed"
                        )
                    }
                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Complete Refund
                </button>
            );

        }


        return null;

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="flex min-h-[500px] items-center justify-center">

                <RefreshCw
                    size={28}
                    className="animate-spin"
                />

            </div>
        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="space-y-6">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-2xl font-bold">
                        Returns & Refunds
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage customer return and exchange requests.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={loadReturns}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* ==================================
                STATS
            ================================== */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <Stat
                    title="Requests"
                    value={stats.requested}
                    icon={Clock}
                />

                <Stat
                    title="Accepted"
                    value={stats.accepted}
                    icon={CheckCircle}
                />

                <Stat
                    title="Refund Initiated"
                    value={stats.refund}
                    icon={CreditCard}
                />

                <Stat
                    title="Completed"
                    value={stats.completed}
                    icon={PackageCheck}
                />

            </div>


            {/* ==================================
                SEARCH + FILTER
            ================================== */}

            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row">

                <div className="relative flex-1">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search order, customer..."
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                    />

                </div>


                <select
                    value={filter}
                    onChange={(e) =>
                        setFilter(
                            e.target.value
                        )
                    }
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                >

                    <option value="all">
                        All Status
                    </option>

                    <option value="Requested">
                        Requested
                    </option>

                    <option value="Accepted">
                        Accepted
                    </option>

                    <option value="Returned">
                        Returned
                    </option>

                    <option value="Refund Initiated">
                        Refund Initiated
                    </option>

                    <option value="Refund Completed">
                        Refund Completed
                    </option>

                    <option value="Exchanged">
                        Exchanged
                    </option>

                    <option value="Rejected">
                        Rejected
                    </option>

                </select>

            </div>


            {/* ==================================
                TABLE
            ================================== */}

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px] text-left">

                        <thead className="border-b border-gray-100 bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Order
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Customer
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Type
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Amount
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {filteredReturns.map(
                                (item) => (

                                    <tr
                                        key={item._id}
                                        className="transition hover:bg-gray-50"
                                    >

                                        {/* ORDER */}

                                        <td className="px-5 py-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelected(
                                                        item
                                                    )
                                                }
                                                className="font-semibold hover:underline"
                                            >
                                                {item.orderId}
                                            </button>

                                            <p className="mt-1 max-w-[220px] truncate text-xs text-gray-400">
                                                {
                                                    item.returnReason
                                                }
                                            </p>

                                        </td>


                                        {/* CUSTOMER */}

                                        <td className="px-5 py-4">

                                            <p className="font-medium">
                                                {
                                                    item.user
                                                        ?.name ||
                                                    "Unknown"
                                                }
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {
                                                    item.user
                                                        ?.email ||
                                                    "—"
                                                }
                                            </p>

                                        </td>


                                        {/* TYPE */}

                                        <td className="px-5 py-4">

                                            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">

                                                {item.returnType ===
                                                "Exchange" ? (
                                                    <ArrowRightLeft
                                                        size={13}
                                                    />
                                                ) : (
                                                    <RotateCcw
                                                        size={13}
                                                    />
                                                )}

                                                {
                                                    item.returnType ||
                                                    "Return"
                                                }

                                            </span>

                                        </td>


                                        {/* AMOUNT */}

                                        <td className="px-5 py-4 font-semibold">

                                            {item.refundAmount >
                                            0
                                                ? `₹${Number(
                                                      item.refundAmount
                                                  ).toLocaleString(
                                                      "en-IN"
                                                  )}`
                                                : "—"}

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-5 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    STATUS_STYLES[
                                                        item.returnStatus
                                                    ] ||
                                                    "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {
                                                    item.returnStatus
                                                }
                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td className="px-5 py-4">

                                            {renderActions(
                                                item
                                            )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>


                {/* EMPTY */}

                {filteredReturns.length ===
                    0 && (

                    <div className="p-12 text-center">

                        <RotateCcw
                            size={40}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-4 font-semibold">
                            No return requests
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Return and exchange requests will appear here.
                        </p>

                    </div>

                )}

            </div>


            {/* ==================================
                DETAILS MODAL
            ================================== */}

            {selected && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() =>
                        setSelected(null)
                    }
                >

                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm text-gray-400">
                                    Return Request
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    {
                                        selected.orderId
                                    }
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelected(null)
                                }
                                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
                            >
                                ✕
                            </button>

                        </div>


                        {/* INFORMATION */}

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">

                            <Info
                                label="Customer"
                                value={
                                    selected.user
                                        ?.name
                                }
                            />

                            <Info
                                label="Email"
                                value={
                                    selected.user
                                        ?.email
                                }
                            />

                            <Info
                                label="Type"
                                value={
                                    selected.returnType
                                }
                            />

                            <Info
                                label="Reason"
                                value={
                                    selected.returnReason
                                }
                            />

                            <Info
                                label="Refund Amount"
                                value={
                                    selected.refundAmount
                                        ? `₹${Number(
                                              selected.refundAmount
                                          ).toLocaleString(
                                              "en-IN"
                                          )}`
                                        : "N/A"
                                }
                            />

                            <Info
                                label="Current Status"
                                value={
                                    selected.returnStatus
                                }
                            />

                        </div>


                        {/* DESCRIPTION */}

                        {selected.returnDescription && (

                            <div className="mt-5 rounded-xl bg-gray-50 p-4">

                                <p className="text-xs font-semibold uppercase text-gray-400">
                                    Customer Description
                                </p>

                                <p className="mt-2 text-sm leading-6 text-gray-700">
                                    {
                                        selected.returnDescription
                                    }
                                </p>

                            </div>

                        )}


                        {/* ACTION */}

                        <div className="mt-6">

                            <p className="mb-3 text-sm font-semibold">
                                Available Action
                            </p>

                            {renderActions(
                                selected
                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


// ==========================================
// STAT COMPONENT
// ==========================================

const Stat = ({
    title,
    value,
    icon: Icon,
}) => (

    <div className="rounded-2xl bg-white p-5 shadow-sm">

        <div className="flex items-center justify-between">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <Icon
                size={20}
                className="text-gray-400"
            />

        </div>

        <p className="mt-3 text-2xl font-bold">
            {value}
        </p>

    </div>

);


// ==========================================
// INFO COMPONENT
// ==========================================

const Info = ({
    label,
    value,
}) => (

    <div className="rounded-xl bg-gray-50 p-4">

        <p className="text-xs font-semibold uppercase text-gray-400">
            {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-gray-800">
            {value || "—"}
        </p>

    </div>

);


export default AdminReturns;