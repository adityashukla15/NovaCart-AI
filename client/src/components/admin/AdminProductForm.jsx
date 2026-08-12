import { useEffect, useState } from "react";

import {
    ImagePlus,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    createAdminProduct,
    updateAdminProduct,
} from "../../services/adminApi";

import {
    getAllCategories,
} from "../../services/categoryApi";

const AdminProductForm = ({
    product,
    onSuccess,
    onCancel,
}) => {

    // ======================================
    // INITIAL FORM STATE
    // ======================================

    const getInitialForm = () => {

        if (!product) {

            return {
                title: "",
                description: "",
                category: "",
                brand: "",
                price: "",
                discountPrice: "",
                stock: "",
                sizes: "",
                colors: "",
                isFeatured: false,
            };

        }

        return {

            title: product.title || "",

            description:
                product.description || "",

            category:
                product.category?._id ||
                product.category ||
                "",

            brand:
                product.brand || "",

            price:
                product.price ?? "",

            discountPrice:
                product.discountPrice || "",

            stock:
                product.stock ?? "",

            sizes:
                product.sizes?.join(", ") || "",

            colors:
                product.colors?.join(", ") || "",

            isFeatured:
                product.isFeatured || false,

        };

    };


    // ======================================
    // STATES
    // ======================================

    const [categories, setCategories] =
        useState([]);

    const [loadingCategories, setLoadingCategories] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [images, setImages] =
        useState([]);

    const [form, setForm] =
        useState(getInitialForm);


    // ======================================
    // LOAD CATEGORIES
    // ======================================

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response =
                    await getAllCategories();

                const data =
                    response.data?.data || [];

                setCategories(data);

            } catch (error) {

                console.error(
                    "CATEGORY ERROR:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load categories"
                );

            } finally {

                setLoadingCategories(false);

            }

        };

        loadCategories();

    }, []);


    // ======================================
    // INPUT CHANGE
    // ======================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };


    // ======================================
    // IMAGE CHANGE
    // ======================================

    const handleImageChange = (e) => {

        const selected =
            Array.from(e.target.files || []);

        if (selected.length > 5) {

            toast.error(
                "You can upload maximum 5 images"
            );

            return;

        }

        setImages(selected);

    };


    // ======================================
    // SUBMIT
    // ======================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // ==================================
        // VALIDATION
        // ==================================

        if (!form.title.trim()) {

            toast.error(
                "Product title is required"
            );

            return;

        }


        if (!form.description.trim()) {

            toast.error(
                "Product description is required"
            );

            return;

        }


        if (!form.category) {

            toast.error(
                "Please select a category"
            );

            return;

        }


        if (!form.price) {

            toast.error(
                "Price is required"
            );

            return;

        }


        if (Number(form.price) <= 0) {

            toast.error(
                "Price must be greater than 0"
            );

            return;

        }


        if (
            form.discountPrice &&
            Number(form.discountPrice) >=
                Number(form.price)
        ) {

            toast.error(
                "Discount price must be less than actual price"
            );

            return;

        }


        if (
            form.stock === "" ||
            Number(form.stock) < 0
        ) {

            toast.error(
                "Enter a valid stock quantity"
            );

            return;

        }


        // ==================================
        // SUBMIT
        // ==================================

        try {

            setSubmitting(true);


            const formData =
                new FormData();


            // ==================================
            // BASIC FIELDS
            // ==================================

            formData.append(
                "title",
                form.title.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "category",
                form.category
            );

            formData.append(
                "brand",
                form.brand.trim()
            );

            formData.append(
                "price",
                form.price
            );

            formData.append(
                "discountPrice",
                form.discountPrice || 0
            );

            formData.append(
                "stock",
                form.stock
            );


            // ==================================
            // SIZES
            // ==================================

            form.sizes
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((size) => {

                    formData.append(
                        "sizes",
                        size
                    );

                });


            // ==================================
            // COLORS
            // ==================================

            form.colors
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((color) => {

                    formData.append(
                        "colors",
                        color
                    );

                });


            // ==================================
            // FEATURED
            // ==================================

            formData.append(
                "isFeatured",
                form.isFeatured
            );


            // ==================================
            // IMAGES
            // ==================================

            images.forEach((image) => {

                formData.append(
                    "images",
                    image
                );

            });


            // ==================================
            // CREATE / UPDATE
            // ==================================

            if (product) {

                await updateAdminProduct(
                    product._id,
                    formData
                );

                toast.success(
                    "Product updated successfully"
                );

            } else {

                await createAdminProduct(
                    formData
                );

                toast.success(
                    "Product created successfully"
                );

            }


            // ==================================
            // SUCCESS
            // ==================================

            onSuccess();

        } catch (error) {

            console.error(
                "PRODUCT FORM ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to save product"
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
                BASIC INFORMATION
            ====================================== */}

            <div className="grid gap-5 md:grid-cols-2">


                {/* TITLE */}

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Product Title *
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Nike Air Max"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>


                {/* BRAND */}

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Brand
                    </label>

                    <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        placeholder="e.g. Nike"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>


                {/* CATEGORY */}

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Category *
                    </label>

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        disabled={loadingCategories}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                    >

                        <option value="">

                            {loadingCategories
                                ? "Loading categories..."
                                : "Select category"}

                        </option>


                        {categories.map(
                            (category) => (

                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* PRICE */}

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Price *
                    </label>

                    <input
                        type="number"
                        name="price"
                        min="1"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="2999"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>


                {/* DISCOUNT PRICE */}

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Discount Price
                    </label>

                    <input
                        type="number"
                        name="discountPrice"
                        min="0"
                        value={form.discountPrice}
                        onChange={handleChange}
                        placeholder="2499"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>


                {/* STOCK */}

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Stock *
                    </label>

                    <input
                        type="number"
                        name="stock"
                        min="0"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="50"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>


                {/* SIZES */}

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Sizes
                    </label>

                    <input
                        type="text"
                        name="sizes"
                        value={form.sizes}
                        onChange={handleChange}
                        placeholder="S, M, L, XL"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>


                {/* COLORS */}

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Colors
                    </label>

                    <input
                        type="text"
                        name="colors"
                        value={form.colors}
                        onChange={handleChange}
                        placeholder="Black, White, Blue"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>


                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Description *
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe the product..."
                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                </div>

            </div>


            {/* ======================================
                IMAGES
            ====================================== */}

            <div className="mt-6">

                <label className="mb-2 block text-sm font-medium">
                    Product Images
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-6 py-8 transition hover:border-black">

                    <ImagePlus
                        size={30}
                        className="text-gray-400"
                    />

                    <p className="mt-3 text-sm font-medium">
                        Click to upload images
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Maximum 5 images
                    </p>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                    />

                </label>


                {/* SELECTED IMAGES */}

                {images.length > 0 && (

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">

                        {images.map(
                            (image, index) => (

                                <div
                                    key={`${image.name}-${index}`}
                                    className="overflow-hidden rounded-xl border"
                                >

                                    <img
                                        src={URL.createObjectURL(
                                            image
                                        )}
                                        alt={`Preview ${index + 1}`}
                                        className="h-24 w-full object-cover"
                                    />

                                    <p className="truncate px-2 py-1 text-xs text-gray-500">
                                        {image.name}
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ======================================
                FEATURED
            ====================================== */}

            <label className="mt-6 flex cursor-pointer items-center gap-3">

                <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4"
                />

                <span className="text-sm font-medium">
                    Show this product as Featured
                </span>

            </label>


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
                        : product
                            ? "Update Product"
                            : "Create Product"}

                </button>

            </div>

        </form>

    );

};

export default AdminProductForm;