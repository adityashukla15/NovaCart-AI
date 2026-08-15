import { useEffect, useState } from "react";

import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import CategoryCard from "./CategoryCard";

import { getAllCategories } from "../../services/categoryApi";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();

                setCategories(response.data.data || []);

            } catch (error) {
                console.error(
                    "Failed to fetch categories:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="py-24">
            <Container>

                <SectionHeading
                    title="Shop by Categories"
                    subtitle="Browse our most popular collections."
                />

                {loading ? (
                    <div className="mt-12 text-center">
                        Loading categories...
                    </div>
                ) : (
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

                        {categories.map((category) => (
                            <CategoryCard
                                key={category._id}
                                category={category}
                            />
                        ))}

                    </div>
                )}

            </Container>
        </section>
    );
};

export default Categories;