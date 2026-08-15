import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";

const MyProjects = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div>
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

        {/* Empty State */}

        <div className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center">
          <h2 className="text-xl font-semibold text-white">
            Your projects will appear here
          </h2>

          <p className="mt-2 max-w-md text-sm text-zinc-500">
            Once you create projects, you will be able to
            manage them, view applicants, and track their
            status from this page.
          </p>

          <button
            onClick={() => navigate("/recruiter/create-project")}
            className="mt-6 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
          >
            Create your first project
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyProjects;