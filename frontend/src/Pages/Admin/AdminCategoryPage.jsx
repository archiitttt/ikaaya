import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminPageWrapper from "../../Components/admin/AdminPageWrapper";
import { getAllCategories, deleteCategory } from "../../Services/categoryService";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";

export default function AdminCategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      setDeleting(id);
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminPageWrapper>
      <div className="max-w-4xl">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Categories
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage product categories
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/categories/create")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition"
          >
            <FiPlus /> Create Category
          </button>
        </div>

        {/* CATEGORIES TABLE */}
        {loading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No categories found. Create one to get started!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Description</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800 capitalize">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {cat.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/categories/edit/${cat._id}`)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={deleting === cat._id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === cat._id ? "Deleting..." : <FiTrash2 size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPageWrapper>
  );
}