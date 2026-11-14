
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Network,
  GitBranch,
  Moon,
  Sun
} from "lucide-react";

function Sidebar({ theme, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Network size={23} />
        </div>
        <div className="brand-copy">
          <h2>NetGuard</h2>
          <span>PACKET INTELLIGENCE</span>
        </div>
      </div>

      <p className="menu-title">MAIN MENU</p>

      <NavLink to="/" end>
        <LayoutDashboard size={19} />
        Dashboard
      </NavLink>

      <NavLink to="/add-packet">
        <PlusCircle size={19} />
        Add Packet
      </NavLink>

      <NavLink to="/history">
        <History size={19} />
        Packet History
      </NavLink>

      <NavLink to="/dfa">
        <GitBranch size={19} />
        DFA Visualizer
      </NavLink>

      <div className="sidebar-bottom">
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        <div className="sidebar-footer">
          <span className="sidebar-footer-mark" />
          <div>
            <strong>Network Packet Validator</strong>
            <small>Protocol analysis workspace</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
