import { useEffect, useState } from "react";
import {
  FolderKanban,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";
import { getAllProjects } from "../services/projectService";

const StudentProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProjects();

        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to load projects:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={22}
              className="animate-spin"
            />

            <span>Loading projects...</span>
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
          Browse Projects
        </h1>

        <p className="mt-2 text-zinc-400">
          Discover projects posted by recruiters and find
          opportunities that match your skills.
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

      {!error && projects.length === 0 && (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
          <FolderKanban
            size={42}
            className="mx-auto text-zinc-600"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No projects available
          </h2>

          <p className="mt-2 text-zinc-500">
            Recruiters haven't posted any projects yet.
          </p>
        </div>
      )}

      {/* Project Grid */}

      {!error && projects.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-indigo-500/30"
            >
              {/* Icon */}

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <FolderKanban size={21} />
              </div>

              {/* Title */}

              <h2 className="mt-5 text-xl font-semibold text-white">
                {project.title}
              </h2>

              {/* Description */}

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                {project.description}
              </p>

              {/* Skills */}

              <div className="mt-5 flex flex-wrap gap-2">
                {project.requiredSkills?.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

              {/* Recruiter */}

              {project.createdBy && (
                <p className="mt-5 text-xs text-zinc-500">
                  Posted by{" "}
                  <span className="text-zinc-300">
                    {project.createdBy.name}
                  </span>
                </p>
              )}

              {/* Button */}

              <button
                onClick={() =>
                  navigate(
                    `/student/projects/${project._id}`
                  )
                }
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                View Project
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </StudentDashboardLayout>
  );
};

export default StudentProjects;