
import { useEffect, useState } from "react";
import { getPackets } from "../services/api";
import ProtocolChart from "../components/ProtocolChart";
import ConnectionGraph from "../components/ConnectionGraph";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Network
} from "lucide-react";

function Dashboard() {
  const [packets, setPackets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPackets()
      .then((res) => setPackets(res.data.packets || []))
      .catch(() => setError("Unable to load packets"))
      .finally(() => setLoading(false));
  }, []);

  const total = packets.length;
  const valid = packets.filter(p => p.isValid).length;
  const invalid = total - valid;

  const countProtocol = (name) =>
    packets.filter(
      p => p.classification === name && p.isValid
    ).length;

  const stats = [
    { title: "Total Packets", value: total, icon: Network },
    { title: "Valid Packets", value: valid, icon: ShieldCheck },
    { title: "Invalid Packets", value: invalid, icon: ShieldAlert },
    { title: "TCP Packets", value: countProtocol("TCP"), icon: Activity }
  ];

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">NETWORK OVERVIEW</span>
          <h1>Network Dashboard</h1>
          <p>Monitor and analyze network packet records.</p>
        </div>
        <div className="live-pill">
          <span />
          PACKET MONITOR
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="stats-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={item.title}>
              <div className="stat-icon stat-icon-frame">
                <Icon size={25} />
              </div>
              <div className="stat-copy">
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="protocol-grid">
        {["TCP", "UDP", "ICMP"].map(protocol => (
          <div
            className={`protocol-card protocol-${protocol.toLowerCase()}`}
            key={protocol}
          >
            <div className="protocol-card-top">
              <span>{protocol}</span>
              <Network size={17} />
            </div>
            <h2>{countProtocol(protocol)}</h2>
            <small>Valid packets classified</small>
          </div>
        ))}
      </div>

      <section className="table-section">
        <div className="network-graph-panel">
          <div className="graph-heading">
            <div>
              <span className="eyebrow">TRAFFIC TOPOLOGY</span>
              <h2>IP Connection Graph</h2>
            </div>
            <span className="graph-legend">
              <i className="legend-live" />
              VALID = LIVE
              <i className="legend-static" />
              INVALID = STATIC
            </span>
          </div>
          <ConnectionGraph packets={packets} />
        </div>

        <div className="chart-panel">
          <ProtocolChart packets={packets} />
        </div>
        <div className="section-heading">
          <div>
            <span className="eyebrow">LATEST ACTIVITY</span>
            <h2>Recent Packets</h2>
          </div>
          <span className="section-count">{Math.min(packets.length, 5)} shown</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>Protocol</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {packets.slice(0, 5).map(packet => (
                <tr key={packet._id}>
                  <td>{packet.sourceIP}</td>
                  <td>{packet.destinationIP}</td>
                  <td>{packet.protocol}</td>
                  <td>{packet.service || packet.classification}</td>
                  <td>
                    <span className={
                      packet.isValid ? "status valid" : "status invalid"
                    }>
                      {packet.isValid ? "VALID" : "INVALID"}
                    </span>
                  </td>
                </tr>
              ))}

              {packets.length === 0 && (
                <tr>
                  <td colSpan="5">No packet records available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
