import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
} from "lucide-react";

import Button from "../components/ui/Button";

import {
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
} from "../services/authApi";


const ForgotPassword = () => {

    const navigate = useNavigate();


    // ======================================
    // STEP
    // ======================================

    const [step, setStep] = useState(1);


    // ======================================
    // FORM DATA
    // ======================================

    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });


    // ======================================
    // PASSWORD VISIBILITY
    // ======================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    // ======================================
    // STATES
    // ======================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ======================================
    // HANDLE CHANGE
    // ======================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");

    };


    // ======================================
    // SEND OTP
    // ======================================

    const handleSendOtp = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Email validation

        if (!formData.email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await forgotPassword({
                    email: formData.email.trim(),
                });


            console.log(
                "FORGOT PASSWORD RESPONSE:",
                response.data
            );


            setSuccess(
                response.data?.message ||
                "OTP sent successfully."
            );


            // Go to OTP step

            setStep(2);


        } catch (error) {

            console.error(
                "FORGOT PASSWORD ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to send OTP. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // VERIFY OTP
    // ======================================

    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // OTP validation

        if (!formData.otp) {

            setError(
                "Please enter the OTP."
            );

            return;

        }


        if (
            formData.otp.length !== 6 ||
            !/^\d{6}$/.test(formData.otp)
        ) {

            setError(
                "OTP must be 6 digits."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await verifyForgotPasswordOTP({
                    email: formData.email.trim(),
                    otp: formData.otp,
                });


            console.log(
                "VERIFY OTP RESPONSE:",
                response.data
            );


            setSuccess(
                response.data?.message ||
                "OTP verified successfully."
            );


            // Go to password reset step

            setStep(3);


        } catch (error) {

            console.error(
                "OTP VERIFY ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Invalid or expired OTP."
            );


        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // RESET PASSWORD
    // ======================================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Password validation

        if (
            !formData.password ||
            !formData.confirmPassword
        ) {

            setError(
                "Please enter both passwords."
            );

            return;

        }


        if (formData.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await resetPassword({

                    email: formData.email.trim(),

                    newPassword:
                        formData.password,

                });


            console.log(
                "RESET PASSWORD RESPONSE:",
                response.data
            );


            setSuccess(
                response.data?.message ||
                "Password reset successfully!"
            );


            // Redirect to login

            setTimeout(() => {

                navigate("/login", {
                    replace: true,
                });

            }, 1500);


        } catch (error) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to reset password."
            );


        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // STEP TITLE
    // ======================================

    const getTitle = () => {

        if (step === 1) {

            return "Forgot your password?";

        }

        if (step === 2) {

            return "Verify OTP";

        }

        return "Create new password";

    };


    // ======================================
    // STEP DESCRIPTION
    // ======================================

    const getDescription = () => {

        if (step === 1) {

            return "Enter your email and we'll send you a verification code.";

        }

        if (step === 2) {

            return `Enter the 6-digit OTP sent to ${formData.email}.`;

        }

        return "Your identity has been verified. Set a new password.";

    };


    // ======================================
    // RENDER
    // ======================================

    return (

        <div>


            {/* ======================================
                BACK TO LOGIN
            ====================================== */}

            <Link
                to="/login"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
            >

                <ArrowLeft size={16} />

                Back to login

            </Link>


            {/* ======================================
                HEADER
            ====================================== */}

            <div className="mb-8">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white">

                    {step === 2 ? (

                        <ShieldCheck size={22} />

                    ) : (

                        <Lock size={22} />

                    )}

                </div>


                <h2 className="text-3xl font-bold tracking-tight text-gray-900">

                    {getTitle()}

                </h2>


                <p className="mt-2 text-gray-500">

                    {getDescription()}

                </p>

            </div>


            {/* ======================================
                STEP INDICATOR
            ====================================== */}

            <div className="mb-7 flex items-center gap-2">

                {[1, 2, 3].map((item) => (

                    <div
                        key={item}
                        className={`h-1.5 flex-1 rounded-full transition ${
                            item <= step
                                ? "bg-black"
                                : "bg-gray-200"
                        }`}
                    />

                ))}

            </div>


            {/* ======================================
                ERROR
            ====================================== */}

            {error && (

                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    {error}

                </div>

            )}


            {/* ======================================
                SUCCESS
            ====================================== */}

            {success && (

                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">

                    {success}

                </div>

            )}


            {/* ======================================
                STEP 1 — EMAIL
            ====================================== */}

            {step === 1 && (

                <form
                    onSubmit={handleSendOtp}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">

                            Email address

                        </label>


                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />

                        </div>

                    </div>


                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl py-3"
                    >

                        {loading
                            ? "Sending OTP..."
                            : "Send OTP"}

                    </Button>

                </form>

            )}


            {/* ======================================
                STEP 2 — OTP
            ====================================== */}

            {step === 2 && (

                <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">

                            Verification Code

                        </label>


                        <div className="relative">

                            <ShieldCheck
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-center tracking-[0.35em] outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />

                        </div>

                    </div>


                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl py-3"
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}

                    </Button>


                    <button
                        type="button"
                        onClick={() => {

                            setStep(1);

                            setFormData((prev) => ({
                                ...prev,
                                otp: "",
                            }));

                            setError("");
                            setSuccess("");

                        }}
                        className="w-full text-sm font-medium text-gray-500 hover:text-black"
                    >

                        Change email

                    </button>

                </form>

            )}


            {/* ======================================
                STEP 3 — NEW PASSWORD
            ====================================== */}

            {step === 3 && (

                <form
                    onSubmit={handleResetPassword}
                    className="space-y-5"
                >


                    {/* PASSWORD */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">

                            New Password

                        </label>


                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />


                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-12 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (prev) => !prev
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                            >

                                {showPassword ? (

                                    <EyeOff size={18} />

                                ) : (

                                    <Eye size={18} />

                                )}

                            </button>

                        </div>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">

                            Confirm Password

                        </label>


                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />


                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-12 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (prev) => !prev
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                            >

                                {showConfirmPassword ? (

                                    <EyeOff size={18} />

                                ) : (

                                    <Eye size={18} />

                                )}

                            </button>

                        </div>

                    </div>


                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl py-3"
                    >

                        {loading
                            ? "Resetting password..."
                            : "Reset Password"}

                    </Button>

                </form>

            )}


            {/* ======================================
                FOOTER
            ====================================== */}

            <p className="mt-8 text-center text-sm text-gray-500">

                Remember your password?{" "}

                <Link
                    to="/login"
                    className="font-semibold text-black hover:underline"
                >

                    Sign in

                </Link>

            </p>

        </div>

    );

};


export default ForgotPassword;