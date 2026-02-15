import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  FiMenu,
  FiGrid,
  FiBox,
  FiLogOut,
  FiChevronLeft,
} from "react-icons/fi";

export default function AdminSidebar({ open, setOpen }) {

  const sidebarRef = useRef(null);

  /* ---------- Close sidebar when clicking outside ---------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (!sidebarRef.current) return;
      if (open && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  const links = [
    { name: "Dashboard", to: "/admin", icon: <FiGrid /> },
    { name: "Products", to: "/admin/products", icon: <FiBox /> },
  ];

  return (
    <aside
      ref={sidebarRef}
      className={`
        ${open ? "w-56" : "w-16"}
        bg-gradient-to-b from-slate-900 to-slate-800 text-white
        h-dvh fixed left-0 top-0
        transition-all duration-300 shadow-xl z-50
        flex flex-col
      `}
    >
      {/* HEADER */}
      <div className="relative flex items-center justify-center p-4 border-b border-slate-700 shrink-0">

        {/* Title */}
        <h1
          className={`
            font-semibold text-base tracking-wide whitespace-nowrap
            transition-all duration-300
            ${open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
          `}
        >
          Ikaaya
        </h1>

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="
            absolute -right-3 top-1/2 -translate-y-1/2
            bg-slate-900 border border-slate-700
            p-2 rounded-full shadow-lg
            hover:bg-slate-700 transition
          "
        >
          {open ? <FiChevronLeft size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* SCROLLABLE NAV AREA */}
      <div className="flex-1 overflow-y-auto">
        <nav className={`flex flex-col mt-6 pb-6 ${open ? "px-3 gap-2" : "items-center gap-3"}`}>
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `
                group flex items-center
                ${open ? "gap-3 px-3 py-2.5 rounded-lg w-full text-sm" : "justify-center w-10 h-10 rounded-lg"}
                transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-md"
                    : "hover:bg-slate-700 text-slate-300 hover:text-white"
                }
                `
              }
            >
              {/* Icon */}
              <span className="text-lg flex items-center justify-center shrink-0">
                {link.icon}
              </span>

              {/* Text */}
              {open && (
                <span className="whitespace-nowrap">
                  {link.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* FOOTER (always visible) */}
      <div className={`border-t border-slate-700 shrink-0 ${open ? "p-3" : "py-4 flex justify-center"}`}>
        <button
          className={`
            flex items-center text-red-400 hover:bg-red-500/20 transition
            ${open ? "gap-3 px-3 py-2.5 rounded-lg w-full text-sm" : "justify-center w-10 h-10 rounded-lg"}
          `}
        >
          <FiLogOut className="text-lg shrink-0" />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
