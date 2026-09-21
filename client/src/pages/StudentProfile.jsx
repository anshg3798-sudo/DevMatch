import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Code2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";

import {
  getProfile,
  updateProfile,
} from "../services/userService";

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    skills: [],
    github: "",
    leetcode: "",
  });

  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        setProfile({
          name: data.user?.name || "",
          email: data.user?.email || "",
          skills: data.user?.skills || [],
          github: data.user?.github || "",
          leetcode: data.user?.leetcode || "",
        });
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = profile.skills.some(
      (existingSkill) =>
        existingSkill.toLowerCase() ===
        skill.toLowerCase()
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setProfile((previous) => ({
      ...previous,
      skills: [...previous.skills, skill],
    }));

    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((previous) => ({
      ...previous,
      skills: previous.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await updateProfile({
        name: profile.name,
        skills: profile.skills,
        github: profile.github,
        leetcode: profile.leetcode,
      });

      setProfile({
        name: data.user?.name || profile.name,
        email: data.user?.email || profile.email,
        skills: data.user?.skills || profile.skills,
        github: data.user?.github || profile.github,
        leetcode:
          data.user?.leetcode || profile.leetcode,
      });

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={22}
              className="animate-spin"
            />

            Loading profile...
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Profile
        </h1>

        <p className="mt-2 text-zinc-400">
          Keep your developer information and skills
          up to date.
        </p>
      </div>

      {/* Messages */}

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-4xl"
      >
        {/* Basic Information */}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">
            Basic Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Name */}

            <div>
              <label className="text-sm text-zinc-400">
                Name
              </label>

              <div className="relative mt-2">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-white outline-none transition focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="text-sm text-zinc-400">
                Email
              </label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  value={profile.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-zinc-500"
                />
              </div>

              <p className="mt-2 text-xs text-zinc-600">
                Email cannot be changed here.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">
            Skills
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Add the technologies and skills you know.
          </p>

          <div className="mt-5 flex gap-3">
            <input
              value={skillInput}
              onChange={(event) =>
                setSkillInput(event.target.value)
              }
              onKeyDown={handleSkillKeyDown}
              placeholder="e.g. React"
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              <Plus size={17} />
              Add
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300"
              >
                {skill}

                <button
                  type="button"
                  onClick={() =>
                    handleRemoveSkill(skill)
                  }
                  className="text-zinc-500 transition hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Links */}

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">
            Developer Links
          </h2>

          <div className="mt-6 space-y-5">
            {/* GitHub */}

            <div>
              <label className="text-sm text-zinc-400">
                GitHub
              </label>

              <div className="relative mt-2">
                <ExternalLink
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* LeetCode */}

            <div>
              <label className="text-sm text-zinc-400">
                LeetCode
              </label>

              <div className="relative mt-2">
                <Code2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  name="leetcode"
                  value={profile.leetcode}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/username"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Save */}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={18} />

                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </StudentDashboardLayout>
  );
};

export default StudentProfile;