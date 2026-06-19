import { useEffect, useState } from "react";
import ProductCard from "../Components/product/ProductCard";
import { getAllProducts, getProductsByCategory } from "../Services/productService";
import { toast } from "react-toastify";
import Loader from "../Components/common/Loader";
import { useParams } from "react-router-dom";

export default function Shop() {

  const {category} = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productGetter = async () => {
      try {
        setLoading(true);
        const res = category ? await getProductsByCategory(category) : await getAllProducts();
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    productGetter();
  }, [category]);

  return (
    <div className="min-h-[80vh] w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader />
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <h1 className="text-center text-base sm:text-xl text-gray-600">
          No products available.
        </h1>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            xl:grid-cols-5
            gap-4 sm:gap-6 lg:gap-8
            place-items-center
          "
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              prodKey={product._id}
              image={product.image}
              product={product.name}
              description={product.description}
              price={product.price}
              isActive={product.isActive}
              productData={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
