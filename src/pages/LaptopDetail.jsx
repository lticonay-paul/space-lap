import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "51998808001"; // Tu número real

export default function LaptopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [review, setReview] = useState({ author: "", rating: 5, comment: "" });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/laptops/${id}`)
      .then(res => res.json())
      .then(data => { setLaptop(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>Cargando...</p>
    </div>
  );

  if (!laptop) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>Laptop no encontrada</p>
    </div>
  );

  const inCart = cart.find(i => i.id === laptop.id);
  const fotos = [laptop.image_url, ...(laptop.specs?.fotos_extra || [])].filter(Boolean);
  const promedio = laptop.reviews?.length > 0
    ? (laptop.reviews.reduce((s, r) => s + r.rating, 0) / laptop.reviews.length).toFixed(1)
    : null;

  const handleWhatsApp = () => {
    const mensaje = `Hola Space Lap! 👋 Me interesa la laptop:\n\n🖥️ ${laptop.name}\n💰 S/ ${Number(laptop.price).toLocaleString()}\n\n¿Está disponible? ¿Cómo coordino el pago?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/laptops/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        setMensaje("¡Gracias por tu reseña!");
        setReview({ author: "", rating: 5, comment: "" });
        // Recargar laptop para ver la nueva reseña
        const data = await fetch(`${import.meta.env.VITE_API_URL}/laptops/${id}`).then(r => r.json());
        setLaptop(data);
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (err) {
      setMensaje("Error al enviar reseña");
    }
    setEnviando(false);
  };

  const estrellas = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.2rem" }}>

        {/* Volver */}
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1.5rem", padding: 0 }}>
          ← Volver al catálogo
        </button>

        {/* Sección principal */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>

          {/* Galería */}
          <div>
            <div style={{ background: "#111", borderRadius: "12px", padding: "1.5rem", marginBottom: "0.8rem", border: "1px solid #1f1f1f" }}>
              <img
                src={fotos[fotoActiva]}
                alt={laptop.name}
                style={{ width: "100%", height: "280px", objectFit: "contain", display: "block" }}
              />
            </div>
            {fotos.length > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {fotos.map((foto, i) => (
                  <img
                    key={i}
                    src={foto}
                    alt={`foto ${i + 1}`}
                    onClick={() => setFotoActiva(i)}
                    style={{
                      width: "70px", height: "52px", objectFit: "contain",
                      background: "#111", borderRadius: "8px", padding: "4px",
                      border: `1px solid ${fotoActiva === i ? "#fff" : "#2a2a2a"}`,
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p style={{ color: "#555", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px" }}>{laptop.brand}</p>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2 }}>{laptop.name}</h1>

            {promedio && (
              <p style={{ color: "#f59e0b", fontSize: "1rem", margin: "0 0 12px" }}>
                {estrellas(Math.round(promedio))} <span style={{ color: "#888", fontSize: "0.82rem" }}>({promedio} de {laptop.reviews.length} reseña{laptop.reviews.length !== 1 ? "s" : ""})</span>
              </p>
            )}

            <p style={{ color: "#888", fontSize: "0.9rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>{laptop.description}</p>

            {/* Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {[
  // Solo mostrar RAM y SSD si la categoría es laptops o PCs y tienen valor
  ...(["laptops","pcs"].includes(laptop.category_slug) && laptop.ram > 0 ? [["RAM", `${laptop.ram} GB`]] : []),
  ...(["laptops","pcs"].includes(laptop.category_slug) && laptop.ssd > 0 ? [["SSD", `${laptop.ssd} GB`]] : []),
  ["Stock", `${laptop.stock} unidad${laptop.stock !== 1 ? "es" : ""}`],
  ["Estado", laptop.offer ? "En oferta" : "Precio regular"],
  // Specs dinámicas — mostrar todo lo que tenga valor
  ...(laptop.specs?.cpu ? [["Procesador", laptop.specs.cpu]] : []),
  ...(laptop.specs?.ram_detalle ? [["RAM", laptop.specs.ram_detalle]] : []),
  ...(laptop.specs?.ssd_detalle ? [["Almacenamiento", laptop.specs.ssd_detalle]] : []),
  ...(laptop.specs?.gpu ? [["Tarjeta gráfica", laptop.specs.gpu]] : []),
  ...(laptop.specs?.pantalla ? [["Pantalla", laptop.specs.pantalla]] : []),
  ...(laptop.specs?.bateria ? [["Batería", laptop.specs.bateria]] : []),
  ...(laptop.specs?.peso ? [["Peso", laptop.specs.peso]] : []),
  ...(laptop.specs?.os ? [["Sistema", laptop.specs.os]] : []),
  ...(laptop.specs?.color ? [["Color", laptop.specs.color]] : []),
  ...(laptop.specs?.dimensiones ? [["Dimensiones", laptop.specs.dimensiones]] : []),
  // Monitores
  ...(laptop.specs?.tamano ? [["Tamaño", laptop.specs.tamano]] : []),
  ...(laptop.specs?.resolucion ? [["Resolución", laptop.specs.resolucion]] : []),
  ...(laptop.specs?.panel ? [["Panel", laptop.specs.panel]] : []),
  ...(laptop.specs?.hz ? [["Frecuencia", laptop.specs.hz]] : []),
  ...(laptop.specs?.respuesta ? [["Resp. tiempo", laptop.specs.respuesta]] : []),
  ...(laptop.specs?.puertos ? [["Puertos", laptop.specs.puertos]] : []),
  ...(laptop.specs?.curvatura ? [["Curvatura", laptop.specs.curvatura]] : []),
  // Mouses y teclados
  ...(laptop.specs?.dpi ? [["DPI", laptop.specs.dpi]] : []),
  ...(laptop.specs?.conexion ? [["Conexión", laptop.specs.conexion]] : []),
  ...(laptop.specs?.botones ? [["Botones", laptop.specs.botones]] : []),
  ...(laptop.specs?.rgb ? [["RGB", laptop.specs.rgb]] : []),
  ...(laptop.specs?.tipo ? [["Tipo", laptop.specs.tipo]] : []),
  ...(laptop.specs?.switch ? [["Switch", laptop.specs.switch]] : []),
  ...(laptop.specs?.layout ? [["Layout", laptop.specs.layout]] : []),
  ...(laptop.specs?.idioma ? [["Idioma", laptop.specs.idioma]] : []),
  // Auriculares
  ...(laptop.specs?.microfono ? [["Micrófono", laptop.specs.microfono]] : []),
  ...(laptop.specs?.anc ? [["Cancelación ruido", laptop.specs.anc]] : []),
  // PCs
  ...(laptop.specs?.motherboard ? [["Placa madre", laptop.specs.motherboard]] : []),
  ...(laptop.specs?.psu ? [["Fuente de poder", laptop.specs.psu]] : []),
  ...(laptop.specs?.case ? [["Torre/Case", laptop.specs.case]] : []),
  ...(laptop.specs?.cooling ? [["Refrigeración", laptop.specs.cooling]] : []),
  // Accesorios
  ...(laptop.specs?.material ? [["Material", laptop.specs.material]] : []),
  ...(laptop.specs?.compatibilidad ? [["Compatibilidad", laptop.specs.compatibilidad]] : []),
].map(([label, value]) => (
                <div key={label} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "8px", padding: "0.6rem 0.8rem" }}>
                  <p style={{ color: "#555", fontSize: "0.7rem", textTransform: "uppercase", margin: "0 0 2px" }}>{label}</p>
                  <p style={{ color: "#fff", fontSize: "0.88rem", margin: 0, fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Precio y botones */}
            <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: "1.5rem" }}>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 1rem" }}>
                S/ {Number(laptop.price).toLocaleString()}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                <button
                  onClick={handleWhatsApp}
                  style={{ width: "100%", padding: "14px", background: "#25D366", border: "none", borderRadius: "10px", color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Consultar por WhatsApp
                </button>
                <button
                  onClick={() => addToCart(laptop)}
                  disabled={!!inCart}
                  style={{ width: "100%", padding: "12px", background: inCart ? "#1a1a1a" : "#fff", color: inCart ? "#444" : "#000", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem", cursor: inCart ? "default" : "pointer" }}
                >
                  {inCart ? "Ya está en el carrito" : "Agregar al carrito"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", letterSpacing: "2px", marginBottom: "1.5rem" }}>RESEÑAS</h2>

          {/* Lista de reseñas */}
          {laptop.reviews?.length === 0 && (
            <p style={{ color: "#444", fontSize: "0.85rem", marginBottom: "2rem" }}>Aún no hay reseñas. ¡Sé el primero!</p>
          )}
          {laptop.reviews?.map(r => (
            <div key={r.id} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "10px", padding: "1rem 1.2rem", marginBottom: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.author}</span>
                <span style={{ color: "#f59e0b", fontSize: "0.9rem" }}>{estrellas(r.rating)}</span>
              </div>
              <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 4px", lineHeight: 1.5 }}>{r.comment}</p>
              <p style={{ color: "#444", fontSize: "0.75rem", margin: 0 }}>{new Date(r.created_at).toLocaleDateString("es-PE")}</p>
            </div>
          ))}

          {/* Formulario nueva reseña */}
          <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "12px", padding: "1.5rem", marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "0.9rem", letterSpacing: "1px", marginBottom: "1.2rem" }}>DEJAR UNA RESEÑA</h3>

            {mensaje && (
              <div style={{ background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: "8px", padding: "10px", marginBottom: "1rem" }}>
                <p style={{ color: "#4ade80", margin: 0, fontSize: "0.85rem" }}>{mensaje}</p>
              </div>
            )}

            <form onSubmit={handleReview}>
              <input
                type="text" placeholder="Tu nombre" required
                value={review.author} onChange={e => setReview(p => ({ ...p, author: e.target.value }))}
                style={{ display: "block", width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px", color: "#fff", fontSize: "0.9rem", marginBottom: "0.8rem", boxSizing: "border-box" }}
              />

              <label style={{ color: "#666", fontSize: "0.78rem", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Calificación: {estrellas(review.rating)}
              </label>
              <input
                type="range" min="1" max="5" step="1"
                value={review.rating} onChange={e => setReview(p => ({ ...p, rating: Number(e.target.value) }))}
                style={{ width: "100%", marginBottom: "0.8rem" }}
              />

              <textarea
                placeholder="Cuéntanos tu experiencia con esta laptop..."
                required rows={3}
                value={review.comment} onChange={e => setReview(p => ({ ...p, comment: e.target.value }))}
                style={{ display: "block", width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px", color: "#fff", fontSize: "0.9rem", marginBottom: "1rem", boxSizing: "border-box", resize: "vertical" }}
              />

              <button
                type="submit" disabled={enviando}
                style={{ width: "100%", padding: "12px", background: enviando ? "#333" : "#fff", color: enviando ? "#666" : "#000", border: "none", borderRadius: "8px", fontWeight: 700, cursor: enviando ? "default" : "pointer" }}
              >
                {enviando ? "Enviando..." : "Publicar reseña"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
