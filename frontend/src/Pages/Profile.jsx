import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { logoutUser } from "../Services/authService";
import orderService from "../Services/orderService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/common/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faUser, faSignOutAlt, faClock, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await orderService.getMyOrders();
      setOrders(data.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to logout");
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'packed': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-amber-600 bg-amber-50 border-amber-200'; // placed/pending
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return faCheckCircle;
      case 'cancelled': return faTimesCircle;
      default: return faClock;
    }
  };

  if (!user) return <Loader />;

  return (
    <section className="min-h-[85vh] w-full bg-[#FFF8FA] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
          My Account
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 text-xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                    activeTab === "orders" 
                    ? "bg-pink-50 text-pink-600" 
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faBox} />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                    activeTab === "profile" 
                    ? "bg-pink-50 text-pink-600" 
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} />
                  Account Details
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-medium mt-4"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                
                {loadingOrders ? (
                  <div className="py-12 flex justify-center"><Loader /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faBox} className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                    <button
                      onClick={() => navigate("/shop")}
                      className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2.5 rounded-lg transition font-medium"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-pink-200 transition bg-white shadow-sm">
                        
                        {/* Order Header */}
                        <div className="bg-gray-50 p-4 sm:p-5 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                            <p className="font-medium text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                            <p className="font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                            <p className="font-mono text-gray-600">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                            <FontAwesomeIcon icon={getStatusIcon(order.orderStatus)} />
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 sm:p-5">
                          <div className="divide-y divide-gray-100">
                            {order.items.map((item, index) => (
                              <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="font-semibold text-gray-900">
                                  ₹{(item.quantity * item.price).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Order Details Footer */}
                          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-sm text-gray-600">
                            <div>
                              <span className="font-semibold text-gray-900 mr-2">Payment Method:</span>
                              {order.paymentMethod}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 mr-2">Payment Status:</span>
                              <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
                
                <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-100">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-100">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-100 capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}