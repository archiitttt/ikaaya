import {
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiPlus,
  FiBarChart2
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminPageWrapper from "../../components/admin/AdminPageWrapper";

export default function AdminDashboard() {

  const navigate = useNavigate();

  return (
    <AdminPageWrapper>

      <div className="flex flex-col gap-8 max-w-5xl">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 truncate">
              Dashboard
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Welcome back, Admin.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/products/create")}
            className="self-start lg:self-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition text-sm sm:text-base"
          >
            + Add Product
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="Total Products" value="128" icon={<FiBox />} color="bg-blue-500" />
          <StatCard title="Orders" value="542" icon={<FiShoppingCart />} color="bg-green-500" />
          <StatCard title="Customers" value="1,204" icon={<FiUsers />} color="bg-purple-500" />
          <StatCard title="Revenue" value="₹1,24,320" icon={<FiTrendingUp />} color="bg-orange-500" />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-800">
            Recent Activity
          </h2>

          <div className="flex flex-col gap-4">
            <Activity text="New order placed #4532" />
            <Activity text="Product 'Silver Bracelet' updated" />
            <Activity text="New customer registered" />
            <Activity text="Stock updated for Necklace" />
          </div>
        </div>

      </div>

    </AdminPageWrapper>
  );
}


/* ---------- Components ---------- */

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 sm:p-5 flex items-center gap-4 min-w-0">

      <div className={`${color} text-white p-3 rounded-xl text-xl shrink-0`}>
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-slate-500 text-xs sm:text-sm truncate">{title}</p>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{value}</h3>
      </div>

    </div>
  );
}

function Activity({ text }) {
  return (
    <div className="flex items-start gap-3 text-slate-700 text-sm sm:text-base">
      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-2 shrink-0"></div>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
