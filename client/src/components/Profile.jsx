import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Shield,
    Calendar,
    Edit3,
    Save,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getProfile,
    updateProfile,
} from "../services/profileApi";

const Profile = () => {

    // ======================================
    // STATES
    // ======================================

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        avatar: "",
    });


    // ======================================
    // FETCH PROFILE
    // ======================================

    useEffect(() => {

        let cancelled = false;

        const fetchProfile = async () => {

            try {

                const response =
                    await getProfile();

                const data =
                    response.data?.data;

                if (!cancelled && data) {

                    setProfile(data);

                    setFormData({
                        name: data.name || "",
                        avatar: data.avatar || "",
                    });

                }

            } catch (error) {

                console.error(
                    "GET PROFILE ERROR:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };

        fetchProfile();

        return () => {

            cancelled = true;

        };

    }, []);


    // ======================================
    // HANDLE CHANGE
    // ======================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // ======================================
    // UPDATE PROFILE
    // ======================================

    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        if (!formData.name.trim()) {

            toast.error(
                "Name cannot be empty"
            );

            return;

        }

        try {

            setSaving(true);

            const response =
                await updateProfile({
                    name: formData.name,
                    avatar: formData.avatar,
                });

            const updatedUser =
                response.data?.data;

            if (!updatedUser) {

                throw new Error(
                    "Invalid profile response"
                );

            }

            setProfile(updatedUser);

            setFormData({
                name: updatedUser.name || "",
                avatar: updatedUser.avatar || "",
            });

            setEditing(false);

            toast.success(
                "Profile updated successfully! 🎉"
            );

        } catch (error) {

            console.error(
                "UPDATE PROFILE ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // ======================================
    // CANCEL EDIT
    // ======================================

    const handleCancel = () => {

        setFormData({
            name: profile?.name || "",
            avatar: profile?.avatar || "",
        });

        setEditing(false);

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-gray-500">
                        Loading profile...
                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // PROFILE NOT FOUND
    // ======================================

    if (!profile) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <User
                        size={50}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 text-xl font-semibold">
                        Profile not found
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Unable to load your profile.
                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // AVATAR
    // ======================================

    const avatar =
        editing
            ? formData.avatar
            : profile.avatar;


    const avatarInitial =
        profile.name
            ?.charAt(0)
            ?.toUpperCase() || "U";


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6">

            <div className="mx-auto max-w-4xl">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold md:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your account information
                    </p>

                </div>


                {/* ==================================
                    PROFILE CARD
                ================================== */}

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">


                    {/* ==================================
                        PROFILE HEADER
                    ================================== */}

                    <div className="bg-black px-6 py-10 md:px-10">

                        <div className="flex flex-col items-center gap-5 sm:flex-row">


                            {/* AVATAR */}

                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-3xl font-bold text-black">

                                {avatar ? (

                                    <img
                                        src={avatar}
                                        alt={profile.name}
                                        className="h-full w-full object-cover"
                                    />

                                ) : (

                                    avatarInitial

                                )}

                            </div>


                            {/* USER INFO */}

                            <div className="text-center text-white sm:text-left">

                                <h2 className="text-2xl font-bold">
                                    {profile.name}
                                </h2>

                                <p className="mt-1 text-gray-300">
                                    {profile.email}
                                </p>

                                <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize">
                                    {profile.role}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        PROFILE CONTENT
                    ================================== */}

                    <div className="p-6 md:p-10">


                        {!editing ? (

                            <div className="space-y-6">


                                {/* NAME */}

                                <div className="flex items-start gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">

                                        <User size={19} />

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Full Name
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {profile.name}
                                        </p>

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div className="flex items-start gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">

                                        <Mail size={19} />

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Email Address
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {profile.email}
                                        </p>

                                    </div>

                                </div>


                                {/* ROLE */}

                                <div className="flex items-start gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">

                                        <Shield size={19} />

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Account Type
                                        </p>

                                        <p className="mt-1 font-medium capitalize">
                                            {profile.role}
                                        </p>

                                    </div>

                                </div>


                                {/* JOINED DATE */}

                                <div className="flex items-start gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">

                                        <Calendar size={19} />

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Member Since
                                        </p>

                                        <p className="mt-1 font-medium">

                                            {profile.createdAt
                                                ? new Date(
                                                      profile.createdAt
                                                  ).toLocaleDateString(
                                                      "en-IN",
                                                      {
                                                          day: "2-digit",
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "N/A"}

                                        </p>

                                    </div>

                                </div>


                                {/* EDIT BUTTON */}

                                <div className="border-t pt-6">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditing(true)
                                        }
                                        className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
                                    >

                                        <Edit3 size={18} />

                                        Edit Profile

                                    </button>

                                </div>

                            </div>

                        ) : (

                            /* ==================================
                               EDIT FORM
                            ================================== */

                            <form
                                onSubmit={
                                    handleUpdateProfile
                                }
                                className="space-y-6"
                            >


                                {/* NAME */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your name"
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                                    />

                                </div>


                                {/* EMAIL - READ ONLY */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={
                                            profile.email
                                        }
                                        disabled
                                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                                    />

                                    <p className="mt-2 text-xs text-gray-400">
                                        Email address cannot be changed.
                                    </p>

                                </div>


                                {/* AVATAR */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium">
                                        Profile Image URL
                                    </label>

                                    <input
                                        type="url"
                                        name="avatar"
                                        value={
                                            formData.avatar
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://example.com/avatar.jpg"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                                    />

                                </div>


                                {/* BUTTONS */}

                                <div className="flex flex-wrap gap-3 border-t pt-6">

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                                    >

                                        <Save size={18} />

                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}

                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        disabled={saving}
                                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-medium transition hover:bg-gray-50"
                                    >

                                        <X size={18} />

                                        Cancel

                                    </button>

                                </div>

                            </form>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Profile;