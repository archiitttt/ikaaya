import { useState, useEffect } from 'react';
import featuredImg from '../../Assets/images/featuredBG.png';
import FeaturedProductCard from '../product/FeaturedProductCard';
import bracelet from '../../Assets/images/bracelet.png';
import necklace from '../../Assets/images/necklace.png';
import keycharm from '../../Assets/images/keycharm.png';
import PinkButton from '../misc/PinkButton';
import { useNavigate } from "react-router";
import { getAllCategories } from '../../Services/categoryService';

// Mapping of category names to display names and images
const CATEGORY_IMAGE_MAP = {
  bracelet: { displayName: 'Bracelets', image: bracelet },
  necklace: { displayName: 'Necklaces', image: necklace },
  keycharm: { displayName: 'Keycharms', image: keycharm },
  ring: { displayName: 'Rings', image: bracelet }, // Fallback to bracelet image
  earring: { displayName: 'Earrings', image: necklace } // Fallback to necklace image
};

export default function Featured() {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section
      className="
        relative w-full overflow-x-hidden
        py-20 sm:py-24 md:py-32
        bg-cover bg-center
        will-change-transform
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
        {!loading && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-16">
            {categories.slice(0, 3).map((category) => {
              const categoryInfo = CATEGORY_IMAGE_MAP[category.name] || {
                displayName: category.name.charAt(0).toUpperCase() + category.name.slice(1),
                image: bracelet
              };
              
              return (
                <FeaturedProductCard 
                  key={category._id}
                  image={categoryInfo.image} 
                  product={categoryInfo.displayName} 
                  category={category.name}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-16">
            <FeaturedProductCard image={bracelet} product="Bracelets" category={'bracelet'}/>
            <FeaturedProductCard image={necklace} product="Necklaces" category={'necklace'}/>
            <FeaturedProductCard image={keycharm} product="Keycharms" category={'keycharm'}/>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <PinkButton content="View All" doThis={()=>(navigate('/shop'))}/>
        </div>
      </div>
    </section>
  );
}
