import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminPageWrapper from "../../Components/admin/AdminPageWrapper";
import ButtonLoader from "../../Components/misc/ButtonLoader";
import { createCategory, updateCategory, getCategoryById } from "../../Services/categoryService";
import { useEffect } from "react";

export default function AdminCreateCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await getCategoryById(id);
      if (data) {
        setCategory(data);
        setIsEdit(true);
      }
    } catch (error) {
      toast.error("Failed to fetch category");
      navigate("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit) {
        await updateCategory(id, category);
        toast.success("Category updated successfully");
      } else {
        await createCategory(category);
        toast.success("Category created successfully");
      }
      
      navigate("/admin/categories");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageWrapper>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* HEADER */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Category" : "Create Category"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? "Update category details" : "Add a new product category"}
          </p>
        </div>

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            placeholder="e.g., Necklace, Bracelet, Ring"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Displayed on your storefront
          </p>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            placeholder="e.g., Beautiful handmade bracelets crafted with love"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional. Helps customers understand the category
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 border-t pt-6">
          <ButtonLoader
            type="submit"
            loading={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
          >
            {isEdit ? "Update Category" : "Create Category"}
          </ButtonLoader>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminPageWrapper>
  );
}