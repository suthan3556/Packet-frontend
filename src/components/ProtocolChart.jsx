
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ProtocolChart({ packets }) {
  const data = ["TCP", "UDP", "ICMP"].map(protocol => ({
    name: protocol,
    value: packets.filter(
      p => p.isValid && p.classification === protocol
    ).length
  }));

  const chartData = data.filter(item => item.value > 0);
  const colors = {
    TCP: "#6c7cff",
    UDP: "#23c6a5",
    ICMP: "#f6a64b"
  };

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <h2>Protocol Distribution</h2>
        <p>No classified packets available yet.</p>
      </div>
    );
  }

  return (
    <div className="protocol-chart">
      <h2>Protocol Distribution</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="48%"
            outerRadius={105}
            innerRadius={66}
            paddingAngle={4}
            label
          >
            {chartData.map(item => (
              <Cell key={item.name} fill={colors[item.name]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProtocolChart;
