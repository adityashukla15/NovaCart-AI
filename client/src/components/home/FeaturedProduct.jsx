import { useEffect, useState } from "react";

import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import ProductCard from "../product/ProductCard";

import { getAllProducts } from "../../services/productApi";

const FeaturedProducts = () => {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ======================================
    // FETCH FEATURED PRODUCTS
    // ======================================

    const fetchFeaturedProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getAllProducts();

            console.log(
                "Featured Products API:",
                response.data
            );

            const productData =
                response.data?.data?.products ||
                response.data?.data ||
                [];

            // Only products marked as featured
            const featuredProducts = productData.filter(
                (product) =>
                    product.isFeatured === true ||
                    product.featured === true
            );

            setProducts(featuredProducts);

        } catch (error) {

            console.error(
                "FEATURED PRODUCTS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load featured products"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // LOAD PRODUCTS
    // ======================================

    useEffect(() => {

        fetchFeaturedProducts();

    }, []);


    // ======================================
    // RENDER
    // ======================================

    return (

        <section className="bg-gray-50 py-24">

            <Container>

                <SectionHeading
                    title="Featured Products"
                    subtitle="Explore our most loved products."
                />


                {/* ================= LOADING ================= */}

                {loading && (

                    <div className="py-16 text-center">

                        <p className="text-sm text-gray-500">
                            Loading featured products...
                        </p>

                    </div>

                )}


                {/* ================= ERROR ================= */}

                {!loading && error && (

                    <div className="py-16 text-center">

                        <p className="text-sm text-red-500">
                            {error}
                        </p>

                    </div>

                )}


                {/* ================= PRODUCTS ================= */}

                {!loading &&
                    !error &&
                    products.length > 0 && (

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

                            {products.map((product) => (

                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />

                            ))}

                        </div>

                    )}


                {/* ================= NO PRODUCTS ================= */}

                {!loading &&
                    !error &&
                    products.length === 0 && (

                        <div className="py-16 text-center">

                            <p className="text-gray-500">
                                No featured products available.
                            </p>

                        </div>

                    )}

            </Container>

        </section>

    );

};

export default FeaturedProducts;