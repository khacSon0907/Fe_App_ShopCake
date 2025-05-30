import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children, adminOnly = false }) {
  const user = useSelector((state) => state.user.data);
  
  console.log(" userr ", user);
  if (!user) return <Navigate to="/" />;

if (adminOnly && user?.role !== "ADMIN") {
  return <Navigate to="/" />;
}


  if (window.location.pathname === "/change-password" && user.authProvider === "GOOGLE") {
    return <Navigate to="/" replace />;
  }

  return children;
}
