import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";

const HeroContent = () => {
  return (
    <div className="max-w-xl">

      <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
        NEW COLLECTION 2026
      </span>

      <h1 className="mt-8 text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
        Discover
        <br />
        Premium
        <br />
        Fashion.
      </h1>

      <p className="mt-6 text-lg leading-8 text-gray-500">
        Elevate your wardrobe with timeless fashion designed for modern
        lifestyles. Discover exclusive collections with AI-powered shopping.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">

        <Button>
          Shop Now
        </Button>

        <Button variant="outline">
          Explore
          <ArrowRight className="ml-2" size={18}/>
        </Button>

      </div>

    </div>
  );
};

export default HeroContent;