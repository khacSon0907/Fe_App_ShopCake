import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children, adminOnly = false }) {
  const user = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.user.loading);

  if (loading) {
  return <div>Đang tải xác thực...</div>; // hoặc loading spinner
}

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
