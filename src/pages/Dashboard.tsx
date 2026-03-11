import { useMyStats } from "../features/dashboard/hooks/useDashboard";
import { useProjectStats } from "../features/dashboard/hooks/useDashboard";
import { useTrends } from "../features/dashboard/hooks/useDashboard";
import StatsCards from "../features/dashboard/components/StatsCards";
import StatusChart from "../features/dashboard/components/StatusChart";
import PriorityChart from "../features/dashboard/components/PriorityChart";
import TrendsChart from "../features/dashboard/components/TrendsChart";
import ProjectHealthCards from "../features/dashboard/components/ProjectHealthCards";

const Dashboard = () => {
  const { data: myStats, isLoading: statsLoading } = useMyStats();
  const { data: projectStats, isLoading: projectsLoading } = useProjectStats();
  const { data: trends, isLoading: trendsLoading } = useTrends(30);

  const isLoading = statsLoading || projectsLoading || trendsLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Summary Cards */}
      {myStats && <StatsCards stats={myStats} />}

      {/* Charts Row */}
      {myStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart stats={myStats} />
          <PriorityChart stats={myStats} />
        </div>
      )}

      {/* Trends */}
      {trends && <TrendsChart trends={trends} />}

      {/* Project Health */}
      {projectStats && <ProjectHealthCards projects={projectStats} />}
    </div>
  );
};

export default Dashboard;
