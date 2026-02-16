import featuredImg from "../Assets/images/featuredBG.png";

export default function ContactPage() {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center py-24"
      style={{ backgroundImage: `url(${featuredImg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        {/* Heading */}
        <div className="mb-14">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-black">
            Contact Us
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base leading-relaxed">
            Looking for something made just for you? We happily take custom orders —
            whether it's a personalized gift, matching set, or a unique design you
            have in mind. Reach out to us through any of the options below and we’ll
            work with you to create something special.
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md p-10 space-y-6 text-gray-700">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Phone</p>
            <p className="text-lg font-medium mt-1">+91 98883 38480</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Email</p>
            <p className="text-lg font-medium mt-1">ikaayaco@gmail.com</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Instagram</p>
            <p className="text-lg font-medium mt-1"><a target="_blank" href="https://www.instagram.com/ikaaya.co">@ikaaya.co</a></p>
          </div>
        </div>

        <p className="mt-10 text-gray-500 text-sm">
          We usually respond within a few hours on Instagram and within 24 hours via email.
        </p>
      </div>
    </section>
  );
}
