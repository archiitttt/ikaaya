export default function Story() {
  return (
    <section
      className="
        relative w-full overflow-hidden
        py-20 sm:py-24 md:py-32
        bg-gradient-to-br from-[#FFF2EB] via-[#FFDCDC] to-[#FFE8CD]
      "
    >
      {/* Soft decorative glow */}
      <div className="absolute -top-24 -left-24 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-rose-200/40 blur-3xl" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Left – Story Text */}
          <div className="md:w-3/5 space-y-5 sm:space-y-6">
            <span className="block text-xs sm:text-sm uppercase tracking-widest text-pink-500 text-center md:text-left">
              Handmade with Love
            </span>

            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-center md:text-left">
              Every piece we create is a quiet celebration of detail, patience, and individuality.
              Our beaded jewelry is thoughtfully handcrafted, one bead at a time, using carefully
              chosen colors and textures that feel timeless yet personal.
            </p>

            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-center md:text-left">
              Inspired by everyday beauty and made in small batches, our designs are meant to be worn
              effortlessly—whether layered or loved on their own. We believe jewelry should feel
              meaningful, not mass-produced.
            </p>

            {/* Divider */}
            <div className="flex justify-center md:justify-start pt-2">
              <span className="h-[2px] w-20 bg-pink-400 rounded-full" />
            </div>
          </div>

          {/* Right – Heading */}
          <div className="md:w-2/5 flex justify-center md:justify-end">
            <h1
              className="
                font-heading font-semibold
                text-4xl sm:text-5xl md:text-7xl lg:text-8xl
                text-pink-600
                text-center md:text-right
                leading-tight
              "
            >
              Our <br /> Story
            </h1>
          </div>

        </div>
      </div>
    </section>
  );
}
