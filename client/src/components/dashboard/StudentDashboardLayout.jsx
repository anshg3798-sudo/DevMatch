import StudentSidebar from "./StudentSidebar";
import StudentNotifications from "./StudentNotifications";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentDashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const name = user?.name || "Candidate";
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <StudentSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}

        <header className="flex h-24 items-center justify-between border-b border-zinc-800 px-8">
          <div>
            <p className="text-sm text-zinc-400">
              Welcome back,
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              {name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
          {user?.id && <StudentNotifications key={user.id} studentId={user.id} />}
          <Link to="/student/profile" aria-label="My profile" title="My profile" className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 text-lg font-semibold text-white hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300">
            {name.charAt(0).toUpperCase()}
          </Link>
          </div>
        </header>

        {/* Page Content */}

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
