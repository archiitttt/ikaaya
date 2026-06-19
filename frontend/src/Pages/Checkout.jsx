import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import orderService from "../Services/orderService";
import Loader from "../Components/common/Loader";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCreditCard,
  faShoppingBag,
  faEnvelope,
  faArrowLeft,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getProductImageUrl } from "../Utils/imageOptimization";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, reloadCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cart, orderPlaced, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(address.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!address.house.trim())
      newErrors.house = "House/flat/building is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state) newErrors.state = "State is required";
    if (!address.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[0-9]{6}$/.test(address.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderData = {
      items: cart.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      address,
      paymentMethod,
    };

    try {
      setLoading(true);
      const res = await orderService.createOrder(orderData);
      setPlacedOrder(res.data);
      setOrderPlaced(true);
      await reloadCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);

  if (loading) return <Loader />;

  // ─── Order Success View ───
  if (orderPlaced && placedOrder) {
    return (
      <section className="min-h-[85vh] w-full bg-[#FFF8FA] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 text-4xl"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Order Placed Successfully!
            </h1>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Thank you for your order. We've sent a confirmation email with your
              order details.
            </p>

            {/* Email Notice */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 mb-8 text-left">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-pink-500 mt-1 text-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    How it works
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Right now, we only accept orders via email.{" "}
                    <strong className="text-pink-600">
                      We will reach back to you regarding payments.
                    </strong>{" "}
                    Please check your email for order confirmation and further
                    instructions.
                  </p>
                </div>
              </div>
            </div>

            {/* Order ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono font-bold text-gray-900 text-lg">
                #{placedOrder._id?.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Checkout Form ───
  return (
    <section className="min-h-[85vh] w-full bg-[#FFF8FA] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="font-medium">Back to Cart</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
          Checkout
        </h1>

        {/* Email Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 mb-8">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-amber-500 mt-0.5 text-lg flex-shrink-0"
            />
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>Please note:</strong> Right now, we only accept orders via
              email. Once you place your order, we will reach back to you
              regarding payments. A confirmation email will be sent to your
              registered email address.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Left Column: Address + Payment ─── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-pink-500"
                  />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full p-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                        errors.fullName
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      maxLength={10}
                      className={`w-full p-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                        errors.phone
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={`w-full p-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                        errors.pincode
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>

                  {/* House / Building */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      House / Flat / Building *
                    </label>
                    <input
                      type="text"
                      name="house"
                      value={address.house}
                      onChange={handleChange}
                      placeholder="House no., building name, street"
                      className={`w-full p-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                        errors.house
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.house && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.house}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className={`w-full p-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                        errors.city
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      State *
                    </label>
                    <select
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      className={`w-full p-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition bg-white ${
                        errors.state
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="text-pink-500"
                  />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition ${
                      paymentMethod === "COD"
                        ? "border-pink-400 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-pink-500 w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-gray-500">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition ${
                      paymentMethod === "UPI"
                        ? "border-pink-400 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-pink-500 w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">UPI</p>
                      <p className="text-sm text-gray-500">
                        We'll send you UPI payment details via email
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ─── Right Column: Order Summary ─── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faShoppingBag}
                    className="text-pink-500"
                  />
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item._id || item.productId._id}
                      className="flex gap-3"
                    >
                      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.productId?.image?.url && (
                          <img
                            src={getProductImageUrl(item.productId.image.url)}
                            alt={item.productId?.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productId?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                        ₹
                        {(
                          item.productId?.price * item.quantity
                        )?.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                    </span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-pink-500">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-semibold py-3.5 rounded-lg transition text-base"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>

                {/* Info */}
                <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                  By placing this order, you agree to our terms. We will contact
                  you via email regarding payment.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
