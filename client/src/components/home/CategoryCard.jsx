import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {

    const navigate = useNavigate();

    const Icon = category.icon;

    const handleCategoryClick = () => {

        navigate(
            `/shop?category=${encodeURIComponent(category.title)}`
        );

    };

    return (

        <div
            onClick={handleCategoryClick}
            className="group cursor-pointer rounded-3xl border bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-black">

                <Icon
                    size={38}
                    className="transition group-hover:text-white"
                />

            </div>

            <h3 className="mt-6 text-center text-xl font-semibold">

                {category.title}

            </h3>

        </div>

    );
};

export default CategoryCard;