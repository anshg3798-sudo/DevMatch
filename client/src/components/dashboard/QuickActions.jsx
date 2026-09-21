import {
  Plus,
  FolderKanban,
  Users,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create New Project",
      description: "Start hiring developers",
      icon: Plus,
      path: "/recruiter/create-project",
    },
    {
      title: "View My Projects",
      description: "Manage your projects",
      icon: FolderKanban,
      path: "/recruiter/projects",
    },
    {
      title: "View Applicants",
      description: "Review developer applications",
      icon: Users,
      path: "/recruiter/applicants",
    },
    {
      title: "Search Developers",
      description: "Find developers for your projects",
      icon: Search,
      path: "/recruiter/search",
    },
  ];

  return (
    <section>
      <h2 className="text-xl font-semibold text-white">
        Quick Actions
      </h2>

      <div className="mt-4 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="flex w-full items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-indigo-500/40 hover:bg-zinc-800"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Icon size={20} />
              </div>

              <div>
                <p className="font-medium text-white">
                  {action.title}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;