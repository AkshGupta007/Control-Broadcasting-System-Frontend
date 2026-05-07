import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles , children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Show nothing until hydration is complete
  if (user === undefined) {
    return null;
  }

  if (!isAuthenticated) {
    console.log("Redirecting: not authenticated", { isAuthenticated, user });
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
