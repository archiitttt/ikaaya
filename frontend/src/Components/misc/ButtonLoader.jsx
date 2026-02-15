export default function ButtonLoader({ loading, children, className = "", ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      className={`
        relative flex items-center justify-center gap-2
        ${loading ? "opacity-80 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      <span className={loading ? "opacity-80" : ""}>{children}</span>
    </button>
  );
}
