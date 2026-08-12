import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Folder,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAdminCategories,
    deleteAdminCategory,
} from "../../services/adminApi";

import AdminCategoryForm from "./AdminCategoryForm";


const AdminCategories = () => {

    // ======================================
    // STATES
    // ======================================

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingCategory, setEditingCategory] =
        useState(null);


    // ======================================
    // LOAD CATEGORIES
    // ======================================

    useEffect(() => {

        let isMounted = true;

        const loadCategories = async () => {

            try {

                const response =
                    await getAdminCategories();

                if (!isMounted) {
                    return;
                }

                const data =
                    response.data?.data || [];

                setCategories(data);

            } catch (error) {

                if (!isMounted) {
                    return;
                }

                console.error(
                    "ADMIN CATEGORIES ERROR:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load categories"
                );

            } finally {

                if (isMounted) {
                    setLoading(false);
                }

            }

        };

        loadCategories();

        return () => {
            isMounted = false;
        };

    }, []);


    // ======================================
    // FILTER CATEGORIES
    // ======================================

    const filteredCategories = useMemo(() => {

        const searchText =
            search.toLowerCase().trim();

        if (!searchText) {
            return categories;
        }

        return categories.filter((category) => {

            return (
                category.name
                    ?.toLowerCase()
                    .includes(searchText) ||

                category.slug
                    ?.toLowerCase()
                    .includes(searchText)
            );

        });

    }, [categories, search]);


    // ======================================
    // CREATE
    // ======================================

    const handleCreate = () => {

        setEditingCategory(null);

        setShowForm(true);

    };


    // ======================================
    // EDIT
    // ======================================

    const handleEdit = (category) => {

        setEditingCategory(category);

        setShowForm(true);

    };


    // ======================================
    // CLOSE FORM
    // ======================================

    const handleCloseForm = () => {

        setShowForm(false);

        setEditingCategory(null);

    };


    // ======================================
    // DELETE
    // ======================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this category?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAdminCategory(id);

            toast.success(
                "Category deleted successfully"
            );

            // Remove deleted category locally.
            // No unnecessary API reload.
            setCategories((prev) =>
                prev.filter(
                    (category) =>
                        category._id !== id
                )
            );

        } catch (error) {

            console.error(
                "DELETE CATEGORY ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete category"
            );

        }

    };


    // ======================================
    // FORM SUCCESS
    // ======================================

    const handleFormSuccess = (savedCategory) => {

        if (savedCategory) {

            setCategories((prev) => {

                const exists =
                    prev.some(
                        (category) =>
                            category._id ===
                            savedCategory._id
                    );

                if (exists) {

                    return prev.map(
                        (category) =>
                            category._id ===
                            savedCategory._id
                                ? savedCategory
                                : category
                    );

                }

                return [
                    savedCategory,
                    ...prev,
                ];

            });

        }

        setShowForm(false);

        setEditingCategory(null);

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
                        Loading categories...
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

                        <h1 className="mt-1 text-3xl font-bold">
                            Categories
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Create, edit and manage your store categories.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleCreate}
                        className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >

                        <Plus size={19} />

                        Add Category

                    </button>

                </div>


                {/* ======================================
                    SEARCH
                ====================================== */}

                <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm">

                    <div className="relative">

                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search category..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                        />

                    </div>

                </div>


                {/* ======================================
                    COUNT
                ====================================== */}

                <div className="mt-5">

                    <p className="text-sm text-gray-500">

                        Showing{" "}

                        <span className="font-semibold text-gray-900">
                            {filteredCategories.length}
                        </span>{" "}

                        categories

                    </p>

                </div>


                {/* ======================================
                    CATEGORY LIST
                ====================================== */}

                <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">


                    {/* DESKTOP */}

                    <div className="hidden overflow-x-auto md:block">

                        <table className="w-full min-w-187.5">

                            <thead>

                                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">

                                    <th className="px-6 py-4">
                                        Category
                                    </th>

                                    <th className="px-6 py-4">
                                        Slug
                                    </th>

                                    <th className="px-6 py-4">
                                        Created By
                                    </th>

                                    <th className="px-6 py-4">
                                        Created
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredCategories.map(
                                    (category) => (

                                        <CategoryRow
                                            key={category._id}
                                            category={category}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* MOBILE */}

                    <div className="divide-y md:hidden">

                        {filteredCategories.map(
                            (category) => (

                                <MobileCategoryCard
                                    key={category._id}
                                    category={category}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />

                            )
                        )}

                    </div>


                    {/* EMPTY */}

                    {filteredCategories.length === 0 && (

                        <div className="px-6 py-16 text-center">

                            <Folder
                                size={40}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 font-semibold">
                                No categories found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your search.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* ======================================
                CREATE / EDIT MODAL
            ====================================== */}

            {showForm && (

                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8">

                    <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold">

                                    {editingCategory
                                        ? "Edit Category"
                                        : "Create Category"}

                                </h2>

                                <p className="mt-1 text-sm text-gray-500">

                                    {editingCategory
                                        ? "Update category information."
                                        : "Add a new category to your store."}

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >

                                <X size={21} />

                            </button>

                        </div>


                        <AdminCategoryForm
                            category={editingCategory}
                            onSuccess={handleFormSuccess}
                            onCancel={handleCloseForm}
                        />

                    </div>

                </div>

            )}

        </div>

    );

};


