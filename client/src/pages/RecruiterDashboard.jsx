import { useEffect, useState } from "react";
import {
  FolderKanban,
  Activity,
  Users,
  UserCheck,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import QuickActions from "../components/dashboard/QuickActions";
import { getRecruiterStats } from "../services/projectService";
const RecruiterDashboard = () => {
 const [statsData, setStatsData] = useState({
  totalProjects: 0,
  activeProjects: 0,
  totalApplications: 0,
  developersHired: 0,
});

const [loadingStats, setLoadingStats] = useState(true); 
 useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      const data = await getRecruiterStats();

      setStatsData(data.stats);
    } catch (error) {
      console.error(
        "Failed to load recruiter stats:",
        error
      );
    } finally {
      setLoadingStats(false);
    }
  };

  fetchStats();
}, []);
 const stats = [
  {
    title: "Total Projects",
    value: loadingStats
      ? "..."
      : statsData.totalProjects,
    description: "Projects created",
    icon: FolderKanban,
  },
  {
    title: "Active Projects",
    value: loadingStats
      ? "..."
      : statsData.activeProjects,
    description: "Currently accepting applications",
    icon: Activity,
  },
  {
    title: "Applications",
    value: loadingStats
      ? "..."
      : statsData.totalApplications,
    description: "Developer applications received",
    icon: Users,
  },
  {
    title: "Developers Hired",
    value: loadingStats
      ? "..."
      : statsData.developersHired,
    description: "Successful project matches",
    icon: UserCheck,
  },
];

  return (
    <DashboardLayout>
      {/* Page Heading */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Recruiter Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage your projects and find the best developers.
        </p>
      </div>

      {/* Stats */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Dashboard Content */}

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <RecentProjects />

        <QuickActions />
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;