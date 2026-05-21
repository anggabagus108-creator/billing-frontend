import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // ✅ kalau belum login → redirect
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ✅ kalau sudah login → tampilkan halaman
  return children;
}

export default PrivateRoute;