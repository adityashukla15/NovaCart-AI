import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getAllProducts } from "../services/productApi";
import ProductCard from "../components/product/ProductCard";


const Shop = () => {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();


    // ======================================
    // GET SEARCH + CATEGORY QUERY
    // ======================================

    const searchQuery =
        searchParams.get("search")?.trim().toLowerCase() || "";

    const categoryQuery =
        searchParams.get("category")?.trim().toLowerCase() || "";


    // ======================================
    // FETCH PRODUCTS
    // ======================================

    const fetchProducts = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await getAllProducts();

            console.log(
                "Products API:",
                response.data
            );


            // ======================================
            // BACKEND RESPONSE HANDLE
            // ======================================

            const productData =
                response.data?.data?.products ||
                response.data?.data ||
                [];


            setProducts(
                Array.isArray(productData)
                    ? productData
                    : []
            );


        } catch (error) {

            console.error(
                "PRODUCT API ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // LOAD PRODUCTS
    // ======================================

    useEffect(() => {

        fetchProducts();

    }, []);


    // ======================================
    // FILTER PRODUCTS
    // SEARCH + CATEGORY
    // ======================================

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {


            // ======================================
            // PRODUCT CATEGORY
            // ======================================

            const category =
                typeof product?.category === "string"
                    ? product.category.toLowerCase()
                    : product?.category?.name
                        ?.toLowerCase() || "";


            // ======================================
            // CATEGORY FILTER
            // ======================================

            const matchesCategory =
                !categoryQuery ||
                category === categoryQuery ||
                category.includes(categoryQuery);


            // ======================================
            // SEARCH FILTER
            // ======================================

            if (!searchQuery) {

                return matchesCategory;

            }


            const title =
                product?.title
                    ?.toLowerCase() || "";


            const description =
                product?.description
                    ?.toLowerCase() || "";


            const brand =
                product?.brand
                    ?.toLowerCase() || "";


            const keywords =
                Array.isArray(product?.keywords)
                    ? product.keywords
                        .join(" ")
                        .toLowerCase()
                    : "";


            const matchesSearch =
                title.includes(searchQuery) ||
                description.includes(searchQuery) ||
                brand.includes(searchQuery) ||
                category.includes(searchQuery) ||
                keywords.includes(searchQuery);


            return (
                matchesCategory &&
                matchesSearch
            );

        });

    }, [
        products,
        searchQuery,
        categoryQuery
    ]);


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center">

                <p className="text-lg text-gray-600">
                    Loading products...
                </p>

            </div>

        );

    }


    // ======================================
    // ERROR
    // ======================================

    if (error) {

        return (

            <div className="flex min-h-screen items-center justify-center">

                <p className="text-red-500">
                    {error}
                </p>

            </div>

        );

    }


    // ======================================
    // PAGE TITLE
    // ======================================

    const getPageTitle = () => {

        if (searchQuery && categoryQuery) {

            return `Search results in ${categoryQuery}`;

        }

        if (searchQuery) {

            return `Search results for "${searchQuery}"`;

        }

        if (categoryQuery) {

            return `${categoryQuery} Products`;

        }

        return "Shop";

    };


    // ======================================
    // PAGE DESCRIPTION
    // ======================================

    const getPageDescription = () => {

        if (searchQuery || categoryQuery) {

            return `${filteredProducts.length} product${
                filteredProducts.length !== 1
                    ? "s"
                    : ""
            } found`;

        }

        return "Explore our latest products";

    };


    // ======================================
    // SHOP PAGE
    // ======================================

    return (

        <div className="min-h-screen px-6 py-10">

            <div className="mx-auto max-w-7xl">


                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="mb-8">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold capitalize">

                                {getPageTitle()}

                            </h1>


                            <p className="mt-2 text-gray-500">

                                {getPageDescription()}

                            </p>

                        </div>


                        {/* PRODUCT COUNT */}

                        <p className="text-sm text-gray-500">

                            {filteredProducts.length} products

                        </p>

                    </div>

                </div>


                {/* ======================================
                    NO PRODUCTS
                ====================================== */}

                {filteredProducts.length === 0 ? (

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 py-20 text-center">

                        <div className="mx-auto max-w-md">

                            <h2 className="text-xl font-semibold text-gray-900">

                                No products found

                            </h2>


                            <p className="mt-2 text-sm text-gray-500">

                                {searchQuery ? (

                                    <>
                                        We couldn't find any products
                                        matching{" "}

                                        <span className="font-semibold text-gray-700">
                                            "{searchQuery}"
                                        </span>
                                    </>

                                ) : categoryQuery ? (

                                    <>
                                        We couldn't find any products
                                        in the{" "}

                                        <span className="font-semibold text-gray-700 capitalize">
                                            {categoryQuery}
                                        </span>{" "}
                                        category.
                                    </>

                                ) : (

                                    "There are no products available right now."

                                )}

                            </p>


                            <button
                                onClick={() =>
                                    window.history.back()
                                }
                                className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >

                                Go Back

                            </button>

                        </div>

                    </div>

                ) : (


                    /* ======================================
                        PRODUCTS
                    ====================================== */

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        {filteredProducts.map((product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                            />

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

};


export default Shop;