import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const brands = ["Todas", "Lenovo", "HP", "ASUS", "Acer", "Dell", "Apple", "Samsung", "Teros", "Logitech", "Razer", "Generic"];

export default function Catalog() {
  const [laptops, setLaptops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Todas");
  const [ram, setRam] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [filtrosVisible, setFiltrosVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/laptops`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/categories`).then(r => r.json()),
    ]).then(([prods, cats]) => {
      setLaptops(prods);
      setCategories(cats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = laptops.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brand === "Todas" || l.brand === brand;
    const matchRam = ram === "Todas" || l.ram === Number(ram);
    const matchPrice = Number(l.price) <= maxPrice;
    const matchOffer = !onlyOffers || l.offer;
    const matchCat = categoriaActiva === "todos" || l.category_slug === categoriaActiva;
    return matchSearch && matchBrand && matchRam && matchPrice && matchOffer && matchCat;
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>Cargando productos...</p>
    </div>
  );

  const filtrosContent = (
    <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "12px", padding: "1.2rem" }}>
      <p style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 1rem" }}>Filtros</p>

      <label style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase" }}>Marca</label>
      <select value={brand} onChange={e => setBrand(e.target.value)} style={{ display: "block", width: "100%", margin: "6px 0 1rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "0.85rem" }}>
        {brands.map(b => <option key={b}>{b}</option>)}
      </select>

      <label style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase" }}>RAM</label>
      <select value={ram} onChange={e => setRam(e.target.value)} style={{ display: "block", width: "100%", margin: "6px 0 1rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "0.85rem" }}>
        <option value="Todas">Todas</option>
        <option value="8">8 GB</option>
        <option value="16">16 GB</option>
      </select>

      <label style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase" }}>Precio máx: S/ {maxPrice.toLocaleString()}</label>
      <input type="range" min="1000" max="6000" step="100" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: "100%", margin: "8px 0 1rem" }} />

      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#888", fontSize: "0.85rem" }}>
        <input type="checkbox" checked={onlyOffers} onChange={e => setOnlyOffers(e.target.checked)} />
        Solo ofertas
      </label>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "2rem 1.2rem 1.5rem" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontWeight: 800, letterSpacing: "5px", margin: "0 0 0.4rem" }}>CATÁLOGO</h1>
        <p style={{ color: "#555", fontSize: "0.85rem", margin: "0 0 1.2rem" }}>Productos seleccionados para cada misión</p>
        <input
          type="text" placeholder="Buscar producto o marca..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: "480px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "11px 18px", color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Pestañas de categorías */}
      <div style={{ padding: "0 1.2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none" }}>
          {/* Pestaña Todos */}
          <button
            onClick={() => setCategoriaActiva("todos")}
            style={{
              background: categoriaActiva === "todos" ? "#fff" : "#111",
              color: categoriaActiva === "todos" ? "#000" : "#888",
              border: `1px solid ${categoriaActiva === "todos" ? "#fff" : "#2a2a2a"}`,
              borderRadius: "8px", padding: "8px 18px",
              fontSize: "0.85rem", fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0
            }}
          >
            Todos ({laptops.length})
          </button>

          {/* Pestañas dinámicas */}
          {categories.map(cat => {
            const count = laptops.filter(l => l.category_slug === cat.slug).length;
            const activa = categoriaActiva === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.slug)}
                style={{
                  background: activa ? "#fff" : "#111",
                  color: activa ? "#000" : "#888",
                  border: `1px solid ${activa ? "#fff" : "#2a2a2a"}`,
                  borderRadius: "8px", padding: "8px 18px",
                  fontSize: "0.85rem", fontWeight: activa ? 600 : 400,
                  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0
                }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón filtros celular */}
      <div style={{ padding: "0.8rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ color: "#444", fontSize: "0.82rem", margin: 0 }}>{filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setFiltrosVisible(!filtrosVisible)} className="filtros-btn"
          style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#888", padding: "7px 14px", cursor: "pointer", fontSize: "0.82rem" }}>
          {filtrosVisible ? "Ocultar filtros" : "Filtros ⚙"}
        </button>
      </div>

      {/* Filtros celular */}
      <div className="filtros-mobile" style={{ padding: "0 1.2rem 1rem", display: filtrosVisible ? "block" : "none" }}>
        {filtrosContent}
      </div>

      <div style={{ display: "flex", maxWidth: "1200px", margin: "0 auto", padding: "0 1.2rem 3rem", gap: "1.5rem", alignItems: "flex-start" }}>
        {/* Filtros sidebar desktop */}
        <aside className="filtros-desktop" style={{ width: "200px", flexShrink: 0, position: "sticky", top: "72px" }}>
          {filtrosContent}
        </aside>

        {/* Grid productos */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0
            ? <div style={{ textAlign: "center", color: "#444", padding: "4rem" }}>No se encontraron productos en esta categoría</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
                {filtered.map(l => <ProductCard key={l.id} laptop={l} />)}
              </div>
          }
        </main>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .filtros-desktop { display: none !important; }
          .filtros-btn { display: block !important; }
        }
        @media (min-width: 641px) {
          .filtros-mobile { display: none !important; }
          .filtros-btn { display: none !important; }
          .filtros-desktop { display: block !important; }
        }
      `}</style>
    </div>
  );
}