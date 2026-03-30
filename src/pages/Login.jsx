export default function Login() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "380px" }}>
        <h2 style={{ color: "#fff", margin: "0 0 0.5rem", letterSpacing: "3px", fontSize: "1.1rem" }}>SPACE LAP</h2>
        <p style={{ color: "#555", fontSize: "0.85rem", margin: "0 0 2rem" }}>Ingresa a tu cuenta</p>
        <input type="email" placeholder="Correo electrónico" style={{ display: "block", width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px", color: "#fff", fontSize: "0.9rem", marginBottom: "1rem", boxSizing: "border-box" }} />
        <input type="password" placeholder="Contraseña" style={{ display: "block", width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px", color: "#fff", fontSize: "0.9rem", marginBottom: "1.5rem", boxSizing: "border-box" }} />
        <button style={{ width: "100%", background: "#fff", color: "#000", border: "none", borderRadius: "8px", padding: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
          Ingresar
        </button>
        <p style={{ color: "#444", fontSize: "0.8rem", textAlign: "center", marginTop: "1.5rem" }}>¿No tienes cuenta? Contáctanos</p>
      </div>
    </div>
  );
}
