import { useEffect, useState } from "react";

import {
    Plus,
    Search,
    Tag,
    Pencil,
    Trash2,
    Power,
    X,
    RefreshCw,
    CalendarDays,
    Users,
    IndianRupee,
    Percent,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAdminCoupons,
    createAdminCoupon,
    updateAdminCoupon,
    deleteAdminCoupon,
} from "../../services/adminApi";


// ======================================
// EMPTY FORM
// ======================================

const EMPTY_FORM = {
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "",
};


// ======================================
// ADMIN COUPONS
// ======================================

const AdminCoupons = () => {

    // ======================================
    // STATES
    // ======================================

    const [coupons, setCoupons] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [typeFilter, setTypeFilter] =
        useState("all");

    const [showModal, setShowModal] =
        useState(false);

    const [editingCoupon, setEditingCoupon] =
        useState(null);

    const [form, setForm] =
        useState(EMPTY_FORM);

    const [submitting, setSubmitting] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(null);


    // ======================================
    // LOAD COUPONS
    // ======================================

    const loadCoupons = async () => {

        try {

            setLoading(true);

            const response =
                await getAdminCoupons();

            const data =
                response.data?.data;

            if (Array.isArray(data)) {

                setCoupons(data);

            } else {

                setCoupons([]);

            }

        } catch (error) {

            console.error(
                "ADMIN COUPONS ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load coupons"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // INITIAL LOAD
    // ======================================

    useEffect(() => {

        let mounted = true;

        const fetchCoupons = async () => {

            try {

                setLoading(true);

                const response =
                    await getAdminCoupons();

                const data =
                    response.data?.data;

                if (mounted) {

                    if (Array.isArray(data)) {
                        setCoupons(data);
                    } else {
                        setCoupons([]);
                    }

                }

            } catch (error) {

                console.error(
                    "ADMIN COUPONS ERROR:",
                    error
                );

                if (mounted) {

                    toast.error(
                        error.response?.data?.message ||
                        "Failed to load coupons"
                    );

                }

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        };

        fetchCoupons();

        return () => {
            mounted = false;
        };

    }, []);


    // ======================================
    // FILTER COUPONS
    // ======================================

    const filteredCoupons = coupons.filter(
        (coupon) => {

            const searchText =
                search.toLowerCase().trim();

            const couponCode =
                coupon.code
                    ?.toLowerCase()
                    || "";

            const matchesSearch =
                !searchText ||
                couponCode.includes(searchText);

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                        ? coupon.isActive
                        : !coupon.isActive;

            const matchesType =
                typeFilter === "all"
                    ? true
                    : coupon.discountType === typeFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType
            );

        }
    );


    // ======================================
    // INPUT CHANGE
    // ======================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm((prevForm) => {

            return {
                ...prevForm,
                [name]: value,
            };

        });

    };


    // ======================================
    // OPEN CREATE MODAL
    // ======================================

    const handleCreate = () => {

        setEditingCoupon(null);

        setForm({
            ...EMPTY_FORM,
        });

        setShowModal(true);

    };


    // ======================================
    // OPEN EDIT MODAL
    // ======================================

    const handleEdit = (coupon) => {

        setEditingCoupon(coupon);

        let expiryValue = "";

        if (coupon.expiryDate) {

            const date =
                new Date(coupon.expiryDate);

            if (!Number.isNaN(date.getTime())) {

                expiryValue =
                    date.toISOString().split("T")[0];

            }

        }

        setForm({

            code:
                coupon.code || "",

            discountType:
                coupon.discountType || "percentage",

            discountValue:
                coupon.discountValue ?? "",

            minOrderAmount:
                coupon.minOrderAmount ?? "",

            maxDiscount:
                coupon.maxDiscount ?? "",

            expiryDate:
                expiryValue,

            usageLimit:
                coupon.usageLimit ?? "",

        });

        setShowModal(true);

    };


    // ======================================
    // CLOSE MODAL
    // ======================================

    const handleCloseModal = () => {

        if (submitting) {
            return;
        }

        setShowModal(false);

        setEditingCoupon(null);

        setForm({
            ...EMPTY_FORM,
        });

    };


    // ======================================
    // VALIDATION
    // ======================================

    const validateForm = () => {

        const code =
            form.code.trim();

        const discountValue =
            Number(form.discountValue);

        const minOrderAmount =
            form.minOrderAmount === ""
                ? 0
                : Number(form.minOrderAmount);

        const maxDiscount =
            form.maxDiscount === ""
                ? 0
                : Number(form.maxDiscount);

        const usageLimit =
            form.usageLimit === ""
                ? 0
                : Number(form.usageLimit);


        if (!editingCoupon && !code) {

            toast.error(
                "Coupon code is required"
            );

            return false;

        }


        if (!form.discountType) {

            toast.error(
                "Discount type is required"
            );

            return false;

        }


        if (
            !form.discountValue ||
            Number.isNaN(discountValue) ||
            discountValue <= 0
        ) {

            toast.error(
                "Enter a valid discount value"
            );

            return false;

        }


        if (
            form.discountType === "percentage" &&
            discountValue > 100
        ) {

            toast.error(
                "Percentage cannot exceed 100"
            );

            return false;

        }


        if (
            Number.isNaN(minOrderAmount) ||
            minOrderAmount < 0
        ) {

            toast.error(
                "Enter a valid minimum order amount"
            );

            return false;

        }


        if (
            Number.isNaN(maxDiscount) ||
            maxDiscount < 0
        ) {

            toast.error(
                "Enter a valid maximum discount"
            );

            return false;

        }


        if (!form.expiryDate) {

            toast.error(
                "Expiry date is required"
            );

            return false;

        }


        const expiry =
            new Date(form.expiryDate);

        if (
            Number.isNaN(expiry.getTime()) ||
            expiry <= new Date()
        ) {

            toast.error(
                "Expiry date must be in the future"
            );

            return false;

        }


        if (
            Number.isNaN(usageLimit) ||
            usageLimit < 0
        ) {

            toast.error(
                "Enter a valid usage limit"
            );

            return false;

        }


        return true;

    };


    // ======================================
    // SUBMIT COUPON
    // ======================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }


        try {

            setSubmitting(true);


            const payload = {

                discountType:
                    form.discountType,

                discountValue:
                    Number(form.discountValue),

                minOrderAmount:
                    form.minOrderAmount === ""
                        ? 0
                        : Number(form.minOrderAmount),

                maxDiscount:
                    form.maxDiscount === ""
                        ? 0
                        : Number(form.maxDiscount),

                expiryDate:
                    form.expiryDate,

                usageLimit:
                    form.usageLimit === ""
                        ? 0
                        : Number(form.usageLimit),

            };


            // ======================================
            // UPDATE
            // ======================================

            if (editingCoupon) {

                await updateAdminCoupon(
                    editingCoupon._id,
                    payload
                );

                toast.success(
                    "Coupon updated successfully"
                );

            }


            // ======================================
            // CREATE
            // ======================================

            else {

                await createAdminCoupon({

                    code:
                        form.code
                            .trim()
                            .toUpperCase(),

                    ...payload,

                });

                toast.success(
                    "Coupon created successfully"
                );

            }


            setShowModal(false);

            setEditingCoupon(null);

            setForm({
                ...EMPTY_FORM,
            });

            await loadCoupons();

        } catch (error) {

            console.error(
                "COUPON SAVE ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to save coupon"
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ======================================
    // DELETE COUPON
    // ======================================

    const handleDelete = async (coupon) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${coupon.code}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(coupon._id);

            await deleteAdminCoupon(
                coupon._id
            );

            toast.success(
                "Coupon deleted successfully"
            );

            await loadCoupons();

        } catch (error) {

            console.error(
                "DELETE COUPON ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete coupon"
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ======================================
    // TOGGLE COUPON
    // ======================================

    const handleToggle = async (coupon) => {

        const action =
            coupon.isActive
                ? "deactivate"
                : "activate";


        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} ${coupon.code}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(coupon._id);


            /*
             * Your current adminApi/backend
             * should expose this endpoint.
             *
             * If you haven't added it to adminApi yet,
             * code is given below.
             */

            const { toggleAdminCoupon } =
                await import(
                    "../../services/adminApi"
                );

            await toggleAdminCoupon(
                coupon._id
            );


            toast.success(
                coupon.isActive
                    ? "Coupon deactivated successfully"
                    : "Coupon activated successfully"
            );


            await loadCoupons();

        } catch (error) {

            console.error(
                "TOGGLE COUPON ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update coupon status"
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ======================================
    // FORMAT DATE
    // ======================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // ======================================
    // CHECK EXPIRED
    // ======================================

    const isExpired = (coupon) => {

        if (!coupon.expiryDate) {
            return false;
        }

        return (
            new Date(coupon.expiryDate) <
            new Date()
        );

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading coupons...
                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

            <div className="mx-auto max-w-7xl">


                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div>

                        <p className="text-sm font-medium text-gray-500">
                            NovaCart AI
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-gray-900">
                            Coupons
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Create and manage discount coupons.
                        </p>

                    </div>


                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={loadCoupons}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                        >

                            <RefreshCw
                                size={17}
                            />

                            Refresh

                        </button>


                        <button
                            type="button"
                            onClick={handleCreate}
                            className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >

                            <Plus
                                size={18}
                            />

                            Create Coupon

                        </button>

                    </div>

                </div>


                {/* ======================================
                    STATS
                ====================================== */}

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-gray-100 p-3">

                                <Tag size={20} />

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Total Coupons
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {coupons.length}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-green-50 p-3 text-green-600">

                                <Power size={20} />

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Active Coupons
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {
                                        coupons.filter(
                                            (coupon) =>
                                                coupon.isActive
                                        ).length
                                    }
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-red-50 p-3 text-red-600">

                                <CalendarDays size={20} />

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Expired
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {
                                        coupons.filter(
                                            (coupon) =>
                                                isExpired(coupon)
                                        ).length
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    FILTERS
                ====================================== */}

                <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={19}
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
                            placeholder="Search coupon code..."
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    >

                        <option value="all">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                    </select>


                    <select
                        value={typeFilter}
                        onChange={(e) =>
                            setTypeFilter(
                                e.target.value
                            )
                        }
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    >

                        <option value="all">
                            All Discount Types
                        </option>

                        <option value="percentage">
                            Percentage
                        </option>

                        <option value="fixed">
                            Fixed
                        </option>

                    </select>

                </div>


                {/* ======================================
                    COUNT
                ====================================== */}

                <div className="mt-5">

                    <p className="text-sm text-gray-500">

                        Showing{" "}

                        <span className="font-semibold text-gray-900">
                            {filteredCoupons.length}
                        </span>{" "}

                        coupons

                    </p>

                </div>


                {/* ======================================
                    DESKTOP TABLE
                ====================================== */}

                <div className="mt-4 hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-250">

                            <thead>

                                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">

                                    <th className="px-6 py-4">
                                        Coupon
                                    </th>

                                    <th className="px-6 py-4">
                                        Discount
                                    </th>

                                    <th className="px-6 py-4">
                                        Minimum Order
                                    </th>

                                    <th className="px-6 py-4">
                                        Usage
                                    </th>

                                    <th className="px-6 py-4">
                                        Expiry
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredCoupons.map(
                                    (coupon) => (

                                        <tr
                                            key={coupon._id}
                                            className="border-b border-gray-100 last:border-0"
                                        >

                                            {/* COUPON */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-3">

                                                    <div className="rounded-xl bg-gray-100 p-3">

                                                        <Tag size={18} />

                                                    </div>

                                                    <div>

                                                        <p className="font-bold tracking-wide">
                                                            {coupon.code}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            Created{" "}
                                                            {formatDate(
                                                                coupon.createdAt
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* DISCOUNT */}

                                            <td className="px-6 py-5">

                                                <div className="font-semibold">

                                                    {coupon.discountType ===
                                                    "percentage"
                                                        ? `${coupon.discountValue}%`
                                                        : `₹${coupon.discountValue}`}

                                                </div>

                                                {coupon.maxDiscount >
                                                    0 &&
                                                    coupon.discountType ===
                                                        "percentage" && (

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Max ₹
                                                            {
                                                                coupon.maxDiscount
                                                            }
                                                        </p>

                                                    )}

                                            </td>


                                            {/* MINIMUM */}

                                            <td className="px-6 py-5 text-sm">

                                                ₹
                                                {Number(
                                                    coupon.minOrderAmount || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </td>


                                            {/* USAGE */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2 text-sm">

                                                    <Users
                                                        size={15}
                                                        className="text-gray-400"
                                                    />

                                                    <span>

                                                        {coupon.usedCount || 0}

                                                        {" / "}

                                                        {coupon.usageLimit >
                                                        0
                                                            ? coupon.usageLimit
                                                            : "∞"}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* EXPIRY */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2 text-sm">

                                                    <CalendarDays
                                                        size={15}
                                                        className="text-gray-400"
                                                    />

                                                    <span
                                                        className={
                                                            isExpired(
                                                                coupon
                                                            )
                                                                ? "text-red-500"
                                                                : "text-gray-600"
                                                        }
                                                    >
                                                        {formatDate(
                                                            coupon.expiryDate
                                                        )}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-6 py-5">

                                                <span
                                                    className={
                                                        coupon.isActive
                                                            ? "rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600"
                                                            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"
                                                    }
                                                >

                                                    {coupon.isActive
                                                        ? "Active"
                                                        : "Inactive"}

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-6 py-5">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                coupon
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            coupon._id
                                                        }
                                                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                                                        title="Edit coupon"
                                                    >

                                                        <Pencil
                                                            size={16}
                                                        />

                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggle(
                                                                coupon
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            coupon._id
                                                        }
                                                        className={
                                                            coupon.isActive
                                                                ? "rounded-lg border border-orange-100 p-2 text-orange-500 transition hover:bg-orange-50 disabled:opacity-50"
                                                                : "rounded-lg border border-green-100 p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                                                        }
                                                        title={
                                                            coupon.isActive
                                                                ? "Deactivate"
                                                                : "Activate"
                                                        }
                                                    >

                                                        <Power
                                                            size={16}
                                                        />

                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                coupon
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            coupon._id
                                                        }
                                                        className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                                        title="Delete coupon"
                                                    >

                                                        <Trash2
                                                            size={16}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* ======================================
                    MOBILE CARDS
                ====================================== */}

                <div className="mt-4 space-y-4 md:hidden">

                    {filteredCoupons.map(
                        (coupon) => (

                            <div
                                key={coupon._id}
                                className="rounded-2xl bg-white p-5 shadow-sm"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-xl bg-gray-100 p-3">

                                            <Tag size={18} />

                                        </div>

                                        <div>

                                            <p className="font-bold">
                                                {coupon.code}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {formatDate(
                                                    coupon.createdAt
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className={
                                            coupon.isActive
                                                ? "rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600"
                                                : "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"
                                        }
                                    >

                                        {coupon.isActive
                                            ? "Active"
                                            : "Inactive"}

                                    </span>

                                </div>


                                <div className="mt-5 grid grid-cols-2 gap-3">

                                    <div className="rounded-xl bg-gray-50 p-3">

                                        <p className="text-xs text-gray-500">
                                            Discount
                                        </p>

                                        <p className="mt-1 font-bold">

                                            {coupon.discountType ===
                                            "percentage"
                                                ? `${coupon.discountValue}%`
                                                : `₹${coupon.discountValue}`}

                                        </p>

                                    </div>


                                    <div className="rounded-xl bg-gray-50 p-3">

                                        <p className="text-xs text-gray-500">
                                            Min Order
                                        </p>

                                        <p className="mt-1 font-bold">
                                            ₹
                                            {Number(
                                                coupon.minOrderAmount || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                    </div>


                                    <div className="rounded-xl bg-gray-50 p-3">

                                        <p className="text-xs text-gray-500">
                                            Usage
                                        </p>

                                        <p className="mt-1 font-bold">

                                            {coupon.usedCount || 0}

                                            {" / "}

                                            {coupon.usageLimit >
                                            0
                                                ? coupon.usageLimit
                                                : "∞"}

                                        </p>

                                    </div>


                                    <div className="rounded-xl bg-gray-50 p-3">

                                        <p className="text-xs text-gray-500">
                                            Expiry
                                        </p>

                                        <p
                                            className={
                                                isExpired(
                                                    coupon
                                                )
                                                    ? "mt-1 font-bold text-red-500"
                                                    : "mt-1 font-bold"
                                            }
                                        >
                                            {formatDate(
                                                coupon.expiryDate
                                            )}
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-5 flex gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(
                                                coupon
                                            )
                                        }
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold"
                                    >

                                        <Pencil size={16} />

                                        Edit

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleToggle(
                                                coupon
                                            )
                                        }
                                        className="rounded-xl border border-gray-200 px-4 py-3"
                                    >

                                        <Power
                                            size={16}
                                        />

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                coupon
                                            )
                                        }
                                        className="rounded-xl border border-red-100 px-4 py-3 text-red-500"
                                    >

                                        <Trash2
                                            size={16}
                                        />

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {/* ======================================
                    EMPTY STATE
                ====================================== */}

                {filteredCoupons.length === 0 && (

                    <div className="mt-4 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">

                        <Tag
                            size={42}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-4 text-lg font-semibold">
                            No coupons found
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Try changing your filters or create a new coupon.
                        </p>


                        <button
                            type="button"
                            onClick={handleCreate}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
                        >

                            <Plus size={17} />

                            Create Coupon

                        </button>

                    </div>

                )}


            </div>


            {/* ======================================
                CREATE / EDIT MODAL
            ====================================== */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">


                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold">
                                    {editingCoupon
                                        ? "Edit Coupon"
                                        : "Create Coupon"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editingCoupon
                                        ? "Update coupon discount and limits."
                                        : "Create a new discount coupon."}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleCloseModal
                                }
                                disabled={
                                    submitting
                                }
                                className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="p-6"
                        >

                            {/* CODE */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold">
                                    Coupon Code *
                                </label>

                                <input
                                    type="text"
                                    name="code"
                                    value={
                                        form.code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        submitting ||
                                        Boolean(
                                            editingCoupon
                                        )
                                    }
                                    placeholder="e.g. SAVE20"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 uppercase outline-none focus:border-black disabled:bg-gray-100"
                                />

                                {editingCoupon && (

                                    <p className="mt-2 text-xs text-gray-500">
                                        Coupon code cannot be changed while editing.
                                    </p>

                                )}

                            </div>


                            {/* DISCOUNT TYPE */}

                            <div className="mt-5">

                                <label className="mb-2 block text-sm font-semibold">
                                    Discount Type *
                                </label>

                                <div className="grid grid-cols-2 gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm(
                                                (prevForm) => {

                                                    return {
                                                        ...prevForm,
                                                        discountType:
                                                            "percentage",
                                                    };

                                                }
                                            )
                                        }
                                        disabled={
                                            submitting
                                        }
                                        className={
                                            form.discountType ===
                                            "percentage"
                                                ? "flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-black px-4 py-3 text-sm font-semibold text-white"
                                                : "flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600"
                                        }
                                    >

                                        <Percent
                                            size={17}
                                        />

                                        Percentage

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm(
                                                (prevForm) => {

                                                    return {
                                                        ...prevForm,
                                                        discountType:
                                                            "fixed",
                                                    };

                                                }
                                            )
                                        }
                                        disabled={
                                            submitting
                                        }
                                        className={
                                            form.discountType ===
                                            "fixed"
                                                ? "flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-black px-4 py-3 text-sm font-semibold text-white"
                                                : "flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600"
                                        }
                                    >

                                        <IndianRupee
                                            size={17}
                                        />

                                        Fixed Amount

                                    </button>

                                </div>

                            </div>


                            {/* DISCOUNT VALUE */}

                            <div className="mt-5">

                                <label className="mb-2 block text-sm font-semibold">
                                    Discount Value *
                                </label>

                                <div className="relative">

                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={
                                            form.discountValue
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            submitting
                                        }
                                        min="0"
                                        step="0.01"
                                        placeholder={
                                            form.discountType ===
                                            "percentage"
                                                ? "20"
                                                : "500"
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-black"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">

                                        {form.discountType ===
                                        "percentage"
                                            ? "%"
                                            : "₹"}

                                    </span>

                                </div>

                            </div>


                            {/* MIN + MAX */}

                            <div className="mt-5 grid gap-5 md:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Minimum Order
                                    </label>

                                    <input
                                        type="number"
                                        name="minOrderAmount"
                                        value={
                                            form.minOrderAmount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            submitting
                                        }
                                        min="0"
                                        placeholder="1000"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Maximum Discount
                                    </label>

                                    <input
                                        type="number"
                                        name="maxDiscount"
                                        value={
                                            form.maxDiscount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            submitting
                                        }
                                        min="0"
                                        placeholder="500"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    />

                                    <p className="mt-1 text-xs text-gray-400">
                                        Mainly useful for percentage coupons.
                                    </p>

                                </div>

                            </div>


                            {/* EXPIRY + USAGE */}

                            <div className="mt-5 grid gap-5 md:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Expiry Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={
                                            form.expiryDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            submitting
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Usage Limit
                                    </label>

                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={
                                            form.usageLimit
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            submitting
                                        }
                                        min="0"
                                        placeholder="0 = Unlimited"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    />

                                    <p className="mt-1 text-xs text-gray-400">
                                        Enter 0 for unlimited usage.
                                    </p>

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseModal
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {submitting
                                        ? "Saving..."
                                        : editingCoupon
                                            ? "Update Coupon"
                                            : "Create Coupon"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

};

export default AdminCoupons;