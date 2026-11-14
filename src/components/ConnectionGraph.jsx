function ConnectionGraph({ packets }) {
  const flows = packets.slice(0, 6);
  const rowHeight = 58;
  const height = Math.max(190, flows.length * rowHeight + 20);

  if (flows.length === 0) {
    return (
      <div className="connection-graph-empty">
        <p>No packet connections to visualize yet.</p>
      </div>
    );
  }

  const formatEndpoint = (ip, port, protocol) =>
    protocol === "ICMP" || port == null ? ip : `${ip}:${port}`;

  const renderEndpoint = (ip, port, protocol, x, centerY) => {
    const address = String(ip || "");
    const octets = address.split(".");
    const isIPv4 = octets.length === 4 && octets.every(octet => /^\d{1,3}$/.test(octet));

    if (!isIPv4) {
      return (
        <text className="graph-node-ip" x={x} y={centerY + 11}>
          {formatEndpoint(ip, port, protocol)}
        </text>
      );
    }

    return (
      <g className="graph-ipv4">
        {octets.map((octet, index) => {
          const octetX = x + index * 32;

          return (
            <g
              className={Number(octet) > 255 ? "invalid-octet" : ""}
              key={`${index}-${octet}`}
            >
              <rect x={octetX} y={centerY + 1} width="26" height="17" rx="4" />
              <text
                className="graph-octet"
                x={octetX + 13}
                y={centerY + 13}
                textAnchor="middle"
              >
                {octet}
              </text>
              {index < 3 && (
                <text className="graph-octet-dot" x={octetX + 27} y={centerY + 13}>
                  .
                </text>
              )}
            </g>
          );
        })}
        {protocol !== "ICMP" && port != null && (
          <text className="graph-port" x={x + 132} y={centerY + 13}>
            :{port}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="connection-graph-scroll">
      <svg
        className="connection-graph"
        viewBox={`0 0 900 ${height}`}
        role="img"
        aria-label="Graph of source and destination IP address connections"
      >
        <defs>
          <marker
            id="connection-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
          </marker>
        </defs>

        {flows.map((packet, index) => {
          const centerY = 30 + index * rowHeight;
          const protocol = String(packet.protocol || "UNKNOWN").toLowerCase();
          const status = packet.isValid ? "valid" : "invalid";

          return (
            <g
              className={`connection-flow-row protocol-${protocol} flow-${status}`}
              key={packet._id || `${packet.sourceIP}-${packet.destinationIP}-${index}`}
            >
              <rect
                className="graph-node"
                x="18"
                y={centerY - 21}
                width="226"
                height="42"
                rx="9"
              />
              <g className="graph-device-icon" transform={`translate(30 ${centerY - 7})`}>
                <rect x="0" y="0" width="15" height="11" rx="2" />
                <path d="M7.5 11v3M4 14h7" />
              </g>
              <text className="graph-node-label" x="53" y={centerY - 5}>
                SOURCE
              </text>
              {renderEndpoint(packet.sourceIP, packet.sourcePort, packet.protocol, 53, centerY)}

              <path
                id={`connection-path-${index}`}
                className="graph-edge"
                d={`M 244 ${centerY} C 365 ${centerY}, 535 ${centerY}, 656 ${centerY}`}
                markerEnd="url(#connection-arrow)"
              />
              <rect
                className="graph-edge-label-bg"
                x="383"
                y={centerY - 11}
                width="134"
                height="22"
                rx="11"
              />
              <text
                className="graph-edge-label"
                x="450"
                y={centerY + 3}
                textAnchor="middle"
              >
                {packet.protocol || "UNKNOWN"} · {status.toUpperCase()}
              </text>
              {packet.isValid && (
                <circle className="graph-packet" r="3">
                  <animateMotion
                    dur={`${2.8 + (index % 3) * 0.45}s`}
                    begin={`${index * 0.24}s`}
                    repeatCount="indefinite"
                    path={`M 244 ${centerY} C 365 ${centerY}, 535 ${centerY}, 656 ${centerY}`}
                  />
                </circle>
              )}

              <rect
                className="graph-node"
                x="656"
                y={centerY - 21}
                width="226"
                height="42"
                rx="9"
              />
              <g className="graph-device-icon" transform={`translate(668 ${centerY - 7})`}>
                <rect x="0" y="0" width="15" height="11" rx="2" />
                <path d="M7.5 11v3M4 14h7" />
              </g>
              <text className="graph-node-label" x="691" y={centerY - 5}>
                DESTINATION
              </text>
              {renderEndpoint(packet.destinationIP, packet.destinationPort, packet.protocol, 691, centerY)}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default ConnectionGraph;
