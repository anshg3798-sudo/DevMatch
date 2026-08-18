import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Mail,
  User,
  Pencil,
  Trash2,
  Loader2
} from "lucide-react";

import { getProjectById,deleteProject } from "../services/projectService";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [deleting, setDeleting] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const handleDelete = async () => {
    try {
        setDeleting(true);
        setError("");

        await deleteProject(project._id);

        navigate("/recruiter/projects");

    } catch (error) {
        console.error("Failed to delete project:", error);

        setError(
            error.response?.data?.message ||
            "Failed to delete project."
        );

        setShowDeleteModal(false);

    } finally {
        setDeleting(false);
    }
};
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjectById(id);

        setProject(data.project);
      } catch (error) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>

        <button
          onClick={() => navigate("/recruiter/projects")}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
        >
          Back to My Projects
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/recruiter/projects")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to My Projects
        </button>

        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Briefcase
                  size={26}
                  className="text-indigo-400"
                />
              </div>

              <div>
                <p className="text-sm text-indigo-400 mb-1">
                  Project Details
                </p>

                <h1 className="text-2xl md:text-3xl font-semibold">
                  {project.title}
                </h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
               onClick={() =>
                 navigate(`/recruiter/projects/${project._id}/edit`)
                    }
               className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
                >
  <Pencil size={16} />
  Edit
</button>

              <button
                 onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">
              About This Project
            </h2>

            <p className="text-zinc-400 leading-7">
              {project.description}
            </p>
          </div>

          {/* Required Skills */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {project.requiredSkills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Project Information */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Created At */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Calendar
                  size={18}
                  className="text-indigo-400"
                />

                <span className="text-sm text-zinc-500">
                  Created
                </span>
              </div>

              <p className="text-zinc-200">
                {new Date(project.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            {/* Creator */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <User
                  size={18}
                  className="text-indigo-400"
                />

                <span className="text-sm text-zinc-500">
                  Created By
                </span>
              </div>

              <p className="text-zinc-200">
                {project.createdBy?.name || "Unknown"}
              </p>
            </div>
          </div>

          {/* Creator Email */}
          <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Mail
                size={18}
                className="text-indigo-400"
              />

              <span className="text-sm text-zinc-500">
                Creator Email
              </span>
            </div>

            <p className="text-zinc-200">
              {project.createdBy?.email || "Not available"}
            </p>
          </div>
        </div>
      </div>
    {showDeleteModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">

            <div className="mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <Trash2 size={22} />
                </div>

                <h2 className="mt-4 text-xl font-semibold text-white">
                    Delete Project?
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-zinc-200">
                        "{project.title}"
                    </span>
                    ? This action cannot be undone.
                </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                    type="button"
                    disabled={deleting}
                    onClick={() => setShowDeleteModal(false)}
                    className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {deleting ? (
                        <>
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 size={16} />
                            Delete Project
                        </>
                    )}
                </button>

            </div>
        </div>
    </div>
)}
  </div>
  );
};

export default ProjectDetails;