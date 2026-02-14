import { createProduct } from "../../Services/Admin/adminProductService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminProductDetailPage() {

  const navigate = useNavigate();

  const [prod, setProd] = useState({
    name : '',
    price : 0,
    category : 'Bracelet',
    description : '',
    stock : 0,
    isActive : false,
    image : ''
  });
  const [preview, setPreview] = useState(null);

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

  async function handleSubmit(e) {
    e.preventDefault();
    try{
        await createProduct(prod);
        toast.success('Product Created Successfully');
        navigate('/admin/products');
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-6"
      >

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Create Product
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              value={prod?.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="label">Price</label>
            <input
              type="number"
              name="price"
              min={0}
              value={prod?.price}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="label">Category</label>
            <select
              name="category"
              value={prod?.category}
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

          {/* STOCK */}
          <div>
            <label className="label">Stock</label>
            <input
              type="number"
              name="stock"
              min={0}
              value={prod?.stock}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="label">Status</label>
            <select
              name="isActive"
              value={String(prod?.isActive)}
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

          {/* IMAGE */}
          <div>
            <label className="label">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="input"
            />
          </div>

        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            rows={4}
            value={prod?.description}
            onChange={handleChange}
            className="input resize-none"
            required
          />
        </div>

        {/* IMAGE PREVIEW */}
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="preview"
              className="h-40 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition"
        >
          Create Product
        </button>

      </form>
    </div>
  );
}
