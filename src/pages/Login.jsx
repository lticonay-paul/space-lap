import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      // Guardar token y datos del usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Ir al panel admin
      navigate("/admin");

    } catch (err) {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "380px" }}>

        <h2 style={{ color: "#fff", margin: "0 0 0.4rem", letterSpacing: "3px", fontSize: "1.1rem" }}>SPACE LAP</h2>
        <p style={{ color: "#555", fontSize: "0.85rem", margin: "0 0 2rem" }}>Panel de administración</p>

        {error && (
          <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: "8px", padding: "10px 14px", marginBottom: "1.2rem" }}>
            <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ display: "block", width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px", color: "#fff", fontSize: "0.9rem", marginBottom: "1rem", boxSizing: "border-box" }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ display: "block", width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px", color: "#fff", fontSize: "0.9rem", marginBottom: "1.5rem", boxSizing: "border-box" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: loading ? "#333" : "#fff", color: loading ? "#666" : "#000", border: "none", borderRadius: "8px", padding: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "default" : "pointer" }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

      </div>
    </div>
  );
}