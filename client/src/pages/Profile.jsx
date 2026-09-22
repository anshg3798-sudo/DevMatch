import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/userService";

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const data = await updateProfile({
        name,
        email,
      });

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setMessage("Profile updated successfully.");

      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">
          Profile
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage your recruiter profile.
        </p>

        <div className="mt-8 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Recruiter Information
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            {/* Name */}

            <div>
              <label className="text-sm text-zinc-400">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>

            {/* Email */}

            <div>
              <label className="text-sm text-zinc-400">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
              />
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

            {/* Success */}

            {message && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                {message}
              </div>
            )}

            {/* Error */}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Save */}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;