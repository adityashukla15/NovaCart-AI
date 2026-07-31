import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import Container from "../ui/Container";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On all orders over $99",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% secure checkout",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Always here to help",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-gray-500">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUs;