// main.js
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ import this

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider> {/* ✅ wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </BrowserRouter>
);
