export default function AdminPageWrapper({ children }) {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
