import { useEffect, useState } from "react";
import {
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";
import { getMyApplications } from "../services/applicationService";

const StudentApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyApplications();

        setApplications(data.applications || []);
      } catch (error) {
        console.error(
          "Failed to load applications:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    if (status === "Accepted") {
      return <CheckCircle size={18} />;
    }

    if (status === "Rejected") {
      return <XCircle size={18} />;
    }

    return <Clock size={18} />;
  };

  const getStatusClass = (status) => {
    if (status === "Accepted") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (status === "Rejected") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  };

  const getStatusText = (status) => {
    return status || "Pending";
  };

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={22}
              className="animate-spin"
            />

            <span>Loading your applications...</span>
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          My Applications
        </h1>

        <p className="mt-2 text-zinc-400">
          Track the projects you have applied to and view
          their current status.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <AlertCircle size={20} />

          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}

      {!error && applications.length === 0 && (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
          <FileText
            size={42}
            className="mx-auto text-zinc-600"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No applications yet
          </h2>

          <p className="mt-2 text-zinc-500">
            You haven't applied to any projects yet.
          </p>

          <button
            onClick={() =>
              navigate("/student/projects")
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Browse Projects

            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Applications */}

      {!error && applications.length > 0 && (
        <div className="mt-8 space-y-5">
          {applications.map((application) => {
            const project = application.project;

            return (
              <div
                key={application._id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Project information */}

                  <div className="min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <FileText size={21} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-xl font-semibold text-white">
                          {project?.title ||
                            "Project unavailable"}
                        </h2>

                        {project?.description && (
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}

                  <div
                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {getStatusIcon(
                      application.status
                    )}

                    {getStatusText(
                      application.status
                    )}
                  </div>
                </div>

                {/* Bottom information */}

                <div className="mt-6 grid gap-4 border-t border-zinc-800 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Compatibility */}

                  <div>
                    <p className="text-xs text-zinc-500">
                      Compatibility Score
                    </p>

                    <p className="mt-1 text-2xl font-bold text-indigo-400">
                      {application.compatibilityScore ??
                        0}
                      %
                    </p>
                  </div>

                  {/* Required skills */}

                  <div>
                    <p className="text-xs text-zinc-500">
                      Required Skills
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {project?.requiredSkills
                        ?.slice(0, 4)
                        .map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Application date */}

                  <div>
                    <p className="text-xs text-zinc-500">
                      Applied On
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* View project */}

                {project?._id && (
                  <div className="mt-5 border-t border-zinc-800 pt-5">
                    <button
                      onClick={() =>
                        navigate(
                          `/student/projects/${project._id}`
                        )
                      }
                      className="flex items-center gap-2 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
                    >
                      View Project

                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </StudentDashboardLayout>
  );
};

export default StudentApplications;