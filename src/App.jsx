import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Carrito from "./pages/Carrito";
import LaptopDetail from "./pages/LaptopDetail";
export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/laptop/:id" element={<LaptopDetail />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
