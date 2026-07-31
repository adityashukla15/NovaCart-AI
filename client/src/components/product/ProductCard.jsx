import { Heart, Star, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";

const ProductCard = ({ product }) => {
  return (
    <div className="group overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <div className="relative overflow-hidden">

        <img
          src={product.image}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs text-white">
          {product.badge}
        </span>

        <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow">
          <Heart size={18} />
        </button>

      </div>

      <div className="p-5">

        <p className="text-sm text-gray-500">
          {product.category}
        </p>

        <h3 className="mt-2 text-xl font-semibold">
          {product.name}
        </h3>

        <div className="mt-3 flex">
          {[...Array(product.rating)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill="gold"
              color="gold"
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">

          <span className="text-xl font-bold">
            ${product.price}
          </span>

          <span className="text-gray-400 line-through">
            ${product.oldPrice}
          </span>

        </div>

        <Button className="mt-6 w-full">
          <ShoppingCart size={18} className="mr-2" />
          Add To Cart
        </Button>

      </div>

    </div>
  );
};

export default ProductCard;