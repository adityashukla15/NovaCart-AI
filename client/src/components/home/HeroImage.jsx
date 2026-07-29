
const HeroImage = () => {
  return (
    <div className="relative hidden lg:flex items-center justify-center">
      {/* Background Circle */}
      <div className="absolute w-[550px] h-[550px] rounded-full bg-gray-200"></div>

      {/* Image */}
      <img
        src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800"
        alt="Hero"
        className="relative z-10 max-h-[700px] w-auto object-contain"
      />
    </div>
  );
};

export default HeroImage;
