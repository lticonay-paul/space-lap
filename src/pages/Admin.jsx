import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [laptops, setLaptops] = useState([]);
  const [vista, setVista] = useState("lista");
  const [laptopEditando, setLaptopEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    cargarLaptops();
  }, []);

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  const cargarLaptops = async () => {
    try {
      const res = await fetch(`${API}/laptops`);
      const data = await res.json();
      setLaptops(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const eliminarLaptop = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await fetch(`${API}/laptops/${id}`, { method: "DELETE", headers });
      setMensaje("Producto eliminado correctamente");
      cargarLaptops();
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      setMensaje("Error al eliminar");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>Cargando panel...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>

      {/* Header */}
      <div style={{ background: "#111", borderBottom: "1px solid #1f1f1f", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 700, letterSpacing: "2px", fontSize: "0.95rem" }}>SPACE LAP</span>
          <span style={{ color: "#555", fontSize: "0.8rem", marginLeft: "1rem" }}>Panel Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#555", fontSize: "0.82rem" }}>{user.email}</span>
          <button onClick={cerrarSesion} style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: "6px", color: "#666", padding: "6px 12px", cursor: "pointer", fontSize: "0.82rem" }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>

        {/* Mensaje */}
        {mensaje && (
          <div style={{ background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: "8px", padding: "10px 16px", marginBottom: "1.5rem" }}>
            <p style={{ color: "#4ade80", margin: 0, fontSize: "0.85rem" }}>{mensaje}</p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {[
            { key: "lista", label: `Mis productos (${laptops.length})` },
            { key: "agregar", label: "Agregar producto" },
            { key: "categorias", label: "Categorías" },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setVista(tab.key); setLaptopEditando(null); }} style={{
              background: vista === tab.key ? "#fff" : "none",
              color: vista === tab.key ? "#000" : "#555",
              border: "1px solid " + (vista === tab.key ? "#fff" : "#2a2a2a"),
              borderRadius: "8px", padding: "8px 20px",
              fontSize: "0.85rem", fontWeight: 600, cursor: "pointer"
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vista lista */}
        {vista === "lista" && (
          <div>
            {laptops.length === 0
              ? <p style={{ color: "#444", textAlign: "center", padding: "3rem" }}>No hay productos. Agrega el primero.</p>
              : laptops.map(laptop => (
                <div key={laptop.id} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#111", border: "1px solid #1f1f1f", borderRadius: "10px", padding: "1rem", marginBottom: "0.8rem" }}>
                  <img src={laptop.image_url} alt={laptop.name} style={{ width: "80px", height: "60px", objectFit: "contain", background: "#1a1a1a", borderRadius: "6px", padding: "4px" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.95rem" }}>{laptop.name}</p>
                    <p style={{ margin: 0, color: "#555", fontSize: "0.8rem" }}>
                      {laptop.brand} · {laptop.category_name || "Sin categoría"} · Stock: {laptop.stock}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontWeight: 700 }}>S/ {Number(laptop.price).toLocaleString()}</span>
                    {laptop.offer && <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontSize: "0.72rem", fontWeight: 700 }}>OFERTA</span>}
                    <button onClick={() => { setLaptopEditando(laptop); setVista("editar"); }} style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: "6px", color: "#aaa", padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem" }}>
                      Editar
                    </button>
                    <button onClick={() => eliminarLaptop(laptop.id, laptop.name)} style={{ background: "none", border: "1px solid #3a1a1a", borderRadius: "6px", color: "#ef4444", padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem" }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* Vista agregar / editar */}
        {(vista === "agregar" || vista === "editar") && (
          <FormularioLaptop
            laptop={laptopEditando}
            token={token}
            onGuardado={() => {
              cargarLaptops();
              setVista("lista");
              setMensaje(vista === "agregar" ? "Producto agregado correctamente" : "Producto actualizado correctamente");
              setTimeout(() => setMensaje(""), 3000);
            }}
            onCancelar={() => { setVista("lista"); setLaptopEditando(null); }}
          />
        )}

        {/* Vista categorías */}
        {vista === "categorias" && (
          <GestionCategorias token={token} />
        )}

      </div>
    </div>
  );
}

// ─── Formulario agregar/editar ───────────────────────────────────────────────
function FormularioLaptop({ laptop, token, onGuardado, onCancelar }) {
  const editando = !!laptop;
  const [form, setForm] = useState({
    name: laptop?.name || "",
    brand: laptop?.brand || "",
    price: laptop?.price || "",
    stock: laptop?.stock || 1,
    offer: laptop?.offer || false,
    image_url: laptop?.image_url || "",
    description: laptop?.description || "",
    category_id: laptop?.category_id || "",
    specs: laptop?.specs || {}
  });
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  const set = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }));

  const subirImagen = async (archivo) => {
    setSubiendo(true);
    const formData = new FormData();
    formData.append("image", archivo);
    try {
      const res = await fetch(`${API}/laptops/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      set("image_url", data.url);
    } catch (err) {
      alert("Error al subir imagen");
    }
    setSubiendo(false);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    const url = editando ? `${API}/laptops/${laptop.id}` : `${API}/laptops`;
    const method = editando ? "PUT" : "POST";
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          ram: 0,
          ssd: 0,
          stock: Number(form.stock),
          category_id: form.category_id ? Number(form.category_id) : null,
          specs: form.specs
        }),
      });
      onGuardado();
    } catch (err) {
      alert("Error al guardar");
    }
    setGuardando(false);
  };

  const campo = (label, key, type = "text", opciones = null) => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", color: "#666", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{label}</label>
      {opciones
        ? <select value={form[key]} onChange={e => set(key, e.target.value)} style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px", color: "#fff", fontSize: "0.9rem" }}>
            {opciones.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        : <input type={type} value={form[key]} onChange={e => set(key, type === "checkbox" ? e.target.checked : e.target.value)}
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px", color: "#fff", fontSize: "0.9rem", boxSizing: "border-box" }}
          />
      }
    </div>
  );

  return (
    <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "12px", padding: "2rem", maxWidth: "600px" }}>
      <h3 style={{ margin: "0 0 1.5rem", fontSize: "0.95rem", letterSpacing: "2px" }}>
        {editando ? "EDITAR PRODUCTO" : "AGREGAR PRODUCTO"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
        <div style={{ gridColumn: "1/-1" }}>{campo("Nombre", "name")}</div>
        {campo("Marca", "brand", "text", ["Lenovo", "HP", "ASUS", "Acer", "Dell", "Apple", "Samsung", "Logitech", "Razer", "Generic"])}
        {campo("Precio (S/)", "price", "number")}
        {campo("Stock", "stock", "number")}
        <div style={{ gridColumn: "1/-1" }}>{campo("Descripción", "description")}</div>

        {/* Categoría */}
        <div style={{ gridColumn: "1/-1", marginBottom: "1rem" }}>
          <label style={{ display: "block", color: "#666", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Categoría</label>
          <CategoriaSelect value={form.category_id} onChange={v => set("category_id", v)} />
        </div>
      </div>

      {/* Campos dinámicos por categoría */}
      <CamposPorCategoria
        categoryId={form.category_id}
        specs={form.specs}
        onChange={specs => setForm(prev => ({ ...prev, specs }))}
      />

      {/* Oferta */}
      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#888", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
        <input type="checkbox" checked={form.offer} onChange={e => set("offer", e.target.checked)} />
        Marcar como oferta
      </label>

      {/* Imagen */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", color: "#666", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Imagen</label>
        <input type="file" accept="image/*" onChange={e => e.target.files[0] && subirImagen(e.target.files[0])}
          style={{ color: "#888", fontSize: "0.85rem" }}
        />
        {subiendo && <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "6px" }}>Subiendo imagen...</p>}
        {form.image_url && !subiendo && (
          <img src={form.image_url} alt="preview" style={{ marginTop: "10px", width: "120px", height: "80px", objectFit: "contain", background: "#1a1a1a", borderRadius: "6px", padding: "4px" }} />
        )}
      </div>

      {/* Botones */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={handleGuardar} disabled={guardando} style={{ flex: 2, background: guardando ? "#333" : "#fff", color: guardando ? "#666" : "#000", border: "none", borderRadius: "8px", padding: "12px", fontWeight: 700, cursor: guardando ? "default" : "pointer" }}>
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Agregar producto"}
        </button>
        <button onClick={onCancelar} style={{ flex: 1, background: "none", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#666", padding: "12px", cursor: "pointer" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Campos dinámicos por categoría ─────────────────────────────────────────
function CamposPorCategoria({ categoryId, specs = {}, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const cat = categories.find(c => String(c.id) === String(categoryId));
  const slug = cat?.slug || "";

  const set = (key, value) => onChange({ ...specs, [key]: value });

  const input = (label, key, placeholder = "") => (
    <div key={key} style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", color: "#666", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{label}</label>
      <input
        type="text"
        value={specs[key] || ""}
        placeholder={placeholder}
        onChange={e => set(key, e.target.value)}
        style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px", color: "#fff", fontSize: "0.9rem", boxSizing: "border-box" }}
      />
    </div>
  );

  const camposPorSlug = {
    laptops: (
      <>
        <p style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 1rem" }}>Especificaciones laptop</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          {input("Procesador", "cpu", "Intel Core i5-1235U")}
          {input("RAM", "ram_detalle", "16 GB DDR5")}
          {input("Almacenamiento", "ssd_detalle", "512 GB NVMe SSD")}
          {input("Pantalla", "pantalla", "15.6\" FHD IPS 144Hz")}
          {input("Tarjeta gráfica", "gpu", "NVIDIA RTX 4060")}
          {input("Batería", "bateria", "72Wh, hasta 10 horas")}
          {input("Sistema operativo", "os", "Windows 11 Home")}
          {input("Peso", "peso", "1.8 kg")}
          {input("Color", "color", "Gris espacial")}
          {input("Dimensiones", "dimensiones", "35.7 x 23.5 x 1.9 cm")}
        </div>
      </>
    ),
    monitores: (
      <>
        <p style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 1rem" }}>Especificaciones monitor</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          {input("Tamaño", "tamano", "27 pulgadas")}
          {input("Resolución", "resolucion", "2560 x 1440 QHD")}
          {input("Panel", "panel", "IPS")}
          {input("Frecuencia", "hz", "144 Hz")}
          {input("Tiempo de respuesta", "respuesta", "1 ms")}
          {input("Puertos", "puertos", "HDMI 2.0, DisplayPort 1.4")}
          {input("Color", "color", "Negro")}
          {input("Curvatura", "curvatura", "Plano / 1500R")}
        </div>
      </>
    ),
    mouses: (
      <>
        <p style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 1rem" }}>Especificaciones mouse</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          {input("DPI máximo", "dpi", "25600 DPI")}
          {input("Conexión", "conexion", "USB / Inalámbrico 2.4GHz")}
          {input("Botones", "botones", "6 botones programables")}
          {input("Color", "color", "Negro")}
          {input("RGB", "rgb", "Sí / No")}
          {input("Peso", "peso", "95 g")}
          {input("Batería", "bateria", "70 horas")}
        </div>
      </>
    ),
    teclados: (
      <>
        <p style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 1rem" }}>Especificaciones teclado</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          {input("Tipo", "tipo", "Mecánico / Membrana")}
          {input("Switch", "switch", "Red / Blue / Brown")}
          {input("Conexión", "conexion", "USB / Bluetooth")}
          {input("Layout", "layout", "Full size / TKL / 65%")}
          {input("RGB", "rgb", "Sí / No")}
          {input("Color", "color", "Negro")}
          {input("Idioma", "idioma", "Español / Inglés")}
        </div>
      </>
    ),
    auriculares: (
      <>
        <p style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 1rem" }}>Especificaciones auriculares</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          {input("Tipo", "tipo", "Over-ear / On-ear / In-ear")}
          {input("Conexión", "conexion", "USB / 3.5mm / Bluetooth")}
          {input("Micrófono", "microfono", "Sí / No")}
          {input("Cancelación de ruido", "anc", "Sí / No")}
          {input("Batería", "bateria", "30 horas")}
          {input("RGB", "rgb", "Sí / No")}
          {input("Color", "color", "Negro")}
        </div>
      </>
    ),
    accesorios: (
      <>
        <p style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 1rem" }}>Especificaciones accesorio</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          {input("Material", "material", "Plástico / Aluminio / Tela")}
          {input("Color", "color", "Negro")}
          {input("Dimensiones", "dimensiones", "30 x 20 x 5 cm")}
          {input("Compatibilidad", "compatibilidad", "Universal")}
          {input("Peso", "peso", "200 g")}
        </div>
      </>
    ),
  };

  if (!slug || !camposPorSlug[slug]) {
    return (
      <div style={{ background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
        <p style={{ color: "#444", fontSize: "0.85rem", margin: 0 }}>Selecciona una categoría para ver los campos de especificaciones</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "10px", padding: "1.2rem", marginBottom: "1rem" }}>
      {camposPorSlug[slug]}
    </div>
  );
}

// ─── Selector de categoría ───────────────────────────────────────────────────
function CategoriaSelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px", color: "#fff", fontSize: "0.9rem" }}>
      <option value="">Sin categoría</option>
      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
  );
}

// ─── Gestión de categorías ───────────────────────────────────────────────────
function GestionCategorias({ token }) {
  const [categories, setCategories] = useState([]);
  const [nueva, setNueva] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargar = async () => {
    const res = await fetch(`${API}/categories`);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => { cargar(); }, []);

  const agregar = async () => {
    if (!nueva.trim()) return;
    setGuardando(true);
    try {
      await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: nueva })
      });
      setNueva("");
      setMensaje("Categoría agregada");
      cargar();
      setTimeout(() => setMensaje(""), 2000);
    } catch (err) {
      setMensaje("Error al agregar");
    }
    setGuardando(false);
  };

  const eliminar = async (id, name) => {
    if (!confirm(`¿Eliminar categoría "${name}"? Los productos quedarán sin categoría.`)) return;
    await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    cargar();
  };

  return (
    <div style={{ maxWidth: "500px" }}>
      <h3 style={{ fontSize: "0.9rem", letterSpacing: "2px", marginBottom: "1.5rem" }}>GESTIONAR CATEGORÍAS</h3>

      {mensaje && (
        <div style={{ background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: "8px", padding: "10px", marginBottom: "1rem" }}>
          <p style={{ color: "#4ade80", margin: 0, fontSize: "0.85rem" }}>{mensaje}</p>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.5rem" }}>
        <input
          type="text" placeholder="Nombre de la categoría"
          value={nueva} onChange={e => setNueva(e.target.value)}
          onKeyDown={e => e.key === "Enter" && agregar()}
          style={{ flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px", color: "#fff", fontSize: "0.9rem" }}
        />
        <button onClick={agregar} disabled={guardando} style={{ background: "#fff", color: "#000", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
          {guardando ? "..." : "Agregar"}
        </button>
      </div>

      {categories.length === 0
        ? <p style={{ color: "#444", fontSize: "0.85rem" }}>No hay categorías aún.</p>
        : categories.map(cat => (
          <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111", border: "1px solid #1f1f1f", borderRadius: "8px", padding: "0.8rem 1rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.9rem" }}>{cat.name}</span>
            <button onClick={() => eliminar(cat.id, cat.name)} style={{ background: "none", border: "1px solid #3a1a1a", borderRadius: "6px", color: "#ef4444", padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem" }}>
              Eliminar
            </button>
          </div>
        ))
      }
    </div>
  );
}