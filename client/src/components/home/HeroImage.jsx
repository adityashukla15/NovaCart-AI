const HeroImage = () => {
    return (
        <div className="relative hidden h-[650px] w-full items-center justify-center lg:flex">

            {/* Background Circle */}
            <div className="absolute h-[520px] w-[520px] rounded-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300" />

            {/* Decorative Circle */}
            <div className="absolute right-12 top-16 h-24 w-24 rounded-full border border-gray-200" />

            <div className="absolute bottom-20 left-10 h-16 w-16 rounded-full bg-gray-100" />

            {/* Image */}
            <div className="relative z-10 h-[600px] w-[460px] overflow-hidden rounded-[3rem]">

                <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000"
                    alt="Premium fashion collection"
                    className="
                        h-full
                        w-full
                        object-cover
                        object-center
                        transition-transform
                        duration-700
                        hover:scale-105
                    "
                />

            </div>

        </div>
    );
};

export default HeroImage;