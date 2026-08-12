import { useState } from "react";

import {
    Image,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    createAdminCategory,
    updateAdminCategory,
} from "../../services/adminApi";


const AdminCategoryForm = ({
    category,
    onSuccess,
    onCancel,
}) => {

    // ======================================
    // INITIAL FORM DATA
    // ======================================

    const [form, setForm] = useState(() => ({
        name: category?.name || "",
        image: category?.image || "",
    }));


    const [submitting, setSubmitting] =
        useState(false);


    // ======================================
    // INPUT CHANGE
    // ======================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // ======================================
    // SUBMIT
    // ======================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        const trimmedName =
            form.name.trim();

        const trimmedImage =
            form.image.trim();


        // ======================================
        // VALIDATION
        // ======================================

        if (!trimmedName) {

            toast.error(
                "Category name is required"
            );

            return;

        }


        try {

            setSubmitting(true);


            const payload = {
                name: trimmedName,
                image: trimmedImage,
            };


            let response;


            // ======================================
            // UPDATE
            // ======================================

            if (category) {

                response =
                    await updateAdminCategory(
                        category._id,
                        payload
                    );

                toast.success(
                    "Category updated successfully"
                );

            }

            // ======================================
            // CREATE
            // ======================================

            else {

                response =
                    await createAdminCategory(
                        payload
                    );

                toast.success(
                    "Category created successfully"
                );

            }


            // ======================================
            // SAVED CATEGORY
            // ======================================

            const savedCategory =
                response.data?.data;


            if (savedCategory) {

                onSuccess(savedCategory);

            } else {

                onSuccess();

            }


        } catch (error) {

            console.error(
                "CATEGORY FORM ERROR:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to save category"
            );


        } finally {

            setSubmitting(false);

        }

    };


    // ======================================
    // RENDER
    // ======================================

    return (

        <form
            onSubmit={handleSubmit}
            className="p-6"
        >


            {/* ======================================
                CATEGORY NAME
            ====================================== */}

            <div>

                <label className="mb-2 block text-sm font-medium">
                    Category Name *
                </label>


                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    disabled={submitting}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
                />

            </div>


            {/* ======================================
                IMAGE URL
            ====================================== */}

            <div className="mt-5">

                <label className="mb-2 block text-sm font-medium">
                    Category Image URL
                </label>


                <div className="relative">

                    <Image
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />


                    <input
                        type="url"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://example.com/category.jpg"
                        disabled={submitting}
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-black disabled:bg-gray-100"
                    />

                </div>


                <p className="mt-2 text-xs text-gray-500">
                    Paste a publicly accessible image URL.
                </p>

            </div>


            {/* ======================================
                IMAGE PREVIEW
            ====================================== */}

            {form.image.trim() && (

                <div className="mt-5">

                    <p className="mb-2 text-sm font-medium">
                        Preview
                    </p>


                    <div className="h-40 w-full overflow-hidden rounded-xl bg-gray-100">

                        <img
                            src={form.image.trim()}
                            alt="Category preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {

                                e.currentTarget.style.display =
                                    "none";

                            }}
                        />

                    </div>

                </div>

            )}


            {/* ======================================
                ACTIONS
            ====================================== */}

            <div className="mt-8 flex justify-end gap-3 border-t pt-5">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                >

                    Cancel

                </button>


                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    {submitting
                        ? "Saving..."
                        : category
                            ? "Update Category"
                            : "Create Category"}

                </button>

            </div>

        </form>

    );

};


export default AdminCategoryForm;