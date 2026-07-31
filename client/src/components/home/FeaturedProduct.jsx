import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import ProductCard from "../product/ProductCard";

import { products } from "../../data/productData";

const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-gray-50">

      <Container>

        <SectionHeading
          title="Featured Products"
          subtitle="Explore our most loved products."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </Container>

    </section>
  );
};

export default FeaturedProducts;