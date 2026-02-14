import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router';

export default function Footer() {

  const navigate = useNavigate();

  return (
    <footer className="relative w-full overflow-x-hidden bg-gradient-to-br from-[#FFE8CD] via-[#FFDCDC] to-[#FFF2EB] text-gray-700">

      {/* Divider */}
      <div className="h-px w-full bg-pink-300/40" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-16 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

        {/* Brand */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="font-tangerine text-3xl sm:text-4xl font-semibold text-pink-600">
            ikaaya
          </h2>
          <p className="text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
            Thoughtfully handcrafted beaded jewelry, made in small batches with
            love, patience, and attention to detail.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4 text-center">
          <h3 className="text-xs sm:text-sm uppercase tracking-widest text-pink-500">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-600 transition cursor-pointer" onClick={()=>navigate('/')}>Home</li>
            <li className="hover:text-pink-600 transition cursor-pointer" onClick={()=>navigate('/shop')} >Shop</li>
            <li className="hover:text-pink-600 transition cursor-pointer">Our Story</li>
            <li className="hover:text-pink-600 transition cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-4 text-center flex flex-col items-center">
          <h3 className="text-xs sm:text-sm uppercase tracking-widest text-pink-500">
            Connect
          </h3>

          <div className="flex justify-center items-center gap-5 text-xl text-pink-600">
            <a href="https://www.instagram.com/ikaaya.co?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                icon={["fab", "instagram"]}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
              />
            </a>
          </div>
        </div>


      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 pb-5">
        © {new Date().getFullYear()} ikaaya. All rights reserved.
      </div>

    </footer>
  );
}
