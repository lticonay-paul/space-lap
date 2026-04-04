import { useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "51998808001"; // Pon tu número con código de Perú (51) sin el +

export default function Carrito() {
  const { cart, removeFromCart, clearCart, total } = useCart();

  const handleWhatsApp = () => {
    if (cart.length === 0) return;

    const items = cart
      .map(item => `🖥️ ${item.name} — S/ ${item.price.toLocaleString()}`)
      .join("\n");

    const mensaje = `Hola Space Lap! 👋 Me interesa comprar:\n\n${items}\n\n💰 Total: S/ ${total.toLocaleString()}\n\n¿Está disponible? ¿Cómo coordino el pago?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  if (cart.length === 0) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1rem"
    }}>
      <p style={{ color: "#444", fontSize: "1rem" }}>Tu carrito está vacío</p>
      <a href="/" style={{ color: "#888", fontSize: "0.85rem" }}>Ver catálogo</a>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", padding: "2rem" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        <h2 style={{ letterSpacing: "3px", fontSize: "1rem", color: "#fff", marginBottom: "0.4rem" }}>
          CARRITO
        </h2>
        <p style={{ color: "#444", fontSize: "0.82rem", marginBottom: "2rem" }}>
          {cart.length} producto{cart.length !== 1 ? "s" : ""} seleccionado{cart.length !== 1 ? "s" : ""}
        </p>

        {/* Lista de productos */}
        {cart.map(item => (
          <div key={item.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#111", border: "1px solid #1f1f1f", borderRadius: "10px",
            padding: "1rem 1.2rem", marginBottom: "0.8rem"
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.95rem" }}>{item.name}</p>
              <p style={{ margin: 0, color: "#555", fontSize: "0.8rem" }}>
                {item.brand} · {item.ram}GB RAM · {item.ssd}GB SSD
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                S/ {item.price.toLocaleString()}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "none", border: "1px solid #2a2a2a",
                  borderRadius: "6px", color: "#555", padding: "4px 10px",
                  cursor: "pointer", fontSize: "0.78rem"
                }}
              >
                Quitar
              </button>
            </div>
          </div>
        ))}

        {/* Total */}
        <div style={{
          borderTop: "1px solid #1f1f1f", marginTop: "1.5rem",
          paddingTop: "1.5rem", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          <span style={{ color: "#666", fontSize: "0.9rem" }}>Total</span>
          <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            S/ {total.toLocaleString()}
          </span>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>

          {/* Botón WhatsApp — el principal */}
          <button
            onClick={handleWhatsApp}
            style={{
              width: "100%", padding: "14px",
              background: "#25D366", border: "none",
              borderRadius: "10px", color: "#fff",
              fontSize: "1rem", fontWeight: 700,
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: "10px"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1ebe5d"}
            onMouseLeave={e => e.currentTarget.style.background = "#25D366"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Consultar por WhatsApp
          </button>

          {/* Vaciar carrito */}
          <button
            onClick={clearCart}
            style={{
              width: "100%", padding: "12px",
              background: "none", border: "1px solid #2a2a2a",
              borderRadius: "10px", color: "#555",
              fontSize: "0.88rem", cursor: "pointer"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#444"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
          >
            Vaciar carrito
          </button>
        </div>

        {/* Nota informativa */}
        <p style={{
          color: "#333", fontSize: "0.78rem",
          textAlign: "center", marginTop: "1.5rem", lineHeight: 1.6
        }}>
          Al hacer clic se abrirá WhatsApp con el detalle de tu pedido.<br />
          Coordinamos el pago por Yape, Plin o efectivo.
        </p>

      </div>
    </div>
  );
}