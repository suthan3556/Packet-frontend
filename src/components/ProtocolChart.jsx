
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

  if (chartData.length === 0) {
    return <p>No classified packets available.</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>Protocol Distribution</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((item, index) => (
              <Cell key={item.name} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProtocolChart;
