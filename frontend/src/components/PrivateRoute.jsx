import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" />;

  return children;
}

export default PrivateRoute;