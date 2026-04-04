import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const brands = ["Todas", "Lenovo", "HP", "ASUS", "Acer", "Dell", "Apple", "Samsung"];

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Todas");
  const [ram, setRam] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [onlyOffers, setOnlyOffers] = useState(false);

  const [laptops, setLaptops] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/laptops`)
    .then(res => res.json())
    .then(data => {
      setLaptops(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error al cargar laptops:", err);
      setLoading(false);
    });
}, []);

  const filtered = laptops.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brand === "Todas" || l.brand === brand;
    const matchRam = ram === "Todas" || l.ram === Number(ram);
    const matchPrice = l.price <= maxPrice;
    const matchOffer = !onlyOffers || l.offer;
    return matchSearch && matchBrand && matchRam && matchPrice && matchOffer;
  });
if (loading) return (
  <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <p style={{ color: "#555" }}>Cargando laptops...</p>
  </div>
);
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <div style={{ textAlign: "center", padding: "3rem 2rem 2rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "5px", margin: "0 0 0.5rem" }}>CATÁLOGO</h1>
        <p style={{ color: "#555", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>Laptops seleccionadas para cada misión</p>
        <input type="text" placeholder="Buscar laptop o marca..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: "480px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "12px 20px", color: "#fff", fontSize: "0.95rem", outline: "none" }}
        />
      </div>

      <div style={{ display: "flex", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 3rem", gap: "2rem" }}>
        <aside style={{ width: "200px", flexShrink: 0, background: "#111", border: "1px solid #1f1f1f", borderRadius: "12px", padding: "1.5rem", height: "fit-content", position: "sticky", top: "76px" }}>
          <p style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 1.2rem" }}>Filtros</p>

          <label style={{ color: "#666", fontSize: "0.78rem", textTransform: "uppercase" }}>Marca</label>
          <select value={brand} onChange={e => setBrand(e.target.value)} style={{ display: "block", width: "100%", margin: "6px 0 1rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "0.85rem" }}>
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>

          <label style={{ color: "#666", fontSize: "0.78rem", textTransform: "uppercase" }}>RAM</label>
          <select value={ram} onChange={e => setRam(e.target.value)} style={{ display: "block", width: "100%", margin: "6px 0 1rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "0.85rem" }}>
            <option value="Todas">Todas</option>
            <option value="8">8 GB</option>
            <option value="16">16 GB</option>
          </select>

          <label style={{ color: "#666", fontSize: "0.78rem", textTransform: "uppercase" }}>Precio máx: S/ {maxPrice.toLocaleString()}</label>
          <input type="range" min="1000" max="6000" step="100" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: "100%", margin: "8px 0 1rem" }} />

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#888", fontSize: "0.85rem" }}>
            <input type="checkbox" checked={onlyOffers} onChange={e => setOnlyOffers(e.target.checked)} />
            Solo ofertas
          </label>
        </aside>

        <main style={{ flex: 1 }}>
          <p style={{ color: "#444", fontSize: "0.82rem", marginBottom: "1rem" }}>{filtered.length} laptop{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>
          {filtered.length === 0
            ? <div style={{ textAlign: "center", color: "#444", padding: "4rem" }}>No se encontraron laptops con esos filtros</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
                {filtered.map(l => <ProductCard key={l.id} laptop={l} />)}
              </div>
          }
        </main>
      </div>
    </div>
  );
}
