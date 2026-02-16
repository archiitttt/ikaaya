import { createProduct } from "../../Services/Admin/adminProductService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminPageWrapper from "../../Components/admin/AdminPageWrapper";
import ButtonLoader from "../../Components/misc/ButtonLoader";

export default function AdminCreateProductPage() {

  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);

  const [prod, setProd] = useState({
    name: "",
    price: 0,
    category: "bracelet",
    description: "",
    stock: 0,
    isActive: false,
    image: ""
  });

  const [preview, setPreview] = useState(null);

  /* ---------------- HANDLE CHANGE ---------------- */
  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setProd(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    setProd(prev => ({ ...prev, [name]: value }));
  }

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    if (creating) return;

    try {
      setCreating(true);
      await createProduct(prod);
      toast.success("Product Created Successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Failed to create product");
    } finally {
      setCreating(false);
    }
  }

  return (
    <AdminPageWrapper>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-6"
      >

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Product
          </h2>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to products
          </button>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl border bg-gray-50 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center px-4">
                Image Preview
              </span>
            )}
          </div>

          <div className="flex-1 w-full">
            <label className="label">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="input"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended: square image, under 1MB
            </p>
          </div>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div>
            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              value={prod.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Price</label>
            <input
              type="number"
              name="price"
              min={0}
              value={prod.price}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              name="category"
              value={prod.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="bracelet">Bracelet</option>
              <option value="necklace">Necklace</option>
              <option value="keycharm">Keycharm</option>
              <option value="ring">Ring</option>
              <option value="earring">Earring</option>
            </select>
          </div>

          <div>
            <label className="label">Stock</label>
            <input
              type="number"
              name="stock"
              min={0}
              value={prod.stock}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Status</label>
            <select
              name="isActive"
              value={String(prod.isActive)}
              onChange={e =>
                setProd(prev => ({
                  ...prev,
                  isActive: e.target.value === "true"
                }))
              }
              className="input"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            rows={4}
            value={prod.description}
            onChange={handleChange}
            className="input resize-none"
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="sticky bottom-0 bg-white pt-4 border-t">
          <ButtonLoader
            type="submit"
            loading={creating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
          >
            Create Product
          </ButtonLoader>
        </div>

      </form>

    </AdminPageWrapper>
  );
}
