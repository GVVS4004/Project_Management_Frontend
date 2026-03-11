import type { MyStats } from "../types/dashboard.types";

interface StatsCardsProps {
  stats: MyStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      label: "Active Tasks",
      value: stats.totalAssignedTasks,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Overdue",
      value: stats.overdueTaskCount,
      color: "bg-red-500",
      lightColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      label: "Completed",
      value: stats.tasksByStatus["DONE"] ?? 0,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "My Projects",
      value: stats.totalProjects,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.lightColor} rounded-lg p-5 border`}
        >
          <p className="text-sm font-medium text-gray-500">{card.label}</p>
          <p className={`text-3xl font-bold mt-1 ${card.textColor}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
