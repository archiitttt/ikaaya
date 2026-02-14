import { useNavigate } from 'react-router'

export default function FeaturedProductCard({ image, product, category }) {

  const navigate = useNavigate();

  return (
    <div
      className="
        w-full
        max-w-[15rem] sm:max-w-xs lg:max-w-sm
        mx-auto

        bg-red-100 flex flex-col
        rounded-lg overflow-hidden
        p-2 sm:p-3

        shadow-md hover:shadow-xl
        hover:-translate-y-1
        transition-all duration-300 ease-out
        cursor-pointer
      "

      onClick={()=>navigate(`/shop/category/${category}`)}
    >
      {/* Product Image */}
      <div
        className="w-full aspect-square bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Product Name */}
      <div className="flex items-center py-3 sm:py-4 font-heading">
        <h2 className="text-lg sm:text-xl lg:text-2xl">
          {product}.
        </h2>
      </div>
    </div>
  );
}
