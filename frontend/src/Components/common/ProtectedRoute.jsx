import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Loader from '../common/Loader';

export default function ProtectedRoute({ children }) {
  const { user, loadBuffer } = useAuth();

  if (loadBuffer) return (<Loader/>);
  return user ? children : <Navigate to="/login" />;
}
