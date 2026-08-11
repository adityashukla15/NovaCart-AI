import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    MapPin,
    Plus,
    CheckCircle,
    ShoppingBag,
    Tag,
    Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAddresses,
    addAddress,
    setDefaultAddress,
    deleteAddress,
} from "../services/adressApi";

import {
    createOrder,
    applyCoupon,
} from "../services/orderApi";

import { getCart } from "../services/cartApi";

const Checkout = () => {

    const navigate = useNavigate();

    // ======================================
    // STATES
    // ======================================

    const [addresses, setAddresses] = useState([]);

    const [cart, setCart] = useState(null);

    const [loading, setLoading] = useState(true);

    const [placingOrder, setPlacingOrder] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [error, setError] = useState("");

    // ======================================
    // COUPON
    // ======================================

    const [couponCode, setCouponCode] = useState("");

    const [couponLoading, setCouponLoading] = useState(false);

    const [couponApplied, setCouponApplied] = useState(false);

    const [couponData, setCouponData] = useState(null);

    // ======================================
    // ADDRESS FORM
    // ======================================

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: true,
    });


    // ======================================
    // FETCH CHECKOUT DATA
    // ======================================

    useEffect(() => {

        let cancelled = false;

        const loadCheckoutData = async () => {

            try {

                setLoading(true);

                setError("");

                const [addressResponse, cartResponse] =
                    await Promise.all([
                        getAddresses(),
                        getCart(),
                    ]);

                const addressData =
                    addressResponse.data?.data || [];

                const cartData =
                    cartResponse.data?.data || {};

                if (!cancelled) {

                    setAddresses(addressData);

                    setCart(cartData);

                }

            } catch (error) {

                console.error(
                    "CHECKOUT FETCH ERROR:",
                    error
                );

                if (!cancelled) {

                    const message =
                        error.response?.data?.message ||
                        "Failed to load checkout";

                    setError(message);

                    toast.error(message);

                }

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };

        loadCheckoutData();

        return () => {

            cancelled = true;

        };

    }, []);


    // ======================================
    // HANDLE INPUT CHANGE
    // ======================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };


    // ======================================
    // ADD ADDRESS
    // ======================================

    const handleAddAddress = async (e) => {

        e.preventDefault();

        try {

            setError("");

            const response =
                await addAddress(formData);

            const newAddress =
                response.data?.data;

            if (!newAddress) {

                throw new Error(
                    "Address was not created"
                );

            }

            setAddresses((prev) => {

                if (newAddress.isDefault) {

                    return [

                        newAddress,

                        ...prev.map(
                            (address) => ({

                                ...address,

                                isDefault: false,

                            })
                        ),

                    ];

                }

                return [

                    ...prev,

                    newAddress,

                ];

            });

            setShowForm(false);

            setFormData({

                fullName: "",
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                postalCode: "",
                country: "India",
                isDefault: false,

            });

            toast.success(
                "Address added successfully! 🎉"
            );

        } catch (error) {

            console.error(
                "ADD ADDRESS ERROR:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to add address";

            setError(message);

            toast.error(message);

        }

    };


    // ======================================
    // SET DEFAULT ADDRESS
    // ======================================

    const handleSetDefault = async (id) => {

        try {

            setError("");

            await setDefaultAddress(id);

            setAddresses((prev) =>
                prev.map((address) => ({

                    ...address,

                    isDefault:
                        address._id === id,

                }))
            );

            toast.success(
                "Default address updated! ✅"
            );

        } catch (error) {

            console.error(
                "DEFAULT ADDRESS ERROR:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to set default address";

            setError(message);

            toast.error(message);

        }

    };


    // ======================================
    // DELETE ADDRESS
    // ======================================

    const handleDeleteAddress = async (id) => {

        try {

            setError("");

            await deleteAddress(id);

            /*
                Refetch addresses after delete
                because backend may automatically
                make another address default.
            */

            const response =
                await getAddresses();

            const data =
                response.data?.data || [];

            setAddresses(data);

            toast.success(
                "Address deleted successfully! 🗑️"
            );

        } catch (error) {

            console.error(
                "DELETE ADDRESS ERROR:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to delete address";

            setError(message);

            toast.error(message);

        }

    };


    // ======================================
    // APPLY COUPON
    // ======================================

    const handleApplyCoupon = async () => {

        const code =
            couponCode.trim();

        if (!code) {

            toast.error(
                "Please enter a coupon code"
            );

            return;

        }

        /*
            Make sure cart exists
        */

        if (!cart) {

            toast.error(
                "Cart information is not available"
            );

            return;

        }

        const subtotal =
            Number(cart.subtotal || 0);

        if (subtotal <= 0) {

            toast.error(
                "Cart total must be greater than ₹0"
            );

            return;

        }

        try {

            setCouponLoading(true);

            setError("");

            /*
                IMPORTANT:
                Backend expects:

                {
                    code,
                    cartTotal
                }
            */

            const response =
                await applyCoupon({

                    code,

                    cartTotal: subtotal,

                });

            console.log(
                "APPLY COUPON RESPONSE:",
                response.data
            );

            const data =
                response.data?.data;

            if (!data) {

                throw new Error(
                    "Invalid coupon response"
                );

            }

            setCouponData(data);

            setCouponApplied(true);

            toast.success(
                "Coupon applied successfully! 🎉"
            );

        } catch (error) {

            console.error(
                "COUPON ERROR:",
                error
            );

            console.error(
                "COUPON BACKEND RESPONSE:",
                error.response?.data
            );

            setCouponApplied(false);

            setCouponData(null);

            const message =
                error.response?.data?.message ||
                "Invalid coupon code";

            setError(message);

            toast.error(message);

        } finally {

            setCouponLoading(false);

        }

    };


    // ======================================
    // REMOVE COUPON
    // ======================================

    const handleRemoveCoupon = () => {

        setCouponCode("");

        setCouponApplied(false);

        setCouponData(null);

        setError("");

        toast.success(
            "Coupon removed"
        );

    };


    // ======================================
    // PLACE ORDER
    // ======================================

    const handlePlaceOrder = async () => {

        try {

            setError("");

            const defaultAddress =
                addresses.find(
                    (address) =>
                        address.isDefault
                );

            if (!defaultAddress) {

                toast.error(
                    "Please select a default address"
                );

                return;

            }

            /*
                IMPORTANT:
                Only send couponCode if coupon
                was successfully applied.
            */

            const orderData = {};

            if (
                couponApplied &&
                couponData &&
                couponCode.trim()
            ) {

                orderData.couponCode =
                    couponCode.trim();

            }

            setPlacingOrder(true);

            const response =
                await createOrder(orderData);

            console.log(
                "CREATE ORDER RESPONSE:",
                response.data
            );

            const order =
                response.data?.data;

            if (!order) {

                throw new Error(
                    "Order was not created"
                );

            }

            toast.success(
                "Order placed successfully! 🎉",
                {
                    duration: 3000,
                }
            );

            navigate(
                `/order-success/${order._id}`,
                {
                    state: {
                        order,
                    },
                }
            );

        } catch (error) {

            console.error(
                "PLACE ORDER ERROR:",
                error
            );

            console.error(
                "ORDER BACKEND RESPONSE:",
                error.response?.data
            );

            const message =
                error.response?.data?.message ||
                "Failed to place order";

            setError(message);

            toast.error(message);

        } finally {

            setPlacingOrder(false);

        }

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-lg text-gray-600">
                        Loading checkout...
                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // CART DATA
    // ======================================

    const subtotal =
        Number(cart?.subtotal || 0);

    const totalItems =
        Number(cart?.totalItems || 0);

    const discount =
        Number(couponData?.discount || 0);

    const finalAmount =
        Math.max(
            0,
            subtotal - discount
        );


    // ======================================
    // DEFAULT ADDRESS
    // ======================================

    const defaultAddress =
        addresses.find(
            (address) =>
                address.isDefault
        );


    // ======================================
    // EMPTY CART
    // ======================================

    if (subtotal <= 0 || totalItems <= 0) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

                <div className="text-center">

                    <ShoppingBag
                        size={60}
                        className="mx-auto text-gray-300"
                    />

                    <h1 className="mt-5 text-2xl font-bold">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Add some products before checking out.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/shop")
                        }
                        className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white"
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>

        );

    }


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold md:text-4xl">
                        Checkout
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Complete your order securely
                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">

                        {error}

                    </div>

                )}


                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">


                    {/* ==================================
                        LEFT SIDE
                    ================================== */}

                    <div className="space-y-6 lg:col-span-2">


                        {/* ==================================
                            SHIPPING ADDRESS
                        ================================== */}

                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <h2 className="flex items-center gap-2 text-xl font-semibold">

                                        <MapPin size={20} />

                                        Shipping Address

                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Choose where you want your order delivered
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowForm(
                                            !showForm
                                        )
                                    }
                                    className="flex w-fit items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                >

                                    <Plus size={17} />

                                    Add Address

                                </button>

                            </div>


                            {/* NO ADDRESS */}

                            {addresses.length === 0 &&
                                !showForm && (

                                    <div className="rounded-xl border border-dashed p-8 text-center">

                                        <MapPin
                                            className="mx-auto mb-3 text-gray-400"
                                            size={35}
                                        />

                                        <p className="text-gray-500">
                                            No address found
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowForm(
                                                    true
                                                )
                                            }
                                            className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
                                        >
                                            Add Address
                                        </button>

                                    </div>

                                )}


                            {/* ADDRESS LIST */}

                            <div className="space-y-4">

                                {addresses.map(
                                    (address) => (

                                        <div
                                            key={
                                                address._id
                                            }
                                            className={`rounded-xl border p-5 transition ${
                                                address.isDefault
                                                    ? "border-black bg-gray-50"
                                                    : "border-gray-200"
                                            }`}
                                        >

                                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                                                <div>

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <h3 className="font-semibold">
                                                            {
                                                                address.fullName
                                                            }
                                                        </h3>

                                                        {address.isDefault && (

                                                            <span className="flex items-center gap-1 rounded-full bg-black px-2 py-1 text-xs text-white">

                                                                <CheckCircle
                                                                    size={
                                                                        12
                                                                    }
                                                                />

                                                                Default

                                                            </span>

                                                        )}

                                                    </div>

                                                    <p className="mt-2 text-sm text-gray-600">
                                                        {
                                                            address.phone
                                                        }
                                                    </p>

                                                    <p className="mt-2 text-sm text-gray-600">
                                                        {
                                                            address.addressLine1
                                                        }
                                                    </p>

                                                    {address.addressLine2 && (

                                                        <p className="text-sm text-gray-600">
                                                            {
                                                                address.addressLine2
                                                            }
                                                        </p>

                                                    )}

                                                    <p className="text-sm text-gray-600">

                                                        {
                                                            address.city
                                                        }

                                                        ,{" "}

                                                        {
                                                            address.state
                                                        }

                                                        {" - "}

                                                        {
                                                            address.postalCode
                                                        }

                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        {
                                                            address.country
                                                        }
                                                    </p>

                                                </div>


                                                <div className="flex items-center gap-3">

                                                    {!address.isDefault && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSetDefault(
                                                                    address._id
                                                                )
                                                            }
                                                            className="text-sm font-medium underline"
                                                        >
                                                            Set Default
                                                        </button>

                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteAddress(
                                                                address._id
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                                                    >

                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>


                            {/* ADD ADDRESS FORM */}

                            {showForm && (

                                <form
                                    onSubmit={
                                        handleAddAddress
                                    }
                                    className="mt-6 rounded-xl border bg-gray-50 p-6"
                                >

                                    <h3 className="mb-5 text-lg font-semibold">
                                        Add New Address
                                    </h3>


                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={
                                                formData.fullName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Full Name"
                                            required
                                            className="w-full rounded-lg border bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Phone Number"
                                            required
                                            className="w-full rounded-lg border bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        />

                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={
                                                formData.addressLine1
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Address Line 1"
                                            required
                                            className="w-full rounded-lg border bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black md:col-span-2"
                                        />

                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={
                                                formData.addressLine2
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Address Line 2 (Optional)"
                                            className="w-full rounded-lg border bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black md:col-span-2"
                                        />

                                        <input
                                            type="text"
                                            name="city"
                                            value={
                                                formData.city
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="City"
                                            required
                                            className="w-full rounded-lg border bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        />

                                        <input
                                            type="text"
                                            name="state"
                                            value={
                                                formData.state
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="State"
                                            required
                                            className="w-full rounded-lg border bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        />

                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={
                                                formData.postalCode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Postal Code"
                                            required
                                            className="w-full rounded-lg border bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        />

                                        <input
                                            type="text"
                                            name="country"
                                            value={
                                                formData.country
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Country"
                                            className="w-full rounded-lg border bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        />

                                    </div>


                                    <div className="mt-5 flex gap-3">

                                        <button
                                            type="submit"
                                            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                                        >
                                            Save Address
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowForm(
                                                    false
                                                )
                                            }
                                            className="rounded-lg border px-6 py-3 font-medium transition hover:bg-white"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </form>

                            )}

                        </div>


                        {/* ==================================
                            PAYMENT
                        ================================== */}

                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-semibold">
                                Payment Method
                            </h2>

                            <div className="mt-4 rounded-xl border border-black bg-gray-50 p-4">

                                <div className="flex items-center gap-3">

                                    <input
                                        type="radio"
                                        checked
                                        readOnly
                                    />

                                    <div>

                                        <p className="font-semibold">
                                            Cash on Delivery
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Pay when your order arrives
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        RIGHT SIDE
                    ================================== */}

                    <div>

                        <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-semibold">
                                Order Summary
                            </h2>


                            {/* COUPON */}

                            <div className="mt-6">

                                <label className="mb-2 flex items-center gap-2 text-sm font-medium">

                                    <Tag size={16} />

                                    Coupon Code

                                </label>


                                {!couponApplied ? (

                                    <div className="flex gap-2">

                                        <input
                                            type="text"
                                            value={
                                                couponCode
                                            }
                                            onChange={(e) => {

                                                setCouponCode(
                                                    e.target.value
                                                );

                                                /*
                                                    If user changes coupon
                                                    after applying it,
                                                    reset applied state.
                                                */

                                                if (
                                                    couponApplied
                                                ) {

                                                    setCouponApplied(
                                                        false
                                                    );

                                                    setCouponData(
                                                        null
                                                    );

                                                }

                                            }}
                                            placeholder="Enter coupon"
                                            className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleApplyCoupon
                                            }
                                            disabled={
                                                couponLoading ||
                                                !couponCode.trim()
                                            }
                                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                                        >

                                            {couponLoading
                                                ? "..."
                                                : "Apply"}

                                        </button>

                                    </div>

                                ) : (

                                    <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 p-3">

                                        <div>

                                            <p className="font-semibold text-green-700">
                                                {
                                                    couponCode.toUpperCase()
                                                }
                                            </p>

                                            <p className="text-xs text-green-600">
                                                Coupon applied
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveCoupon
                                            }
                                            className="text-sm font-medium text-red-500"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                )}


                                {discount > 0 && (

                                    <div className="mt-3 flex justify-between text-sm text-green-600">

                                        <span>
                                            Coupon Discount
                                        </span>

                                        <span>
                                            -₹{discount}
                                        </span>

                                    </div>

                                )}

                            </div>


                            <div className="my-6 border-t" />


                            {/* SELECTED ADDRESS */}

                            <div>

                                <p className="text-sm font-medium">
                                    Delivering to
                                </p>

                                {defaultAddress ? (

                                    <div className="mt-2 rounded-lg bg-gray-50 p-3">

                                        <p className="font-medium">
                                            {
                                                defaultAddress.fullName
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">

                                            {
                                                defaultAddress.city
                                            }

                                            ,{" "}

                                            {
                                                defaultAddress.state
                                            }

                                        </p>

                                    </div>

                                ) : (

                                    <p className="mt-2 text-sm text-red-500">
                                        No default address selected
                                    </p>

                                )}

                            </div>


                            <div className="my-6 border-t" />


                            {/* SUBTOTAL */}

                            <div className="flex items-center justify-between">

                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span className="font-medium">
                                    ₹{subtotal}
                                </span>

                            </div>


                            {/* PAYMENT */}

                            <div className="mt-4 flex items-center justify-between">

                                <span className="text-gray-500">
                                    Payment
                                </span>

                                <span className="font-medium">
                                    Cash on Delivery
                                </span>

                            </div>


                            {/* SHIPPING */}

                            <div className="mt-4 flex items-center justify-between">

                                <span className="text-gray-500">
                                    Shipping
                                </span>

                                <span className="font-medium text-green-600">
                                    Free
                                </span>

                            </div>


                            {/* DISCOUNT */}

                            {discount > 0 && (

                                <div className="mt-4 flex items-center justify-between">

                                    <span className="text-gray-500">
                                        Discount
                                    </span>

                                    <span className="font-medium text-green-600">
                                        -₹{discount}
                                    </span>

                                </div>

                            )}


                            <div className="my-6 border-t" />


                            {/* TOTAL */}

                            <div className="flex items-center justify-between">

                                <span className="text-lg font-semibold">
                                    Total
                                </span>

                                <span className="text-xl font-bold">
                                    ₹{finalAmount}
                                </span>

                            </div>


                            {/* PLACE ORDER */}

                            <button
                                type="button"
                                onClick={
                                    handlePlaceOrder
                                }
                                disabled={
                                    placingOrder ||
                                    !defaultAddress ||
                                    subtotal <= 0
                                }
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >

                                <ShoppingBag
                                    size={19}
                                />

                                {placingOrder
                                    ? "Placing Order..."
                                    : "Place Order"}

                            </button>


                            <p className="mt-4 text-center text-xs text-gray-500">

                                By placing your order, you agree to our terms and conditions.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Checkout;