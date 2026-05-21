import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Dashboard</Link> |
      <Link to="/customers"> Customers</Link> |
      <Link to="/packages"> Packages</Link> |
      <Link to="/invoices"> Invoices</Link>
    </nav>
  );
}

export default Navbar;
