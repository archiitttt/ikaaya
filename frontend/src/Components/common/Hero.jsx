import heroImg from "../../Assets/images/heroBG.png";
import PinkButton from "../misc/PinkButton";
import { useNavigate } from "react-router";

export default function Hero() {

  const navigate = useNavigate();

  return (
    <section
      className="
        relative w-full
        min-h-[75vh] md:min-h-[85vh] lg:min-h-[90vh]
        bg-cover
        bg-[position:75%_center] md:bg-center
        will-change-transform
      "
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/65 md:from-white/50 to-transparent" />

      {/* 🔒 Bottom-left content */}
      <div
        className="
          absolute bottom-0 left-0 z-10
          px-5 sm:px-8 lg:px-20
          pb-20 sm:pb-24 md:pb-32 lg:pb-36
          max-w-[22rem] sm:max-w-md lg:max-w-xl
        "
      >
        <h2
          className="
            font-heading font-semibold text-pink-600 leading-snug
            text-2xl sm:text-3xl md:text-5xl lg:text-6xl
          "
        >
          Handcrafted Adornments,
          <br />
          Woven with Love
        </h2>

        <div className="mt-6">
          <PinkButton content="Shop Collection" doThis={()=>navigate('/shop')}/>
        </div>
      </div>
    </section>
  );
}
