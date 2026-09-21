import { useEffect, useState } from "react";

import {
  FolderKanban,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";

import { getAllProjects } from "../services/projectService";
import { getMyApplications } from "../services/applicationService";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: 0,
    applications: 0,
    accepted: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [projectData, applicationData] =
          await Promise.all([
            getAllProjects(),
            getMyApplications(),
          ]);

        const projects = projectData.projects || [];
        const applications =
          applicationData.applications || [];

        const accepted = applications.filter(
          (application) =>
            application.status === "Accepted"
        ).length;

        const pending = applications.filter(
          (application) =>
            !application.status ||
            application.status === "Pending"
        ).length;

        setStats({
          projects: projects.length,
          applications: applications.length,
          accepted,
          pending,
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Available Projects",
      value: stats.projects,
      description: "Projects you can apply to",
      icon: FolderKanban,
    },
    {
      title: "Applications",
      value: stats.applications,
      description: "Applications submitted",
      icon: FileText,
    },
    {
      title: "Accepted",
      value: stats.accepted,
      description: "Applications accepted",
      icon: CheckCircle,
    },
    {
      title: "Pending",
      value: stats.pending,
      description: "Applications awaiting review",
      icon: Clock,
    },
  ];

  return (
    <StudentDashboardLayout>
      {/* Page Heading */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Student Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Discover projects, apply to opportunities, and
          build your developer profile.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <AlertCircle size={20} />

          <p>{error}</p>
        </div>
      )}

      {/* Stats */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-5 text-sm text-zinc-400">
                {stat.title}
              </p>

              <div className="mt-1 flex items-center gap-2">
                {loading && (
                  <Loader2
                    size={18}
                    className="animate-spin text-zinc-500"
                  />
                )}

                <p className="text-3xl font-bold text-white">
                  {loading ? "-" : stat.value}
                </p>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        {/* Find Projects */}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Find Projects
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Explore projects that match your skills.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/student/projects")
              }
              className="flex items-center gap-2 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Browse
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-zinc-700 p-8 text-center">
            <Search
              size={34}
              className="mx-auto text-zinc-600"
            />

            <h3 className="mt-4 font-medium text-white">
              Discover your next project
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Browse projects posted by recruiters and
              find opportunities that match your skills.
            </p>

            <button
              onClick={() =>
                navigate("/student/projects")
              }
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Browse Projects
            </button>
          </div>
        </section>

        {/* Quick Actions */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Frequently used student actions
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() =>
                navigate("/student/projects")
              }
              className="flex w-full items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left transition hover:border-indigo-500/30 hover:bg-zinc-900"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Search size={19} />
              </div>

              <div>
                <p className="font-medium text-white">
                  Browse Projects
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Find projects to apply for
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                navigate("/student/applications")
              }
              className="flex w-full items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left transition hover:border-indigo-500/30 hover:bg-zinc-900"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <FileText size={19} />
              </div>

              <div>
                <p className="font-medium text-white">
                  My Applications
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Track your applications
                </p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentDashboard;