import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getProductImageUrl } from "../../Utils/imageOptimization";

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, cartLoading, removeFromCart, updateQuantity } = useCart();
  const [processingItems, setProcessingItems] = useState(new Set());

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setProcessingItems(prev => new Set([...prev, productId]));
    try {
      await updateQuantity(productId, newQuantity);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    setProcessingItems(prev => new Set([...prev, productId]));
    try {
      await removeFromCart(productId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-700 hover:text-pink-500 transition"
        aria-label="Open cart sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {cartItemsCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FontAwesomeIcon icon={faX} size="lg" />
          </button>
        </div>

        {/* Cart Content */}
        {cartLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-6">
            <p className="text-gray-600 text-center mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              onClick={() => setIsOpen(false)}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] px-6 py-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id || item.productId._id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    {item.productId?.image?.url && (
                      <img
                        src={getProductImageUrl(item.productId.image.url)}
                        alt={item.productId?.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {item.productId?.name}
                    </h3>
                    <p className="text-pink-500 font-bold text-sm">
                      ₹{item.productId?.price?.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId._id,
                            item.quantity - 1
                          )
                        }
                        disabled={
                          processingItems.has(item.productId._id) ||
                          item.quantity <= 1
                        }
                        className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition"
                      >
                        <FontAwesomeIcon icon={faMinus} size="xs" />
                      </button>
                      <span className="px-2 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId._id,
                            item.quantity + 1
                          )
                        }
                        disabled={processingItems.has(item.productId._id)}
                        className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition"
                      >
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                      </button>

                      <button
                        onClick={() => handleRemoveItem(item.productId._id)}
                        disabled={processingItems.has(item.productId._id)}
                        className="ml-auto text-red-500 hover:text-red-700 disabled:opacity-50 transition"
                      >
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 space-y-3">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-pink-500">₹{cartTotal.toFixed(2)}</span>
              </div>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition"
              >
                View Cart
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
