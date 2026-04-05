import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      background: "#0a0a0a", borderBottom: "1px solid #1f1f1f",
      position: "sticky", top: 0, zIndex: 100
    }}>
      <div style={{
        padding: "0 1.2rem", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "3px", whiteSpace: "nowrap" }}>
          SPACE LAP
        </Link>

        {/* Menú desktop */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }} className="desktop-menu">
          <Link to="/" style={{ color: "#888", textDecoration: "none", fontSize: "0.85rem" }}>Catálogo</Link>
          <Link to="/login" style={{ color: "#888", textDecoration: "none", fontSize: "0.85rem" }}>Login</Link>
          <Link to="/admin" style={{ color: "#000", background: "#fff", padding: "5px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600 }}>Admin</Link>
          <Link to="/carrito" style={{ background: "#1a1a1a", color: "#fff", padding: "5px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "0.82rem", border: "1px solid #333" }}>
            🛒 {cart.length > 0 && `(${cart.length})`}
          </Link>
        </div>

        {/* Botón hamburguesa — solo en celular */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", color: "#fff", fontSize: "1.4rem", cursor: "pointer", padding: "4px" }}
          className="hamburger"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menú desplegable celular */}
      {menuOpen && (
        <div style={{
          background: "#111", borderTop: "1px solid #1f1f1f",
          padding: "1rem 1.2rem", display: "flex", flexDirection: "column", gap: "0.8rem"
        }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: "#888", textDecoration: "none", fontSize: "0.95rem" }}>Catálogo</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: "#888", textDecoration: "none", fontSize: "0.95rem" }}>Login</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: "#888", textDecoration: "none", fontSize: "0.95rem" }}>Panel Admin</Link>
          <Link to="/carrito" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>
            Carrito {cart.length > 0 && `(${cart.length})`}
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .desktop-menu { display: none !important; }
          .hamburger { display: block !important; }
        }
        @media (min-width: 601px) {
          .hamburger { display: none !important; }
          .desktop-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}