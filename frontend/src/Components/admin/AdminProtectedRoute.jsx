import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import AdminPageLoader from '../../Components/common/AdminPageLoader';

export default function AdminProtectedRoute({ children }) {
  const { user, loadBuffer } = useAuth();

  if (loadBuffer) return (<AdminPageLoader/>);
  if (user && user.role === 'admin') {
    return <Outlet/>;
  }
  
  return <Navigate to="/admin/login" />;
}
