
import { useEffect, useState } from "react";
import { getPackets, deletePacket } from "../services/api";

function PacketHistory() {
  const [packets, setPackets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

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
          <h1>Packet History</h1>
          <p>Search and manage all saved network packets.</p>
        </div>
      </div>

      <div className="history-controls">
        <input
          placeholder="Search IP address or protocol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
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
                <tr key={packet._id}>
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
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(packet._id)}
                    >
                      Delete
                    </button>
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
      </div>
    </div>
  );
}

export default PacketHistory;
