import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FolderKanban,
  Loader2,
  AlertCircle,
  User,
  Mail,
  CheckCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";
import { getProjectById } from "../services/projectService";
import { applyToProject } from "../services/applicationService";
const StudentProjectDetails = () => {
const { id } = useParams();
const navigate = useNavigate();

const [project, setProject] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [applying, setApplying] = useState(false);
const [applicationMessage, setApplicationMessage] = useState("");
const [applicationError, setApplicationError] = useState("");
const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjectById(id);

        setProject(data.project);
      } catch (error) {
        console.error("Failed to load project:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={22}
              className="animate-spin"
            />

            <span>Loading project...</span>
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  // Error
  if (error) {
    return (
      <StudentDashboardLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} />

            <p>{error}</p>
          </div>

          <button
            onClick={() => navigate("/student/projects")}
            className="mt-5 flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-white transition hover:bg-zinc-700"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>
        </div>
      </StudentDashboardLayout>
    );
  }

  // Project not found
  if (!project) {
    return (
      <StudentDashboardLayout>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
          <h2 className="text-xl font-semibold text-white">
            Project not found
          </h2>

          <button
            onClick={() => navigate("/student/projects")}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Back to Projects
          </button>
        </div>
      </StudentDashboardLayout>
    );
  }
  const handleApply = async () => {
  try {
    setApplying(true);
    setApplicationMessage("");
    setApplicationError("");

    const data = await applyToProject(id);

    setApplied(true);

    setApplicationMessage(
      data.message || "Application submitted successfully."
    );
  } catch (error) {
    console.error("Application failed:", error);

    setApplicationError(
      error.response?.data?.message ||
        "Failed to submit application."
    );
  } finally {
    setApplying(false);
  }
};

  return (
    <StudentDashboardLayout>
      {/* Back button */}

      <button
        onClick={() => navigate("/student/projects")}
        className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={17} />

        Back to Projects
      </button>

      {/* Project Header */}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                <FolderKanban size={26} />
              </div>

              <div>
                <p className="text-sm text-indigo-400">
                  Project Details
                </p>

                <h1 className="mt-1 text-3xl font-bold text-white">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Apply button will be added in the next step */}

         <button
  onClick={handleApply}
  disabled={applying || applied}
  className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition ${
    applied
      ? "cursor-not-allowed bg-emerald-600"
      : "bg-indigo-600 hover:bg-indigo-500"
  } ${
    applying
      ? "cursor-not-allowed opacity-60"
      : ""
  }`}
>
  {applying ? (
    <>
      <Loader2
        size={18}
        className="animate-spin"
      />

      Applying...
    </>
  ) : applied ? (
    <>
      <CheckCircle size={18} />

      Applied
    </>
  ) : (
    <>
      <CheckCircle size={18} />

      Apply to Project
    </>
  )}
</button>
{applicationMessage && (
  <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
    {applicationMessage}
  </div>
)}

{applicationError && (
  <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
    {applicationError}
  </div>
)}
        </div>
      </div>

      {/* Main content */}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* About */}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">
            About This Project
          </h2>

          <p className="mt-4 leading-7 text-zinc-400">
            {project.description}
          </p>

          {/* Required Skills */}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white">
              Required Skills
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.requiredSkills?.length > 0 ? (
                project.requiredSkills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-zinc-500">
                  No specific skills listed.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Recruiter */}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">
            Project Owner
          </h2>

          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                <User size={18} />
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Name
                </p>

                <p className="text-sm text-white">
                  {project.createdBy?.name ||
                    "Unknown recruiter"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                <Mail size={18} />
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Email
                </p>

                <p className="break-all text-sm text-white">
                  {project.createdBy?.email ||
                    "Email unavailable"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentProjectDetails;