import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Briefcase,
  Calendar,
  User,
  Clock,
  MessageCircle,
  Award,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";

import { getProjectById } from "../services/projectService";

import {
  applyToProject,
} from "../services/applicationService";

const StudentProjectDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [applying, setApplying] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getProjectById(id);

      setProject(data.project);
    } catch (error) {
      console.error(
        "Failed to load project:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      setError("");
      setSuccess("");

      await applyToProject(id);

      setSuccess(
        "Application submitted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to apply:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center text-zinc-400">
          <div className="flex items-center gap-3">
            <Loader2
              size={22}
              className="animate-spin"
            />
            Loading project...
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  if (error && !project) {
    return (
      <StudentDashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-red-400">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/student/projects")
            }
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-500"
          >
            Back to Projects
          </button>
        </div>
      </StudentDashboardLayout>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <StudentDashboardLayout>
      <div className="max-w-5xl">
        {/* Back */}

        <button
          onClick={() =>
            navigate("/student/projects")
          }
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        {/* Error */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        {/* Header */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Briefcase size={26} />
              </div>

              <div>
                <p className="text-sm text-indigo-400">
                  Project Opportunity
                </p>

                <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
                  {project.title}
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                  Posted by{" "}
                  <span className="text-zinc-300">
                    {project.createdBy?.name ||
                      "Recruiter"}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={
                applying ||
                project.status === "closed"
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Applying...
                </>
              ) : project.status === "closed" ? (
                "Project Closed"
              ) : (
                "Apply Now"
              )}
            </button>
          </div>

          {/* Description */}

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-white">
              About This Project
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-400">
              {project.description}
            </p>
          </div>

          {/* Skills */}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white">
              Required Skills
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {(project.requiredSkills || []).map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Compatibility Requirements */}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white">
              Project Requirements
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <Briefcase
                  size={20}
                  className="text-indigo-400"
                />

                <p className="mt-3 text-sm text-zinc-500">
                  Experience
                </p>

                <p className="mt-1 font-semibold text-white">
                  {project.experienceRequired ||
                    0}{" "}
                  years
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <Clock
                  size={20}
                  className="text-indigo-400"
                />

                <p className="mt-3 text-sm text-zinc-500">
                  Availability
                </p>

                <p className="mt-1 font-semibold text-white">
                  {project.availabilityRequired ||
                    0}{" "}
                  hrs/week
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <MessageCircle
                  size={20}
                  className="text-indigo-400"
                />

                <p className="mt-3 text-sm text-zinc-500">
                  Communication
                </p>

                <p className="mt-1 font-semibold text-white">
                  Level{" "}
                  {project.communicationRequired ||
                    3}
                  /5
                </p>
              </div>
            </div>
          </div>

          {/* Recruiter */}

          <div className="mt-8 border-t border-zinc-800 pt-8">
            <h2 className="text-lg font-semibold text-white">
              Recruiter
            </h2>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                <User size={20} />
              </div>

              <div>
                <p className="font-medium text-white">
                  {project.createdBy?.name ||
                    "Recruiter"}
                </p>

                <p className="text-sm text-zinc-500">
                  {project.createdBy?.email ||
                    "Email unavailable"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentProjectDetails;