import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  // Close sidebar whenever route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-slate-100 overflow-x-hidden">

      <AdminSidebar open={open} setOpen={setOpen} />

      <div className={`transition-all duration-300 ${open ? "pl-56" : "pl-16"}`}>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
