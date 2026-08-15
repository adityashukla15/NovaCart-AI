import { useState } from "react";
import {
    Mail,
    MapPin,
    Phone,
    Send,
    MessageCircle,
    Clock,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import { sendContactMessage } from "../services/contactApi";

const Contact = () => {

    // ======================================
    // FORM DATA
    // ======================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // ======================================
    // STATES
    // ======================================

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

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
    // SUBMIT
    // ======================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Basic validation

        if (
            !formData.name ||
            !formData.email ||
            !formData.subject ||
            !formData.message
        ) {

            setError(
                "Please fill in all the fields."
            );

            return;

        }

        try {

            setLoading(true);

            const response =
                await sendContactMessage(formData);

            console.log(
                "CONTACT RESPONSE:",
                response.data
            );

            setSuccess(
                response.data?.message ||
                "Your message has been sent successfully!"
            );

            // Clear form

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

        } catch (error) {

            console.error(
                "CONTACT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to send your message. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-white">

            {/* ======================================
                HERO
            ====================================== */}

            <section className="relative overflow-hidden border-b border-gray-100">

                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

                <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-purple-100/50 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">

                    <div className="mx-auto max-w-3xl text-center">

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">

                            <MessageCircle size={14} />

                            We'd love to hear from you

                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">

                            Let's{" "}

                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                talk.
                            </span>

                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">

                            Have a question, suggestion, or need help?
                            Send us a message and our team will get back
                            to you.

                        </p>

                    </div>

                </div>

            </section>


            {/* ======================================
                CONTACT SECTION
            ====================================== */}

            <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">

                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">


                    {/* ==================================
                        LEFT INFORMATION
                    ================================== */}

                    <div>

                        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                            Contact NovaCart
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                            We're here to help.
                        </h2>

                        <p className="mt-4 leading-7 text-gray-500">
                            Whether you're facing an issue with your account,
                            have feedback about our products, or simply want
                            to say hello, feel free to reach out.
                        </p>


                        {/* EMAIL */}

                        <div className="mt-8 flex gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                <Mail size={19} />

                            </div>

                            <div>

                                <p className="text-sm font-semibold text-gray-900">
                                    Email
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {import.meta.env.VITE_CONTACT_EMAIL ||
                                        "support@novacart.com"}
                                </p>

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="mt-6 flex gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">

                                <Phone size={19} />

                            </div>

                            <div>

                                <p className="text-sm font-semibold text-gray-900">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    +91 98765 43210
                                </p>

                            </div>

                        </div>


                        {/* LOCATION */}

                        <div className="mt-6 flex gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">

                                <MapPin size={19} />

                            </div>

                            <div>

                                <p className="text-sm font-semibold text-gray-900">
                                    Location
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Kolkata, India
                                </p>

                            </div>

                        </div>


                        {/* RESPONSE TIME */}

                        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">

                            <div className="flex items-center gap-3">

                                <Clock
                                    size={19}
                                    className="text-gray-700"
                                />

                                <div>

                                    <p className="text-sm font-semibold text-gray-900">
                                        Typical response time
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Usually within 24 hours
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        FORM
                    ================================== */}

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100 sm:p-8">

                        <div className="mb-7">

                            <h3 className="text-xl font-bold text-gray-900">
                                Send us a message
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Fill in the details below and we'll get back
                                to you.
                            </p>

                        </div>


                        {/* SUCCESS */}

                        {success && (

                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                                <CheckCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {success}
                                </span>

                            </div>

                        )}


                        {/* ERROR */}

                        {error && (

                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* NAME + EMAIL */}

                            <div className="grid gap-5 sm:grid-cols-2">

                                {/* NAME */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Your name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
                                    />

                                </div>


                                {/* EMAIL */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
                                    />

                                </div>

                            </div>


                            {/* SUBJECT */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
                                />

                            </div>


                            {/* MESSAGE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Message
                                </label>

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Write your message here..."
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
                                />

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-black hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send
                                            size={17}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />

                                        Send Message
                                    </>
                                )}

                            </button>

                        </form>

                    </div>

                </div>

            </section>


            {/* ======================================
                BOTTOM CTA
            ====================================== */}

            <section className="px-6 pb-16 sm:px-8 lg:px-12">

                <div className="mx-auto max-w-7xl rounded-3xl bg-gray-50 px-6 py-10 text-center sm:px-10">

                    <h3 className="text-xl font-bold text-gray-900">
                        Need something faster?
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Try Nova AI and get help finding products instantly.
                    </p>

                    <a
                        href="/ai"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
                    >

                        <MessageCircle size={17} />

                        Talk to Nova AI

                    </a>

                </div>

            </section>


            {/* ======================================
                FOOTER
            ====================================== */}

            <div className="border-t border-gray-100 py-8 text-center">

                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} NovaCart. All rights reserved.
                </p>

            </div>

        </div>

    );

};

export default Contact;