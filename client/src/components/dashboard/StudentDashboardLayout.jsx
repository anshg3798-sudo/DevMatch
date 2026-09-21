import StudentSidebar from "./StudentSidebar";

const StudentDashboardLayout = ({ children }) => {
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
              Student
            </h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 text-lg font-semibold text-white">
            S
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