import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import CategoryCard from "./CategoryCard";

import { categories } from "../../data/categoryData";

const Categories = () => {
  return (
    <section className="py-24">
      <Container>

        <SectionHeading
          title="Shop by Categories"
          subtitle="Browse our most popular collections."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

      </Container>
    </section>
  );
};

export default Categories;