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

interface PriorityChartProps {
  stats: MyStats;
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

const PriorityChart = ({ stats }: PriorityChartProps) => {
  const data = Object.entries(stats.tasksByPriority).map(
    ([priority, count]) => ({
      priority,
      count,
      fill: PRIORITY_COLORS[priority] || "#94a3b8",
    }),
  );

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Tasks by Priority
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="priority" tick={{ fontSize: 11 }} />
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

export default PriorityChart;
