import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [laptops, setLaptops] = useState([]);
  const [vista, setVista] = useState("lista"); // lista | agregar | editar
  const [laptopEditando, setLaptopEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Si no hay token, redirigir al login
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
      setMensaje("Laptop eliminada correctamente");
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

      {/* Header admin */}
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

        {/* Mensaje de éxito */}
        {mensaje && (
          <div style={{ background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: "8px", padding: "10px 16px", marginBottom: "1.5rem" }}>
            <p style={{ color: "#4ade80", margin: 0, fontSize: "0.85rem" }}>{mensaje}</p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          {["lista", "agregar"].map(tab => (
            <button key={tab} onClick={() => { setVista(tab); setLaptopEditando(null); }} style={{
              background: vista === tab ? "#fff" : "none",
              color: vista === tab ? "#000" : "#555",
              border: "1px solid " + (vista === tab ? "#fff" : "#2a2a2a"),
              borderRadius: "8px", padding: "8px 20px",
              fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
              textTransform: "capitalize"
            }}>
              {tab === "lista" ? `Mis laptops (${laptops.length})` : "Agregar laptop"}
            </button>
          ))}
        </div>

        {/* Vista lista */}
        {vista === "lista" && (
          <div>
            {laptops.length === 0
              ? <p style={{ color: "#444", textAlign: "center", padding: "3rem" }}>No hay laptops. Agrega la primera.</p>
              : laptops.map(laptop => (
                <div key={laptop.id} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#111", border: "1px solid #1f1f1f", borderRadius: "10px", padding: "1rem", marginBottom: "0.8rem" }}>
                  <img src={laptop.image_url} alt={laptop.name} style={{ width: "80px", height: "60px", objectFit: "contain", background: "#1a1a1a", borderRadius: "6px", padding: "4px" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.95rem" }}>{laptop.name}</p>
                    <p style={{ margin: 0, color: "#555", fontSize: "0.8rem" }}>{laptop.brand} · {laptop.ram}GB RAM · {laptop.ssd}GB SSD · Stock: {laptop.stock}</p>
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

        {/* Formulario agregar / editar */}
        {(vista === "agregar" || vista === "editar") && (
          <FormularioLaptop
            laptop={laptopEditando}
            token={token}
            onGuardado={() => { cargarLaptops(); setVista("lista"); setMensaje(vista === "agregar" ? "Laptop agregada correctamente" : "Laptop actualizada correctamente"); setTimeout(() => setMensaje(""), 3000); }}
            onCancelar={() => { setVista("lista"); setLaptopEditando(null); }}
          />
        )}

      </div>
    </div>
  );
}

// Componente del formulario
function FormularioLaptop({ laptop, token, onGuardado, onCancelar }) {
  const editando = !!laptop;
  const [form, setForm] = useState({
    name: laptop?.name || "",
    brand: laptop?.brand || "",
    price: laptop?.price || "",
    ram: laptop?.ram || 8,
    ssd: laptop?.ssd || 256,
    stock: laptop?.stock || 1,
    offer: laptop?.offer || false,
    image_url: laptop?.image_url || "",
    description: laptop?.description || "",
  });
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  const set = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }));

  const subirImagen = async (archivo) => {
    setSubiendo(true);
    const formData = new FormData();
    formData.append("image", archivo);
    try {
      const res = await fetch("http://localhost:3001/api/laptops/upload", {
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
    const url = editando
      ? `http://localhost:3001/api/laptops/${laptop.id}`
      : "http://localhost:3001/api/laptops";
    const method = editando ? "PUT" : "POST";
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), ram: Number(form.ram), ssd: Number(form.ssd), stock: Number(form.stock) }),
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
        {editando ? "EDITAR LAPTOP" : "AGREGAR LAPTOP"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
        <div style={{ gridColumn: "1/-1" }}>{campo("Nombre", "name")}</div>
        {campo("Marca", "brand", "text", ["Lenovo", "HP", "ASUS", "Acer", "Dell", "Apple", "Samsung"])}
        {campo("Precio (S/)", "price", "number")}
        {campo("RAM (GB)", "ram", "text", [4, 8, 16, 32])}
        {campo("SSD (GB)", "ssd", "text", [128, 256, 512, 1024])}
        {campo("Stock", "stock", "number")}
        <div style={{ gridColumn: "1/-1" }}>{campo("Descripción", "description")}</div>
      </div>

      {/* Oferta checkbox */}
      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#888", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
        <input type="checkbox" checked={form.offer} onChange={e => set("offer", e.target.checked)} />
        Marcar como oferta
      </label>

      {/* Subir imagen */}
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
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Agregar laptop"}
        </button>
        <button onClick={onCancelar} style={{ flex: 1, background: "none", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#666", padding: "12px", cursor: "pointer" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}