import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">
          Profile
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage your recruiter profile.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Recruiter Information
          </h2>

          <div className="mt-6 space-y-4">
            {/* Name */}

            <div>
              <p className="text-sm text-zinc-500">
                Name
              </p>

              <p className="mt-1 text-white">
                {user?.name || "Unknown"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm text-zinc-500">
                Email
              </p>

              <p className="mt-1 text-white">
                {user?.email || "Unknown"}
              </p>
            </div>

            {/* Role */}

            <div>
              <p className="text-sm text-zinc-500">
                Role
              </p>

              <p className="mt-1 capitalize text-white">
                {user?.role || "Recruiter"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;