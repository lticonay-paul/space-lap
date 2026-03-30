import { useCart } from "../context/CartContext";

export default function Carrito() {
  const { cart, removeFromCart, clearCart, total } = useCart();

  if (cart.length === 0) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#444" }}>Tu carrito está vacío</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ letterSpacing: "3px", fontSize: "1.1rem", margin: "0 0 2rem" }}>CARRITO</h2>
      {cart.map(item => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111", border: "1px solid #1f1f1f", borderRadius: "10px", padding: "1rem", marginBottom: "0.8rem" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{item.name}</p>
            <p style={{ margin: 0, color: "#555", fontSize: "0.85rem" }}>{item.brand} · {item.ram}GB RAM · {item.ssd}GB SSD</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ fontWeight: 700 }}>S/ {item.price.toLocaleString()}</span>
            <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "1px solid #333", borderRadius: "6px", color: "#666", padding: "4px 10px", cursor: "pointer", fontSize: "0.8rem" }}>
              Quitar
            </button>
          </div>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #1f1f1f", marginTop: "1.5rem", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#888" }}>Total</span>
        <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>S/ {total.toLocaleString()}</span>
      </div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button onClick={clearCart} style={{ flex: 1, background: "none", border: "1px solid #333", borderRadius: "8px", color: "#666", padding: "12px", cursor: "pointer" }}>
          Vaciar carrito
        </button>
        <button style={{ flex: 2, background: "#fff", border: "none", borderRadius: "8px", color: "#000", padding: "12px", fontWeight: 700, cursor: "pointer" }}>
          Proceder al pago
        </button>
      </div>
    </div>
  );
}
