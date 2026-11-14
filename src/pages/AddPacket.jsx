
import { useState } from "react";
import { ArrowRight } from "lucide-react";
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
          <span className="eyebrow">TRAFFIC ANALYSIS</span>
          <h1>Add Network Packet</h1>
          <p>Enter packet details for validation and classification.</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-intro">
            <h2>Packet details</h2>
            <p>Define the endpoints and protocol to inspect.</p>
          </div>

          <div className="form-fields">
            <div className="field-group">
              <label htmlFor="sourceIP">Source IP Address</label>
              <input
                id="sourceIP"
                name="sourceIP"
                value={form.sourceIP}
                onChange={handleChange}
                placeholder="192.168.1.10"
                inputMode="decimal"
                autoComplete="off"
                required
              />
              <small className="field-hint">IPv4 · 4 octets, each 0–255</small>
            </div>

            <div className="field-group">
              <label htmlFor="destinationIP">Destination IP Address</label>
              <input
                id="destinationIP"
                name="destinationIP"
                value={form.destinationIP}
                onChange={handleChange}
                placeholder="192.168.1.20"
                inputMode="decimal"
                autoComplete="off"
                required
              />
              <small className="field-hint">IPv4 · 4 octets, each 0–255</small>
            </div>

            <div className="field-group">
              <label htmlFor="protocol">Protocol</label>
              <select
                id="protocol"
                name="protocol"
                value={form.protocol}
                onChange={handleChange}
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="sourcePort">Source Port</label>
              <input
                id="sourcePort"
                type="number"
                name="sourcePort"
                value={form.sourcePort}
                onChange={handleChange}
                min="0"
                max="65535"
              />
            </div>

            <div className="field-group">
              <label htmlFor="destinationPort">Destination Port</label>
              <input
                id="destinationPort"
                type="number"
                name="destinationPort"
                value={form.destinationPort}
                onChange={handleChange}
                min="0"
                max="65535"
              />
            </div>
          </div>

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Validate Packet"}
          </button>
        </form>

        {result && (
          <div className="result-card">
            <div className="result-heading">
              <span className={`result-indicator ${result.isValid ? "is-valid" : "is-invalid"}`} />
              <h2 className={result.isValid ? "success" : "error"}>
                {result.isValid ? "Packet Valid" : "Packet Invalid"}
              </h2>
            </div>

            <p>
              Classification: {result.classification || "UNKNOWN"}
            </p>

            <p>
              Service: {result.service || "UNKNOWN"}
            </p>

            {result.sourceIP && result.destinationIP && (
              <section className="connection-diagram">
                <h3>IP Address Connection Diagram</h3>
                <div className="connection-flow">
                  <div className="connection-endpoint">
                    <span>Source</span>
                    <strong>{result.sourceIP}</strong>
                    {result.protocol !== "ICMP" && result.sourcePort != null && (
                      <small>Port {result.sourcePort}</small>
                    )}
                  </div>

                  <div className="connection-link" aria-label="connects to">
                    <ArrowRight size={24} />
                    <span>{result.protocol}</span>
                  </div>

                  <div className="connection-endpoint">
                    <span>Destination</span>
                    <strong>{result.destinationIP}</strong>
                    {result.protocol !== "ICMP" && result.destinationPort != null && (
                      <small>Port {result.destinationPort}</small>
                    )}
                  </div>
                </div>
              </section>
            )}

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
