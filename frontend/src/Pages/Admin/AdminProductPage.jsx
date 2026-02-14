import { useEffect, useState } from "react";
import { getAllProducts } from "../../Services/productService";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex-1 bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Product Management
        </h1>

        <button
          onClick={() => navigate("/admin/products/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
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

      {/* Table */}
      {!loading && products.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                  className="hover:bg-gray-50 cursor-pointer transition duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {idx + 1}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.category}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    ₹{item.price}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.stock}
                  </td>

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
    </div>
  );
}
