import { Link, useNavigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";



function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Invoices", path: "/invoices" },
    { name: "Customers", path: "/customers" },
    { name: "Packages", path: "/packages" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* ✅ SIDEBAR */}
      <div className="w-60 bg-blue-600 text-white p-5">
        <h1 className="text-xl font-bold mb-6">🚀 RT/RW Net</h1>

        <div className="flex flex-col gap-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded ${
                location.pathname === item.path
                  ? "bg-blue-800"
                  : "hover:bg-blue-500"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ MAIN */}
      <div className="flex-1">

        {/* ✅ TOPBAR */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
  <h2 className="text-lg font-semibold capitalize">
    {location.pathname.replace("/", "") || "dashboard"}
  </h2>

  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
  >
    Logout
  </button>
</div>

        {/* ✅ CONTENT */}
        <div className="p-6">
  <Outlet />
</div>
      </div>
    </div>
  );
}

export default Layout;