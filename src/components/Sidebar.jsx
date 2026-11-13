
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Network,
  GitBranch
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Network size={27} />
        <h2>NetGuard</h2>
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

      <div className="sidebar-footer">
        Network Packet Validator
        <small>Version 1.0</small>
      </div>
    </aside>
  );
}

export default Sidebar;
