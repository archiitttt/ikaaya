import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCardImageUrl } from "../../Utils/imageOptimization";
import AddToCartModal from "./AddToCartModal";

export default function ProductCard({
  prodKey,
  image,
  product,
  price,
  description,
  isActive,
  productData,
}) {

  const navigate = useNavigate();
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const optimizedImageUrl = getCardImageUrl(image?.url);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setShowAddToCartModal(true);
  };

  return (
    <>
      <div
        className="
          relative
          w-full
          max-w-[16rem] sm:max-w-[17rem] lg:max-w-[18rem]
          bg-white
          rounded-2xl
          border border-gray-200
          shadow-md hover:shadow-xl hover:-translate-y-1
          transition-all duration-300
          flex flex-col
          overflow-hidden
        "
        onClick={()=>navigate(`/shop/${prodKey}`)}
      >
        {/* Inactive Overlay */}
        {!isActive && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-xl">
              Out of Stock
            </span>
          </div>
        )}

        {/* Image */}
        <div className="w-full h-36 sm:h-40 md:h-44 lg:h-48 overflow-hidden bg-gray-100">
          <img
            src={optimizedImageUrl}
            alt={product}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-3 sm:px-4 py-3 sm:py-4 gap-1.5 sm:gap-2">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
            {product}
          </h2>

          <p className="text-base sm:text-lg font-bold text-pink-600">
            ₹{price}
          </p>

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {description}
          </p>

          {/* Add to Cart Button */}
          {isActive && (
            <button
              onClick={handleAddToCart}
              className="mt-auto bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm font-semibold py-2 rounded-lg transition"
            >
              Add to Cart
            </button>
          )}

        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showAddToCartModal}
        product={productData}
        onClose={() => setShowAddToCartModal(false)}
        onSuccess={() => {}}
      />
    </>
  );
}
