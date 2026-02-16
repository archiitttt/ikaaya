export default function AdminPageLoader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/70 backdrop-blur-sm">

      <div className="flex flex-col items-center gap-4">

        {/* Animated Logo Circle */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>

          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-700 tracking-wide">
            Loading Admin Panel
          </p>
          <p className="text-sm text-slate-500 animate-pulse">
            Please wait...
          </p>
        </div>

      </div>
    </div>
  );
}
