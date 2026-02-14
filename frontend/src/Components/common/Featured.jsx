import featuredImg from '../../Assets/images/featuredBG.png';
import FeaturedProductCard from '../product/FeaturedProductCard';
import bracelet from '../../Assets/images/bracelet.png';
import necklace from '../../Assets/images/necklace.png';
import keycharm from '../../Assets/images/keycharm.png';
import PinkButton from '../misc/PinkButton';
import { useNavigate } from "react-router";

export default function Featured() {

  const navigate = useNavigate();

  return (
    <section
      className="
        relative w-full overflow-x-hidden
        py-20 sm:py-24 md:py-32
        bg-cover bg-center
      "
      style={{ backgroundImage: `url(${featuredImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        
        {/* Heading */}
        <div className="text-center mb-14 sm:mb-16">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black">
            Featured Collection
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-gray-500 text-sm sm:text-base">
            Discover our best-selling, handcrafted jewelry made with love and care
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-16">
          <FeaturedProductCard image={bracelet} product="Bracelets" category={'bracelet'}/>
          <FeaturedProductCard image={necklace} product="Necklaces" category={'necklace'}/>
          <FeaturedProductCard image={keycharm} product="Keycharms" category={'keycharms'}/>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <PinkButton content="View All" doThis={()=>(navigate('/shop'))}/>
        </div>
      </div>
    </section>
  );
}
