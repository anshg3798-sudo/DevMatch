import {
  FolderKanban,
  Activity,
  Users,
  UserCheck,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import QuickActions from "../components/dashboard/QuickActions";

const RecruiterDashboard = () => {
  const stats = [
    {
      title: "Total Projects",
      value: "5",
      description: "Projects created",
      icon: FolderKanban,
    },
    {
      title: "Active Projects",
      value: "3",
      description: "Currently accepting applications",
      icon: Activity,
    },
    {
      title: "Applications",
      value: "24",
      description: "Developer applications received",
      icon: Users,
    },
    {
      title: "Developers Hired",
      value: "4",
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