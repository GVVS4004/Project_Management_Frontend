import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MyStats } from "../types/dashboard.types";

interface StatusChartProps {
  stats: MyStats;
}

const STATUS_COLORS: Record<string, string> = {
  TODO: "#94a3b8",
  IN_PROGRESS: "#3b82f6",
  BLOCKED: "#ef4444",
  REVIEW: "#f59e0b",
  TESTING: "#8b5cf6",
  DONE: "#22c55e",
  ABANDONED: "#6b7280",
};

const StatusChart = ({ stats }: StatusChartProps) => {
  const data = Object.entries(stats.tasksByStatus).map(([status, count]) => ({
    status: status.replace("_", " "),
    count,
    fill: STATUS_COLORS[status] || "#94a3b8",
  }));

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Tasks by Status
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="status" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="count"
            shape={(props: any) => {
              const { x, y, width, height, index } = props;
              return <rect x={x} y={y} width={width} height={height} rx={4} ry={4} fill={data[index].fill} />;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusChart;
