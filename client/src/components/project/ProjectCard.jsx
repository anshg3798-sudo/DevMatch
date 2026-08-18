import {
  FolderKanban,
  Users,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <FolderKanban size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              {project.title}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Created{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>

        </div>

        <button className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white">
          <MoreVertical size={18} />
        </button>

      </div>

      {/* Description */}

      <p className="mt-5 line-clamp-2 text-sm leading-6 text-zinc-400">
        {project.description}
      </p>

      {/* Skills */}

      <div className="mt-5 flex flex-wrap gap-2">

        {project.requiredSkills?.map((skill) => (
          <span
            key={skill}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
          >
            {skill}
          </span>
        ))}

      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">

        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Users size={16} />

          <span>
            Applicants coming soon
          </span>
        </div>

        <button  onClick={() =>
    navigate(`/recruiter/projects/${project._id}`)
  }
  className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300">
          View Details
        </button>
      </div>

    </div>
  );
};

export default ProjectCard;