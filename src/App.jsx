
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddPacket from "./pages/AddPacket";
import PacketHistory from "./pages/PacketHistory";
import DFAVisualizer from "./pages/DFAVisualizer";

import "./App.css";

function App() {
  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem("netguard-theme") === "light" ? "light" : "dark"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("netguard-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar
          theme={theme}
          onToggleTheme={() =>
            setTheme(current => current === "dark" ? "light" : "dark")
          }
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-packet" element={<AddPacket />} />
            <Route path="/history" element={<PacketHistory />} />
            <Route path="/dfa" element={<DFAVisualizer />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
