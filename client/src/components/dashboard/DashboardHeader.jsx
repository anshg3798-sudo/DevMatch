import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardHeader = () => {
  const { user } = useAuth();

  const userName = user?.name || "Recruiter";

  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-5">
      
      {/* Left */}
      <div>
        <p className="text-sm text-zinc-400">
          Welcome back,
        </p>

        <h1 className="mt-1 text-xl font-semibold text-white">
          {userName}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        <button className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white">
          <Bell size={20} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
          {firstLetter}
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;