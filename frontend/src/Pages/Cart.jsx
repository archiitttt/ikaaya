import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import Loader from "../Components/common/Loader";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getProductImageUrl } from "../Utils/imageOptimization";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, cartLoading, cartError, updateQuantity, removeFromCart, clearCart } = useCart();
  const [processingItems, setProcessingItems] = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setProcessingItems(prev => new Set([...prev, productId]));
    try {
      await updateQuantity(productId, newQuantity);
      toast.success("Quantity updated");
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
      toast.success("Item removed from cart");
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

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
        toast.success("Cart cleared");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to clear cart");
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (cartLoading) return <Loader />;

  return (
    <>
      <section className="min-h-[85vh] w-full bg-[#FFF8FA] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
            Shopping Cart
          </h1>

          {cartError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {cartError}
            </div>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-6">
                Your cart is empty
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-pink-400 hover:bg-pink-500 text-white px-8 py-3 rounded-lg transition font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <div
                        key={item._id || item.productId._id}
                        className="p-6 hover:bg-gray-50 transition"
                      >
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                            {item.productId?.image?.url && (
                              <img
                                src={getProductImageUrl(item.productId.image.url)}
                                alt={item.productId?.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {item.productId?.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.productId?.description}
                            </p>
                            <p className="text-lg font-bold text-pink-500 mt-2">
                              ₹{item.productId?.price?.toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-end justify-between">
                            <button
                              onClick={() => handleRemoveItem(item.productId._id)}
                              disabled={processingItems.has(item.productId._id)}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50 transition"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>

                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId._id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={processingItems.has(item.productId._id) || item.quantity <= 1}
                                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition"
                              >
                                <FontAwesomeIcon icon={faMinus} />
                              </button>
                              <span className="px-4 py-2 font-medium">
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
                                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition"
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </button>
                            </div>

                            <p className="font-semibold text-gray-900 text-right">
                              ₹{(item.productId?.price * item.quantity)?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Cart Button */}
                {cart.length > 0 && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (10%)</span>
                      <span className="font-medium">₹{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate("/shop")}
                    className="w-full border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-3 rounded-lg transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
