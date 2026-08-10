import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import Button from "../components/ui/Button";
import { loginUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {

            setError("Email and password are required");

            return;

        }

        try {

            setLoading(true);

            const response = await loginUser(formData);

            console.log(
                "Login response:",
                response.data
            );

            const user =
                response.data?.data;

            setUser(user);

            navigate("/", {
                replace: true,
            });

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div>

            {/* Heading */}

            <div className="mb-8">

                <h2 className="text-3xl font-bold tracking-tight text-gray-900">

                    Welcome back

                </h2>

                <p className="mt-2 text-gray-500">

                    Sign in to continue shopping with NovaCart.

                </p>

            </div>


            {/* Error */}

            {error && (

                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    {error}

                </div>

            )}


            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* Email */}

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
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                        />

                    </div>

                </div>


                {/* Password */}

                <div>

                    <div className="mb-2 flex items-center justify-between">

                        <label className="block text-sm font-medium text-gray-700">

                            Password

                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-gray-600 hover:text-black"
                        >
                            Forgot password?
                        </Link>

                    </div>


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
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-12 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                        />


                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
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


                {/* Login */}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl py-3"
                >

                    {loading
                        ? "Signing in..."
                        : "Sign In"}

                </Button>

            </form>


            {/* Register */}

            <p className="mt-8 text-center text-sm text-gray-500">

                Don't have an account?{" "}

                <Link
                    to="/register"
                    className="font-semibold text-black hover:underline"
                >
                    Create account
                </Link>

            </p>

        </div>

    );

};

export default Login;