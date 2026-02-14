export default function PinkButton({ content, doThis }) {
  return (
    <button
      className="
        inline-flex items-center justify-center
        px-5 sm:px-6
        py-2.5 sm:py-3
        bg-pink-500 text-white
        rounded-full
        text-sm sm:text-base
        font-medium tracking-wide
        hover:bg-pink-600
        active:scale-95
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
      "
      onClick={doThis}
    >
      {content}
    </button>
  );
}
