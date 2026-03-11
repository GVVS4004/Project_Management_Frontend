import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TrendData } from "../types/dashboard.types";

interface TrendsChartProps {
  trends: TrendData;
}

const TrendsChart = ({ trends }: TrendsChartProps) => {
  const data = trends.tasksCreated.map((created, index) => ({
    date: new Date(created.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    Created: created.count,
    Completed: trends.tasksCompleted[index]?.count ?? 0,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Tasks Created vs Completed (Last {trends.period} Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            interval={Math.floor(data.length / 7)}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Created"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Completed"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsChart;
