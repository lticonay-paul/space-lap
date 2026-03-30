import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav style={{
      background: "#0a0a0a", padding: "0 2rem", height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #1f1f1f"
    }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "3px" }}>
        SPACE LAP
      </Link>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link to="/" style={{ color: "#888", textDecoration: "none", fontSize: "0.9rem" }}>Catálogo</Link>
        <Link to="/login" style={{ color: "#888", textDecoration: "none", fontSize: "0.9rem" }}>Login</Link>
        <Link to="/admin" style={{ color: "#0a0a0a", background: "#fff", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
          Admin
        </Link>
        <Link to="/carrito" style={{ background: "#1a1a1a", color: "#fff", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", fontSize: "0.85rem", border: "1px solid #333" }}>
          Carrito {cart.length > 0 && `(${cart.length})`}
        </Link>
      </div>
    </nav>
  );
}
