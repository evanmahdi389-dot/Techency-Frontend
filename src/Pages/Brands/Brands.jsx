const Brands = () => {
  const brands = [
    { id: 1, name: "Logo 1" },
    { id: 2, name: "Logo 2" },
    { id: 3, name: "Logo 3" },
    { id: 4, name: "Logo 4" },
    { id: 5, name: "Logo 5" },
    { id: 6, name: "Logo 6" },
    { id: 7, name: "Logo 7" },
    { id: 8, name: "Logo 8" },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-16">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
      <div className="absolute left-0 top-1/2 h-16 w-24 -translate-y-1/2 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      <div className="absolute right-0 top-1/2 h-16 w-24 -translate-y-1/2 bg-gradient-to-l from-black via-black/70 to-transparent"></div>

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <h3 className="mb-8 text-2xl font-semibold text-white">
          Brands That <span className="text-red-500">Trust Us</span>
        </h3>

        <div className="relative overflow-hidden">
          <div className="flex animate-[marquee_22s_linear_infinite] items-center justify-start gap-8 md:gap-12">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-300 grayscale transition-all duration-500 hover:grayscale-0"
              >
                {brand.name}
              </div>
            ))}
            {brands.map((brand) => (
              <div
                key={`${brand.id}-dup`}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-300 grayscale transition-all duration-500 hover:grayscale-0"
              >
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;