
import { useEffect, useState } from "react";
import { Network, Search } from "lucide-react";
import ConnectionGraph from "../components/ConnectionGraph";
import { getPackets, deletePacket } from "../services/api";

function PacketHistory() {
  const [packets, setPackets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedPacket, setSelectedPacket] = useState(null);

  const loadPackets = async () => {
    try {
      const response = await getPackets();
      setPackets(response.data.packets || []);
    } catch (error) {
      console.error("Unable to load packet history", error);
    }
  };

  useEffect(() => {
    loadPackets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this packet?")) return;

    try {
      await deletePacket(id);
      setPackets(old => old.filter(p => p._id !== id));
      setSelectedPacket(old => old?._id === id ? null : old);
    } catch {
      alert("Unable to delete packet");
    }
  };

  const filteredPackets = packets.filter(packet => {
    const term = search.toLowerCase();

    const matchesSearch = [
      packet.sourceIP,
      packet.destinationIP,
      packet.protocol,
      packet.classification
    ].some(value => String(value || "").toLowerCase().includes(term));

    const matchesFilter =
      filter === "ALL" ||
      (filter === "VALID" && packet.isValid) ||
      (filter === "INVALID" && !packet.isValid);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PACKET ARCHIVE</span>
          <h1>Packet History</h1>
          <p>Search and manage all saved network packets.</p>
        </div>
      </div>

      <div className="history-controls">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search IP address or protocol"
            placeholder="Search IP address or protocol..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          aria-label="Filter packets by validation status"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="ALL">All Packets</option>
          <option value="VALID">Valid</option>
          <option value="INVALID">Invalid</option>
        </select>
      </div>

      <div className="table-section">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>Protocol</th>
                <th>Service</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPackets.map(packet => (
                <tr
                  key={packet._id}
                  className={selectedPacket?._id === packet._id ? "selected-history-row" : ""}
                  onClick={() => setSelectedPacket(packet)}
                >
                  <td>{packet.sourceIP}</td>
                  <td>{packet.destinationIP}</td>
                  <td>{packet.protocol}</td>
                  <td>{packet.service || "UNKNOWN"}</td>
                  <td>
                    <span className={
                      packet.isValid ? "status valid" : "status invalid"
                    }>
                      {packet.isValid ? "VALID" : "INVALID"}
                    </span>
                  </td>
                  <td>
                    <div className="history-actions">
                      <button
                        className="history-graph-btn"
                        aria-pressed={selectedPacket?._id === packet._id}
                        onClick={event => {
                          event.stopPropagation();
                          setSelectedPacket(packet);
                        }}
                      >
                        <Network size={14} />
                        Graph
                      </button>
                    <button
                      className="delete-btn"
                      onClick={event => {
                        event.stopPropagation();
                        handleDelete(packet._id);
                      }}
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPackets.length === 0 && (
                <tr>
                  <td colSpan="6">No matching packets found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedPacket && (
          <section className="history-graph-panel" aria-live="polite">
            <div className="history-graph-heading">
              <div>
                <span className="eyebrow">SELECTED PACKET</span>
                <h2>IP Connection Graph</h2>
                <p>
                  {selectedPacket.sourceIP} → {selectedPacket.destinationIP}
                </p>
              </div>
              <span className={`status ${selectedPacket.isValid ? "valid" : "invalid"}`}>
                {selectedPacket.isValid ? "VALID" : "INVALID"}
              </span>
            </div>
            <ConnectionGraph packets={[selectedPacket]} />
          </section>
        )}
      </div>
    </div>
  );
}

export default PacketHistory;
