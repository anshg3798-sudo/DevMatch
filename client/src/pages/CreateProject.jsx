import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import CreateProjectForm from "../components/project/CreateProjectForm";
const CreateProject = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}

        <button
          onClick={() => navigate("/recruiter/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {/* Page Header */}

        <div>
          <h1 className="text-3xl font-bold text-white">
            Create New Project
          </h1>

          <p className="mt-2 text-zinc-400">
            Create a project and find the right developers for your team.
          </p>
        </div>

        {/* Form */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          <CreateProjectForm />
        </div>

      </div>

    </DashboardLayout>
  );
};

export default CreateProject;