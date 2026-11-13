
import { useState } from "react";
import { addPacket } from "../services/api";

function AddPacket() {
  const [form, setForm] = useState({
    sourceIP: "",
    destinationIP: "",
    protocol: "TCP",
    sourcePort: "5000",
    destinationPort: "443"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await addPacket(form);
      setResult(response.data.packet);

      setForm({
        sourceIP: "",
        destinationIP: "",
        protocol: "TCP",
        sourcePort: "5000",
        destinationPort: "443"
      });
    } catch (error) {
      setResult({
        isValid: false,
        errors: [
          error.response?.data?.message || "Server connection failed"
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Add Network Packet</h1>
          <p>Enter packet details for validation and classification.</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <label>Source IP Address</label>
          <input
            name="sourceIP"
            value={form.sourceIP}
            onChange={handleChange}
            placeholder="192.168.1.10"
            required
          />

          <label>Destination IP Address</label>
          <input
            name="destinationIP"
            value={form.destinationIP}
            onChange={handleChange}
            placeholder="192.168.1.20"
            required
          />

          <label>Protocol</label>
          <select
            name="protocol"
            value={form.protocol}
            onChange={handleChange}
          >
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="ICMP">ICMP</option>
          </select>

          <label>Source Port</label>
          <input
            type="number"
            name="sourcePort"
            value={form.sourcePort}
            onChange={handleChange}
            min="0"
            max="65535"
          />

          <label>Destination Port</label>
          <input
            type="number"
            name="destinationPort"
            value={form.destinationPort}
            onChange={handleChange}
            min="0"
            max="65535"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Validate Packet"}
          </button>
        </form>

        {result && (
          <div className="result-card">
            <h2 className={result.isValid ? "success" : "error"}>
              {result.isValid ? "Packet Valid" : "Packet Invalid"}
            </h2>

            <p>
              Classification: {result.classification || "UNKNOWN"}
            </p>

            <p>
              Service: {result.service || "UNKNOWN"}
            </p>

            {result.errors?.length > 0 && (
              <>
                <h3>Validation Errors</h3>
                {result.errors.map((error, index) => (
                  <p key={index} className="error">
                    • {error}
                  </p>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPacket;
