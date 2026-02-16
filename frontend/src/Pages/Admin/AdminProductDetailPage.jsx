import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../../Services/productService";
import { deleteProduct, updateProduct } from "../../Services/Admin/adminProductService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminPageWrapper from "../../Components/admin/AdminPageWrapper";
import ButtonLoader from "../../Components/misc/ButtonLoader";
import ConfirmModal from "../../Components/misc/ConfirmModal";

export default function AdminProductDetailPage() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [prod, setProd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const prodDetailGetter = async () => {
      try {
        setLoading(true);
        const res = await getProductDetails(id);
        setProd(res?.data?.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    prodDetailGetter();
  }, [id]);

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

  /* ---------------- UPDATE ---------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      await updateProduct(id, prod);
      toast.success("Product Updated Successfully");
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  }


  /* ---------------- DELETE ---------------- */
  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteProduct(id);
      toast.success("Product Deleted Successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }


  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <AdminPageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold">
          Loading product...
        </div>
      </AdminPageWrapper>
    );
  }

  /* ---------------- NOT FOUND ---------------- */
  if (!prod) {
    return (
      <AdminPageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center text-lg">
          Product does not exist.
        </div>
      </AdminPageWrapper>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <AdminPageWrapper>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-6"
      >

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Product
          </h2>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to products
          </button>
        </div>

        {/* IMAGE + UPLOAD */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <img
            src={preview || prod.image?.url}
            alt="product"
            className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-xl border"
          />

          <div className="flex-1 w-full">
            <label className="label">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="input"
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

        {/* ACTION BUTTONS */}
        <div className="sticky bottom-0 bg-white pt-4 flex flex-col sm:flex-row gap-3 border-t">

        <ButtonLoader
          type="submit"
          loading={saving}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
        >
          Save Changes
        </ButtonLoader>

        <ButtonLoader
          type="button"
          loading={deleting}
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition"
        >
          Delete Product
        </ButtonLoader>

        </div>

      </form>

    <ConfirmModal
      open={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={handleDelete}
      loading={deleting}
      title="Delete Product"
      message="This product will be permanently removed. This action cannot be undone."
      confirmText="Delete"
    />


    </AdminPageWrapper>
  );
}
