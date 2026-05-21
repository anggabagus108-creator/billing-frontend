import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Login from "./pages/Login";
import Packages from "./pages/Packages";
import Layout from "./components/Layout";
import WhatsApp from "./pages/WhatsApp";

function PrivateRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ✅ LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ✅ PROTECTED ROUTES */}
        <Route element={<PrivateRoute />}>

          {/* ✅ LAYOUT */}
          <Route element={<Layout />}>

            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/whatsapp" element={<WhatsApp />} /> 

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;