import { useEffect, useState } from "react";
import { Plus, FolderOpen, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProjectCard from "../components/project/ProjectCard";

import { getMyProjects } from "../services/projectService";

const MyProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProjects();

        setProjects(data.projects || []);

      } catch (error) {
        console.error("Failed to fetch projects:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load your projects."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-3xl font-bold text-white">
            My Projects
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage the projects you have created.
          </p>
        </div>

        <button
          onClick={() => navigate("/recruiter/create-project")}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus size={18} />
          Create Project
        </button>

      </div>

      {/* Loading */}

      {loading && (
        <div className="flex min-h-80 items-center justify-center">

          <div className="flex items-center gap-3 text-zinc-400">

            <Loader2
              size={22}
              className="animate-spin"
            />

            Loading your projects...

          </div>

        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
          {error}
        </div>
      )}

      {/* Projects */}

      {!loading && !error && projects.length > 0 && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">

          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}

        </div>
      )}

      {/* Empty State */}

      {!loading && !error && projects.length === 0 && (
        <div className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <FolderOpen size={26} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            No projects yet
          </h2>

          <p className="mt-2 max-w-md text-sm text-zinc-500">
            Create your first project and start finding
            developers for your team.
          </p>

          <button
            onClick={() => navigate("/recruiter/create-project")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Create Your First Project
          </button>

        </div>
      )}

    </DashboardLayout>
  );
};

export default MyProjects;