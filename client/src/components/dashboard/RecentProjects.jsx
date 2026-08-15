import { FolderKanban, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentProjects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: "DevMatch Website",
      description: "Developer hiring platform",
      skills: ["React", "Node.js", "MongoDB"],
      applicants: 12,
      status: "Open",
    },
    {
      id: 2,
      title: "AI Resume Analyzer",
      description: "Resume analysis using AI",
      skills: ["Python", "ML", "FastAPI"],
      applicants: 8,
      status: "Open",
    },
    {
      id: 3,
      title: "E-Commerce Dashboard",
      description: "Analytics dashboard for retailers",
      skills: ["React", "Express", "PostgreSQL"],
      applicants: 4,
      status: "Closed",
    },
  ];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your recently created projects
          </p>
        </div>

        <button
          onClick={() => navigate("/recruiter/projects")}
          className="flex items-center gap-1 text-sm text-indigo-400 transition hover:text-indigo-300"
        >
          View all
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <FolderKanban size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {project.description}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  project.status === "Open"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                <Users size={16} />

                {project.applicants} applicants
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;