// ======================================
// DESKTOP CATEGORY ROW
// ======================================

const CategoryRow = ({
    category,
    onEdit,
    onDelete,
}) => {

    const createdDate =
        category.createdAt
            ? new Date(
                category.createdAt
            ).toLocaleDateString()
            : "-";

    return (

        <tr className="border-b border-gray-100 last:border-0">

            {/* CATEGORY */}

            <td className="px-6 py-4">

                <div className="flex items-center gap-4">

                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                        {category.image ? (

                            <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover"
                            />

                        ) : (

                            <div className="flex h-full items-center justify-center text-gray-400">

                                <Folder size={20} />

                            </div>

                        )}

                    </div>


                    <div className="min-w-0">

                        <p className="font-semibold">
                            {category.name}
                        </p>

                    </div>

                </div>

            </td>


            {/* SLUG */}

            <td className="px-6 py-4 text-sm text-gray-500">

                {category.slug || "-"}

            </td>


            {/* CREATED BY */}

            <td className="px-6 py-4 text-sm text-gray-600">

                {category.createdBy?.name ||
                    category.createdBy?.email ||
                    "-"}

            </td>


            {/* DATE */}

            <td className="px-6 py-4 text-sm text-gray-500">

                {createdDate}

            </td>


            {/* ACTIONS */}

            <td className="px-6 py-4">

                <div className="flex justify-end gap-2">

                    <button
                        type="button"
                        title="Edit"
                        onClick={() =>
                            onEdit(category)
                        }
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50"
                    >

                        <Pencil size={17} />

                    </button>


                    <button
                        type="button"
                        title="Delete"
                        onClick={() =>
                            onDelete(category._id)
                        }
                        className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                    >

                        <Trash2 size={17} />

                    </button>

                </div>

            </td>

        </tr>

    );

};


// ======================================
// MOBILE CATEGORY CARD
// ======================================

const MobileCategoryCard = ({
    category,
    onEdit,
    onDelete,
}) => {

    return (

        <div className="p-4">

            <div className="flex gap-4">

                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                    {category.image ? (

                        <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover"
                        />

                    ) : (

                        <div className="flex h-full items-center justify-center text-gray-400">

                            <Folder size={22} />

                        </div>

                    )}

                </div>


                <div className="min-w-0 flex-1">

                    <h3 className="font-semibold">
                        {category.name}
                    </h3>

                    <p className="mt-1 truncate text-sm text-gray-500">
                        {category.slug}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">

                        {category.createdAt
                            ? new Date(
                                category.createdAt
                            ).toLocaleDateString()
                            : "-"}

                    </p>

                </div>

            </div>


            <div className="mt-4 flex gap-2">

                <button
                    type="button"
                    onClick={() =>
                        onEdit(category)
                    }
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                >

                    <Pencil size={15} />

                    Edit

                </button>


                <button
                    type="button"
                    onClick={() =>
                        onDelete(category._id)
                    }
                    className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm text-red-500"
                >

                    <Trash2 size={15} />

                    Delete

                </button>

            </div>

        </div>

    );

};


export default AdminCategories;