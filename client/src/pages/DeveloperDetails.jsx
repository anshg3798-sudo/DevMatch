import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Code2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Briefcase,
  Clock,
  MessageCircle,
  FolderKanban,
  FileText,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { getDeveloperById } from "../services/userService";

const DeveloperDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDeveloper = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDeveloperById(id);

      setDeveloper(data.developer);
    } catch (error) {
      console.error("Failed to load developer:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load developer profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeveloper();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={24}
              className="animate-spin"
            />
            Loading developer profile...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mt-8">
          <button
            onClick={() => navigate("/recruiter/search")}
            className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Developers
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!developer) {
    return (
      <DashboardLayout>
        <div className="mt-8 text-center">
          <p className="text-zinc-500">
            Developer not found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back button */}

      <button
        onClick={() => navigate("/recruiter/search")}
        className="mb-8 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Developers
      </button>

      {/* Profile Header */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
            <User size={36} />
          </div>

          {/* Basic Information */}

          <div>
            <h1 className="text-3xl font-bold text-white">
              {developer.name}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-zinc-400">
              <Mail size={17} />
              <span>{developer.email}</span>
            </div>

            <div className="mt-2">
              <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                Student / Developer
              </span>
            </div>
          </div>
        </div>
      </div>
     {/* Developer Statistics */}

<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

  {/* Experience */}

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
    <div className="flex items-center gap-2 text-zinc-500">
      <Briefcase size={17} />
      <span className="text-sm">
        Experience
      </span>
    </div>

    <p className="mt-3 text-xl font-semibold text-white">
      {developer.experienceYears ?? 0} years
    </p>
  </div>

  {/* Availability */}

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
    <div className="flex items-center gap-2 text-zinc-500">
      <Clock size={17} />
      <span className="text-sm">
        Availability
      </span>
    </div>

    <p className="mt-3 text-xl font-semibold text-white">
      {developer.availabilityHours ?? 0} hrs/week
    </p>
  </div>

  {/* Communication */}

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
    <div className="flex items-center gap-2 text-zinc-500">
      <MessageCircle size={17} />
      <span className="text-sm">
        Communication
      </span>
    </div>

    <p className="mt-3 text-xl font-semibold text-white">
      {developer.communicationRating ?? 3}/5
    </p>
  </div>

  {/* Projects */}

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
    <div className="flex items-center gap-2 text-zinc-500">
      <FolderKanban size={17} />
      <span className="text-sm">
        Projects
      </span>
    </div>

    <p className="mt-3 text-xl font-semibold text-white">
      {developer.projects?.length ??
        developer.projectsCount ??
        0}
    </p>
  </div>

</div>
      {/* Main Content */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Skills */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Code2 size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Skills
              </h2>

              <p className="text-sm text-zinc-500">
                Technical skills of this developer
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {developer.skills?.length > 0 ? (
              developer.skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-zinc-600">
                No skills added yet.
              </p>
            )}
          </div>
        </div>

        {/* Developer Links */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <ExternalLink size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Developer Links
              </h2>

              <p className="text-sm text-zinc-500">
                External profiles and portfolios
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {developer.github && (
              <a
                href={developer.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              >
                <ExternalLink size={17} />
                GitHub
              </a>
            )}

            {developer.leetcode && (
              <a
                href={developer.leetcode}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              >
                <Code2 size={17} />
                LeetCode
              </a>
            )}

            {!developer.github &&
              !developer.leetcode && (
                <p className="text-sm text-zinc-600">
                  No external profiles added.
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Future Section */}

      
     {/* Resume / CV */}

<div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

  <div className="flex items-center gap-3">

    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
      <FileText size={20} />
    </div>

    <div>
      <h2 className="font-semibold text-white">
        Resume / CV
      </h2>

      <p className="text-sm text-zinc-500">
        Candidate's uploaded resume
      </p>
    </div>

  </div>

  {developer.resumeUrl ? (
    <div className="mt-5 flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
          <FileText size={20} />
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            {developer.resumeFileName ||
              "Resume.pdf"}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            PDF Resume
          </p>
        </div>

      </div>

      <a
        href={`http://localhost:5000${developer.resumeUrl}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        <ExternalLink size={16} />
        View Resume
      </a>

    </div>
  ) : (
    <div className="mt-5 rounded-xl border border-dashed border-zinc-800 p-6 text-center">

      <FileText
        size={28}
        className="mx-auto text-zinc-600"
      />

      <p className="mt-3 text-sm text-zinc-500">
        This developer has not uploaded a resume yet.
      </p>

    </div>
  )}

</div>
     {/* Projects */}

<div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

  <div className="flex items-center gap-3">

    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
      <FolderKanban size={20} />
    </div>

    <div>
      <h2 className="font-semibold text-white">
        Projects
      </h2>

      <p className="text-sm text-zinc-500">
        Projects provided by this developer
      </p>
    </div>

  </div>

  {developer.projects?.length > 0 ? (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">

      {developer.projects.map(
        (project, index) => (
          <div
            key={index}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5"
          >

            {/* Project Header */}

            <h3 className="text-lg font-semibold text-white">
              {project.name}
            </h3>

            {/* Description */}

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {project.description}
            </p>

            {/* Technologies */}

            {project.technologies?.length > 0 && (
              <div className="mt-4">

                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-600">
                  Technologies
                </p>

                <div className="flex flex-wrap gap-2">

                  {project.technologies.map(
                    (technology, technologyIndex) => (
                      <span
                        key={`${technology}-${technologyIndex}`}
                        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                      >
                        {technology}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

            {/* Project Links */}

            {(project.githubUrl ||
              project.liveUrl) && (
              <div className="mt-5 flex flex-wrap gap-3 border-t border-zinc-800 pt-4">

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                  >
                    <ExternalLink size={16} />
                    GitHub Repository
                  </a>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}

              </div>
            )}

          </div>
        )
      )}

    </div>
  ) : (
    <div className="mt-6 rounded-xl border border-dashed border-zinc-800 p-8 text-center">

      <FolderKanban
        size={28}
        className="mx-auto text-zinc-600"
      />

      <p className="mt-3 text-sm text-zinc-500">
        This developer has not added any projects yet.
      </p>

    </div>
  )}

</div> 
    </DashboardLayout>
  );
};

export default DeveloperDetails;