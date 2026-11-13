
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddPacket from "./pages/AddPacket";
import PacketHistory from "./pages/PacketHistory";
import DFAVisualizer from "./pages/DFAVisualizer";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

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
