import { useEffect, useState } from "react";

import { getAllProducts } from "../services/productApi";

import ProductCard from "../components/product/ProductCard";


const Shop = () => {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


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


            // Backend response handle

            const productData =
                response.data?.data?.products ||
                response.data?.data ||
                [];


            setProducts(productData);

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
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center">

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

            <div className="min-h-screen flex items-center justify-center">

                <p className="text-red-500">
                    {error}
                </p>

            </div>

        );

    }


    // ======================================
    // SHOP PAGE
    // ======================================

    return (

        <div className="min-h-screen px-6 py-10">

            <div className="mx-auto max-w-7xl">


                {/* ================= HEADER ================= */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Shop
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Explore our latest products
                    </p>

                </div>


                {/* ================= PRODUCTS ================= */}

                {products.length === 0 ? (

                    <div className="py-20 text-center">

                        <p className="text-gray-500">
                            No products found.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        {products.map((product) => (

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