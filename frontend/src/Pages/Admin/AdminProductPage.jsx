import { useEffect, useState } from "react";
import { getAllProducts } from "../../Services/productService";
import { useNavigate } from "react-router-dom";
import AdminPageWrapper from "../../Components/admin/AdminPageWrapper";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
        setProducts(res?.data?.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <AdminPageWrapper>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Product Management
        </h1>

        <button
          onClick={() => navigate("/admin/products/create")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          + Add Product
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <h2 className="text-lg font-medium text-gray-600 animate-pulse">
            Loading products...
          </h2>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Products Found
          </h2>
          <p className="text-gray-500">
            Click on "Add Product" to create your first product.
          </p>
        </div>
      )}

      {/* ---------------- DESKTOP TABLE ---------------- */}
      {!loading && products.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">S.No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map((item, idx) => (
                <tr
                  key={item._id}
                  onClick={() => navigate(`/admin/products/${item._id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4 font-semibold">{item.name}</td>
                  <td className="px-6 py-4">{item.category.toUpperCase()}</td>
                  <td className="px-6 py-4">₹{item.price}</td>
                  <td className="px-6 py-4">{item.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- MOBILE CARDS ---------------- */}
      {!loading && products.length > 0 && (
        <div className="md:hidden flex flex-col gap-4">
          {products.map((item, idx) => (
            <div
              key={item._id}
              onClick={() => navigate(`/admin/products/${item._id}`)}
              className="bg-white rounded-xl shadow p-4 active:scale-[0.98] transition cursor-pointer"
            >
              {/* Title + Status */}
              <div className="flex justify-between items-start gap-3">
                <h3 className="font-semibold text-gray-800 text-base leading-snug break-words">
                  {item.name}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0
                  ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Responsive details */}
              <div className="mt-3 grid [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))] gap-y-2 text-sm">

                <p className="min-w-0 break-words">
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  <span className="text-gray-600">{item.category}</span>
                </p>

                <p className="min-w-0 break-words">
                  <span className="font-medium text-gray-700">Price:</span>{" "}
                  <span className="text-gray-600">₹{item.price}</span>
                </p>

                <p className="min-w-0 break-words">
                  <span className="font-medium text-gray-700">Stock:</span>{" "}
                  <span className="text-gray-600">{item.stock}</span>
                </p>

                <p className="min-w-0 break-words">
                  <span className="font-medium text-gray-700">#:</span>{" "}
                  <span className="text-gray-600">{idx + 1}</span>
                </p>

              </div>
            </div>
          ))}
        </div>
      )}

    </AdminPageWrapper>
  );
}
