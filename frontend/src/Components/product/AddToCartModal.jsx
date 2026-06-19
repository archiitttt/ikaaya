import { useState } from "react";
import { useCart } from "../../Context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getProductImageUrl } from "../../Utils/imageOptimization";

export default function AddToCartModal({ isOpen, product, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= (product?.stock || 100)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCart(product._id, quantity);
      toast.success(`${product.name} added to cart!`);
      onSuccess?.();
      onClose();
      setQuantity(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add to Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faX} size="lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Product Image & Details */}
          <div>
            {product.image?.url && (
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={getProductImageUrl(product.image.url)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {product.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-pink-500">
                ₹{product.price?.toFixed(2)}
              </p>
              <span className={`text-sm font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Quantity
              </label>
              
              <div className="flex items-center justify-between border border-gray-300 rounded-lg w-full">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isLoading}
                  className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) handleQuantityChange(val);
                  }}
                  min="1"
                  max={product.stock}
                  className="w-20 text-center font-bold text-lg border-none outline-none"
                  disabled={isLoading}
                />
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || isLoading}
                  className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Subtotal:</span>
                  <span>₹{(product.price * quantity)?.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-pink-500">₹{(product.price * quantity)?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock <= 0}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
