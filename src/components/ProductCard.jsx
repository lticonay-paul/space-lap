import { useCart } from "../context/CartContext";

export default function ProductCard({ laptop }) {
  const { addToCart, cart } = useCart();
  const inCart = cart.find(i => i.id === laptop.id);

  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#444"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
    >
      <div style={{ position: "relative" }}>
        <img src={laptop.image_url || laptop.image} alt={laptop.name} style={{ width: "100%", height: "200px", objectFit: "contain", background: "#1a1a1a", display: "block", padding: "1rem" }} />
        {laptop.offer && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "#ef4444", color: "#fff", padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700 }}>
            OFERTA
          </span>
        )}
        {laptop.stock === 1 && (
          <span style={{ position: "absolute", top: 10, right: 10, background: "#f59e0b", color: "#000", padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700 }}>
            Último
          </span>
        )}
      </div>
      <div style={{ padding: "1rem" }}>
        <p style={{ color: "#555", fontSize: "0.72rem", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "1px" }}>{laptop.brand}</p>
        <h3 style={{ color: "#fff", margin: "0 0 6px", fontSize: "0.95rem" }}>{laptop.name}</h3>
        <p style={{ color: "#666", fontSize: "0.8rem", margin: "0 0 10px", lineHeight: 1.4 }}>{laptop.description}</p>
        <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
          <span style={{ background: "#1a1a1a", color: "#888", padding: "3px 8px", borderRadius: "4px", fontSize: "0.72rem" }}>{laptop.ram}GB RAM</span>
          <span style={{ background: "#1a1a1a", color: "#888", padding: "3px 8px", borderRadius: "4px", fontSize: "0.72rem" }}>{laptop.ssd}GB SSD</span>
          <span style={{ background: "#1a1a1a", color: "#888", padding: "3px 8px", borderRadius: "4px", fontSize: "0.72rem" }}>Stock: {laptop.stock}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.15rem" }}>S/ {laptop.price.toLocaleString()}</span>
          <button onClick={() => addToCart(laptop)} disabled={!!inCart} style={{
            background: inCart ? "#1a1a1a" : "#fff", color: inCart ? "#444" : "#000",
            border: "none", borderRadius: "8px", padding: "8px 16px",
            fontSize: "0.82rem", fontWeight: 600, cursor: inCart ? "default" : "pointer"
          }}>
            {inCart ? "En carrito" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
