import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {

    const navigate = useNavigate();

    const handleCategoryClick = () => {
        navigate(
            `/shop?category=${encodeURIComponent(category.slug)}`
        );
    };

    return (
        <div
            onClick={handleCategoryClick}
            className="group cursor-pointer rounded-3xl border bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >

            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-2xl font-bold">
                        {category.name?.charAt(0)}
                    </span>
                )}
            </div>

            <h3 className="mt-6 text-center text-xl font-semibold">
                {category.name}
            </h3>

        </div>
    );
};

export default CategoryCard;