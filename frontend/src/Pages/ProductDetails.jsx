import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetails } from "../Services/productService";
import Loader from "../Components/common/Loader";
import AddToCartModal from "../Components/product/AddToCartModal";
import { toast } from "react-toastify";
import { getProductImageUrl } from "../Utils/imageOptimization";

export default function ProductDetails() {
  const { id } = useParams();

  const [prodData, setProdData] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  useEffect(() => {
    const prodDataGetter = async () => {
      try {
        setLoading(true);
        const res = await getProductDetails(id);
        const product = res.data.data;
        setProdData(product);
        setActiveImage(getProductImageUrl(product.image.url));
      } catch (err) {
        console.error(err);
        toast.error("Unable to load this piece");
      } finally {
        setLoading(false);
      }
    };

    prodDataGetter();
  }, [id]);

  return (
    <section className="min-h-[85vh] w-full bg-[#FFF8FA]">
      {loading && <Loader />}

      {!loading && !prodData && (
        <p className="text-center text-pink-500 pt-24">
          This piece is currently unavailable.
        </p>
      )}

      {!loading && prodData && (<>
        <div
          className="
            max-w-6xl mx-auto
            px-5 sm:px-8 lg:px-16
            py-20
            grid grid-cols-1 lg:grid-cols-2
            gap-14
          "
        >
          {/* 🌸 LEFT — Product Images */}
          <div className="flex flex-col gap-5">
            <div className="aspect-square w-full bg-white rounded-3xl overflow-hidden shadow-sm">
              <img
                src={activeImage}
                alt={prodData.name}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 🌸 RIGHT — Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs tracking-widest text-pink-500 uppercase">
                {prodData.category}
              </p>

              <h1 className="font-heading text-4xl sm:text-5xl text-pink-700 mt-2">
                {prodData.name}
              </h1>
            </div>

            <p className="text-gray-600 leading-relaxed max-w-lg">
              {prodData.description}
            </p>

            <div className="text-2xl font-medium text-pink-600">
              ₹{prodData.price}
            </div>

            {/* Availability */}
            {prodData.isActive && prodData.stock > 0 ? (
              <p className="text-sm text-gray-500">
                Lovingly handcrafted · {prodData.stock} pieces available
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                This piece is currently unavailable.
              </p>
            )}

            {/* Add to Cart Button */}
            {prodData.isActive && prodData.stock > 0 && (
              <button
                onClick={() => setShowAddToCartModal(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition w-full sm:w-auto"
              >
                Add to Cart
              </button>
            )}

            {/* Brand Note */}
            <p className="text-xs text-gray-400 pt-8 max-w-md leading-relaxed">
              Every Ikaaya creation is thoughtfully handcrafted, celebrating
              warmth, individuality, and timeless beauty.
            </p>
          </div>
        </div>
        </>
      )}

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showAddToCartModal}
        product={prodData}
        onClose={() => setShowAddToCartModal(false)}
        onSuccess={() => {}}
      />
    </section>
  );
}
