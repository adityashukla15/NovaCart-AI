import { Heart, Star, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {

    const navigate = useNavigate();

    const image =
        product.images?.[0] ||
        "https://via.placeholder.com/500x500?text=No+Image";

    const category =
        product.category?.name || "Product";

    const rating =
        product.averageRating || product.rating || 0;

    const hasDiscount =
        product.discountPrice &&
        product.discountPrice < product.price;


    // ======================================
    // PRODUCT DETAILS
    // ======================================

    const handleProductClick = () => {

        navigate(`/products/${product._id}`);

    };


    // ======================================
    // WISHLIST
    // ======================================

    const handleWishlist = (e) => {

        e.stopPropagation();

        // Wishlist API next phase
        console.log(
            "Wishlist:",
            product._id
        );

    };


    // ======================================
    // ADD TO CART
    // ======================================

    const handleAddToCart = (e) => {

        e.stopPropagation();

        // Cart API next phase
        console.log(
            "Add to cart:",
            product._id
        );

    };


    return (

        <div
            onClick={handleProductClick}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >

            {/* ================= IMAGE ================= */}

            <div className="relative overflow-hidden">

                <img
                    src={image}
                    alt={product.title}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                />


                {/* Featured Badge */}

                {product.isFeatured && (

                    <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs text-white">
                        Featured
                    </span>

                )}


                {/* Wishlist */}

                <button
                    type="button"
                    onClick={handleWishlist}
                    className="absolute right-4 top-4 rounded-full bg-white p-2 shadow transition hover:scale-110"
                >

                    <Heart size={18} />

                </button>

            </div>


            {/* ================= PRODUCT INFO ================= */}

            <div className="p-5">


                {/* Category */}

                <p className="text-sm text-gray-500">
                    {category}
                </p>


                {/* Title */}

                <h3 className="mt-2 line-clamp-1 text-xl font-semibold">
                    {product.title}
                </h3>


                {/* Brand */}

                {product.brand && (

                    <p className="mt-1 text-sm text-gray-400">
                        {product.brand}
                    </p>

                )}


                {/* Rating */}

                <div className="mt-3 flex items-center gap-1">

                    {[...Array(5)].map((_, index) => (

                        <Star
                            key={index}
                            size={16}
                            fill={
                                index < Math.round(rating)
                                    ? "gold"
                                    : "none"
                            }
                            color="gold"
                        />

                    ))}

                    <span className="ml-1 text-sm text-gray-500">
                        ({rating})
                    </span>

                </div>


                {/* ================= PRICE ================= */}

                <div className="mt-4 flex items-center gap-3">

                    <span className="text-xl font-bold">
                        ₹
                        {product.discountPrice ||
                            product.price}
                    </span>


                    {hasDiscount && (

                        <span className="text-gray-400 line-through">
                            ₹{product.price}
                        </span>

                    )}

                </div>


                {/* ================= STOCK ================= */}

                <p className="mt-2 text-sm">

                    {product.stock > 0 ? (

                        <span className="text-green-600">
                            In Stock
                        </span>

                    ) : (

                        <span className="text-red-500">
                            Out of Stock
                        </span>

                    )}

                </p>


                {/* ================= CART ================= */}

                <Button
                    onClick={handleAddToCart}
                    className="mt-6 w-full"
                    disabled={product.stock <= 0}
                >

                    <ShoppingCart
                        size={18}
                        className="mr-2"
                    />

                    {product.stock > 0
                        ? "Add To Cart"
                        : "Out of Stock"}

                </Button>

            </div>

        </div>

    );

};

export default ProductCard;