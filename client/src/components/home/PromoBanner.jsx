import Container from "../ui/Container";
import Button from "../ui/Button";

const PromoBanner = () => {
  return (
    <section className="py-24">
      <Container>
        <div className="overflow-hidden rounded-[40px] bg-black text-white">
          <div className="grid items-center gap-10 p-10 md:grid-cols-2 md:p-16">

            {/* Left Content */}
            <div>
              <p className="text-sm uppercase tracking-[4px] text-gray-300">
                Limited Time Offer
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-6xl">
                Summer Sale
                <br />
                Up To 50% OFF
              </h2>

              <p className="mt-6 max-w-md text-gray-300">
                Upgrade your wardrobe with premium fashion at unbeatable prices.
              </p>

              <Button className="mt-8 bg-white !text-black hover:bg-gray-200">
                Shop Now
              </Button>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800"
                alt="Sale Banner"
                className="max-h-[450px] rounded-3xl object-cover"
              />
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};

export default PromoBanner;