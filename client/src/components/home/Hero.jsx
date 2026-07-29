import Container from "../ui/Container";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const Hero = () => {
  return (
    <section className="bg-[#F8F8F8]">
      <Container>
        <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 items-center gap-12 py-10 lg:grid-cols-2">
          <HeroContent />
          <HeroImage />
        </div>
      </Container>
    </section>
  );
};

export default Hero;