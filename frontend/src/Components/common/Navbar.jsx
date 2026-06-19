import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import CartSidebar from './CartSidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const {user} = useAuth();

  const links = [{name : 'HOME', goesTo : '/'}, {name : 'SHOP', goesTo : '/shop'}, {name : 'CONTACT', goesTo : '/contact'}];

  return (
    <nav className="relative w-full bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 md:h-24 px-4 sm:px-6 lg:px-12">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {links.map(item => (
            <Link
              key={item.name}
              to={item.goesTo}
              className="text-sm font-medium tracking-wide hover:text-pink-400 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <h1 className="absolute left-1/2 -translate-x-1/2 font-tangerine text-5xl md:text-7xl font-bold">
          ikaaya
        </h1>

        {/* Auth – Desktop NO AUTH*/}
        {!user && <div className="hidden md:flex absolute right-6 gap-8">
          <Link
            to="/login"
            className="text-sm font-medium tracking-wide hover:text-pink-400 transition"
          >
            LOG IN
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium tracking-wide hover:text-pink-400 transition"
          >
            SIGN IN
          </Link>
        </div>}

        {/* Auth – Desktop AUTH-ed*/}
        {user && <div className="hidden md:flex absolute right-6 gap-8 items-center">
          <CartSidebar />
          <Link
            to="/profile"
            className="text-xl font-medium tracking-wide hover:text-pink-400 transition"
          >
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>}
        

        {/* Right Spacer */}
        <div className="w-6 md:w-0" />
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <div className="flex flex-col gap-4 pt-4">
            {links.map(item => (
              <Link
                key={item.name}
                to={item.goesTo}
                onClick={() => setOpen(false)}
                className="text-sm font-medium tracking-wide hover:text-pink-400 transition"
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Links - NO AUTH*/}
            {!user && <div className="pt-4 border-t flex flex-col gap-4">
              <Link
                to="/login"
                className="text-sm font-medium tracking-wide hover:text-pink-400 transition"
              >
                LOG IN
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium tracking-wide hover:text-pink-400 transition"
              >
                SIGN IN
              </Link>
            </div>}

            {/* Mobile Auth Links - AUTH-ed*/}
            {user && <div className="pt-4 border-t flex flex-col gap-4">
              <Link
                to="/cart"
                className="text-sm font-medium tracking-wide hover:text-pink-400 transition"
              >
                CART
              </Link>
              <Link
                to="/profile"
                className="text-sm font-medium tracking-wide hover:text-pink-400 transition"
              >
                PROFILE
              </Link>
            </div>}
          </div>
        </div>
      )}
    </nav>
  );
}
