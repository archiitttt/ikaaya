import { useNavigate } from "react-router-dom";

export default function ProductCard({
  prodKey,
  image,
  product,
  price,
  description,
  isActive,
}) {

  const navigate = useNavigate();

  return (
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
      <div className="w-full h-36 sm:h-40 md:h-44 lg:h-48 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
          style={{ backgroundImage: `url(${image.url})` }}
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

      </div>
    </div>
  );
}
