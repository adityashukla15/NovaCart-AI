import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import FeaturedProducts from "../../components/home/FeaturedProduct"
import PromoBanner from "../../components/home/PromoBanner";
import WhyChooseUs from "../../components/home/WhyChooseUs";

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />  
      <PromoBanner/>
      <WhyChooseUs />
    </>
  );
};

export default Home;