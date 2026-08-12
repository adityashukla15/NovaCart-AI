import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    RotateCcw,
    Star,
    Package,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAdminProducts,
    deleteAdminProduct,
    restoreProduct,
    toggleFeaturedProduct,
} from "../../services/adminApi";

import AdminProductForm from "./AdminProductForm";

const AdminProducts = () => {

    // ======================================
    // STATES
    // ======================================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [showForm, setShowForm] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);


    // ======================================
    // FETCH PRODUCTS
    // ======================================

    const loadProducts = async () => {

        try {

            const response = await getAdminProducts();

            const data = response.data?.data || [];

            setProducts(data);

        } catch (error) {

            console.error(
                "ADMIN PRODUCTS ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // INITIAL FETCH
    // ======================================

    useEffect(() => {

        let ignore = false;

        const fetchProducts = async () => {

            try {

                const response = await getAdminProducts();

                if (ignore) {
                    return;
                }

                const data = response.data?.data || [];

                setProducts(data);

            } catch (error) {

                if (ignore) {
                    return;
                }

                console.error(
                    "ADMIN PRODUCTS ERROR:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load products"
                );

            } finally {

                if (!ignore) {
                    setLoading(false);
                }

            }

        };

        fetchProducts();

        return () => {
            ignore = true;
        };

    }, []);


    // ======================================
    // FILTER PRODUCTS
    // ======================================

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {

            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                product.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.brand
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                        ? !product.isDeleted
                        : product.isDeleted;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [products, search, statusFilter]);


    // ======================================
    // CREATE
    // ======================================

    const handleCreate = () => {

        setEditingProduct(null);

        setShowForm(true);

    };


    // ======================================
    // EDIT
    // ======================================

    const handleEdit = (product) => {

        setEditingProduct(product);

        setShowForm(true);

    };


    // ======================================
    // CLOSE FORM
    // ======================================

    const handleCloseForm = () => {

        setShowForm(false);

        setEditingProduct(null);

    };


    // ======================================
    // DELETE
    // ======================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAdminProduct(id);

            toast.success(
                "Product deleted successfully"
            );

            await loadProducts();

        } catch (error) {

            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete product"
            );

        }

    };


    // ======================================
    // RESTORE
    // ======================================

    const handleRestore = async (id) => {

        try {

            await restoreProduct(id);

            toast.success(
                "Product restored successfully"
            );

            await loadProducts();

        } catch (error) {

            console.error(
                "RESTORE PRODUCT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to restore product"
            );

        }

    };


    // ======================================
    // FEATURED
    // ======================================

    const handleFeatured = async (id) => {

        try {

            await toggleFeaturedProduct(id);

            toast.success(
                "Featured status updated"
            );

            await loadProducts();

        } catch (error) {

            console.error(
                "FEATURED PRODUCT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update featured status"
            );

        }

    };


    // ======================================
    // FORM SUCCESS
    // ======================================

    const handleFormSuccess = async () => {

        handleCloseForm();

        await loadProducts();

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
                        Loading products...
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
                            Products
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Create, edit and manage your store products.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleCreate}
                        className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >

                        <Plus size={19} />

                        Add Product

                    </button>

                </div>


                {/* ======================================
                    FILTERS
                ====================================== */}

                <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row">


                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search by product or brand..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                        />

                    </div>


                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    >

                        <option value="all">
                            All Products
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="deleted">
                            Deleted
                        </option>

                    </select>

                </div>


                {/* ======================================
                    PRODUCT COUNT
                ====================================== */}

                <div className="mt-5 flex items-center justify-between">

                    <p className="text-sm text-gray-500">

                        Showing{" "}

                        <span className="font-semibold text-gray-900">
                            {filteredProducts.length}
                        </span>{" "}

                        products

                    </p>

                </div>


                {/* ======================================
                    PRODUCTS
                ====================================== */}

                <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">


                    {/* DESKTOP TABLE */}

                    <div className="hidden overflow-x-auto md:block">

                        <table className="w-full min-w-225">

                            <thead>

                                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">

                                    <th className="px-6 py-4">
                                        Product
                                    </th>

                                    <th className="px-6 py-4">
                                        Category
                                    </th>

                                    <th className="px-6 py-4">
                                        Price
                                    </th>

                                    <th className="px-6 py-4">
                                        Stock
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

                                {filteredProducts.map(
                                    (product) => (

                                        <ProductRow
                                            key={product._id}
                                            product={product}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onRestore={handleRestore}
                                            onFeatured={handleFeatured}
                                        />

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* MOBILE */}

                    <div className="divide-y md:hidden">

                        {filteredProducts.map(
                            (product) => (

                                <MobileProductCard
                                    key={product._id}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onRestore={handleRestore}
                                    onFeatured={handleFeatured}
                                />

                            )
                        )}

                    </div>


                    {/* EMPTY */}

                    {filteredProducts.length === 0 && (

                        <div className="px-6 py-16 text-center">

                            <Package
                                size={40}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 font-semibold">
                                No products found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your search or filters.
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

                    <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold">

                                    {editingProduct
                                        ? "Edit Product"
                                        : "Create Product"}

                                </h2>

                                <p className="mt-1 text-sm text-gray-500">

                                    {editingProduct
                                        ? "Update product information."
                                        : "Add a new product to your store."}

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


                        <AdminProductForm
                            product={editingProduct}
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
// DESKTOP PRODUCT ROW
// ======================================

const ProductRow = ({
    product,
    onEdit,
    onDelete,
    onRestore,
    onFeatured,
}) => {

    const image =
        product.images?.[0] || null;

    const price =
        product.discountPrice > 0
            ? product.discountPrice
            : product.price;

    return (

        <tr className="border-b border-gray-100 last:border-0">


            {/* PRODUCT */}

            <td className="px-6 py-4">

                <div className="flex items-center gap-4">

                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                        {image ? (

                            <img
                                src={image}
                                alt={product.title}
                                className="h-full w-full object-cover"
                            />

                        ) : (

                            <div className="flex h-full items-center justify-center text-gray-400">
                                <Package size={20} />
                            </div>

                        )}

                    </div>


                    <div className="min-w-0">

                        <p className="max-w-55 truncate font-semibold">
                            {product.title}
                        </p>

                        {product.brand && (

                            <p className="mt-1 text-sm text-gray-500">
                                {product.brand}
                            </p>

                        )}


                        {product.isFeatured && (

                            <div className="mt-1 flex items-center gap-1 text-xs text-yellow-600">

                                <Star
                                    size={12}
                                    fill="currentColor"
                                />

                                Featured

                            </div>

                        )}

                    </div>

                </div>

            </td>


            {/* CATEGORY */}

            <td className="px-6 py-4 text-sm text-gray-600">

                {product.category?.name || "Uncategorized"}

            </td>


            {/* PRICE */}

            <td className="px-6 py-4">

                <span className="font-semibold">
                    ₹{price}
                </span>

                {product.discountPrice > 0 && (

                    <span className="ml-2 text-sm text-gray-400 line-through">
                        ₹{product.price}
                    </span>

                )}

            </td>


            {/* STOCK */}

            <td className="px-6 py-4">

                <span
                    className={
                        product.stock <= 0
                            ? "font-semibold text-red-500"
                            : product.stock < 10
                                ? "font-semibold text-orange-500"
                                : "text-green-600"
                    }
                >
                    {product.stock}
                </span>

            </td>


            {/* STATUS */}

            <td className="px-6 py-4">

                {product.isDeleted ? (

                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                        Deleted
                    </span>

                ) : (

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                        Active
                    </span>

                )}

            </td>


            {/* ACTIONS */}

            <td className="px-6 py-4">

                <div className="flex justify-end gap-2">

                    {!product.isDeleted && (

                        <>

                            {/* FEATURED */}

                            <button
                                type="button"
                                title={
                                    product.isFeatured
                                        ? "Remove Featured"
                                        : "Make Featured"
                                }
                                onClick={() =>
                                    onFeatured(product._id)
                                }
                                className={`rounded-lg border p-2 transition ${
                                    product.isFeatured
                                        ? "border-yellow-200 bg-yellow-50 text-yellow-600"
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                            >

                                <Star
                                    size={17}
                                    fill={
                                        product.isFeatured
                                            ? "currentColor"
                                            : "none"
                                    }
                                />

                            </button>


                            {/* EDIT */}

                            <button
                                type="button"
                                title="Edit"
                                onClick={() =>
                                    onEdit(product)
                                }
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50"
                            >

                                <Pencil size={17} />

                            </button>


                            {/* DELETE */}

                            <button
                                type="button"
                                title="Delete"
                                onClick={() =>
                                    onDelete(product._id)
                                }
                                className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                            >

                                <Trash2 size={17} />

                            </button>

                        </>

                    )}


                    {product.isDeleted && (

                        <button
                            type="button"
                            title="Restore"
                            onClick={() =>
                                onRestore(product._id)
                            }
                            className="flex items-center gap-2 rounded-lg border border-green-100 px-3 py-2 text-sm text-green-600 transition hover:bg-green-50"
                        >

                            <RotateCcw size={16} />

                            Restore

                        </button>

                    )}

                </div>

            </td>

        </tr>

    );

};


// ======================================
// MOBILE PRODUCT CARD
// ======================================

const MobileProductCard = ({
    product,
    onEdit,
    onDelete,
    onRestore,
    onFeatured,
}) => {

    const image =
        product.images?.[0] || null;

    const price =
        product.discountPrice > 0
            ? product.discountPrice
            : product.price;

    return (

        <div className="p-4">

            <div className="flex gap-4">

                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                    {image ? (

                        <img
                            src={image}
                            alt={product.title}
                            className="h-full w-full object-cover"
                        />

                    ) : (

                        <div className="flex h-full items-center justify-center text-gray-400">
                            <Package size={22} />
                        </div>

                    )}

                </div>


                <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                        <div>

                            <h3 className="font-semibold">
                                {product.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {product.category?.name || "Uncategorized"}
                            </p>

                        </div>


                        {product.isFeatured && (

                            <Star
                                size={17}
                                className="shrink-0 text-yellow-500"
                                fill="currentColor"
                            />

                        )}

                    </div>


                    <div className="mt-3 flex items-center gap-3">

                        <span className="font-bold">
                            ₹{price}
                        </span>

                        <span
                            className={
                                product.stock < 10
                                    ? "text-sm text-orange-500"
                                    : "text-sm text-green-600"
                            }
                        >
                            Stock: {product.stock}
                        </span>

                    </div>

                </div>

            </div>


            <div className="mt-4 flex flex-wrap gap-2">

                {!product.isDeleted && (

                    <>

                        <button
                            type="button"
                            onClick={() =>
                                onFeatured(product._id)
                            }
                            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                        >

                            <Star
                                size={15}
                                fill={
                                    product.isFeatured
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            Featured

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onEdit(product)
                            }
                            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                        >

                            <Pencil size={15} />

                            Edit

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onDelete(product._id)
                            }
                            className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm text-red-500"
                        >

                            <Trash2 size={15} />

                            Delete

                        </button>

                    </>

                )}


                {product.isDeleted && (

                    <button
                        type="button"
                        onClick={() =>
                            onRestore(product._id)
                        }
                        className="flex items-center gap-2 rounded-lg border border-green-100 px-3 py-2 text-sm text-green-600"
                    >

                        <RotateCcw size={15} />

                        Restore

                    </button>

                )}

            </div>

        </div>

    );

};

export default AdminProducts;