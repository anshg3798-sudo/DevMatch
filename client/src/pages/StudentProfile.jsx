import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Plus,
  X,
  Code2,
  Briefcase,
  Clock,
  MessageCircle,
  FolderKanban,
  Save,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";

import {
  getProfile,
  updateProfile,
} from "../services/userService";

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");

  const [experienceYears, setExperienceYears] =
    useState(0);

  const [availabilityHours, setAvailabilityHours] =
    useState(0);

  const [communicationRating, setCommunicationRating] =
    useState(3);

  const [projectsCount, setProjectsCount] =
    useState(0);
  const [projects, setProjects] = useState([]);

const [projectName, setProjectName] = useState("");
const [projectDescription, setProjectDescription] =
  useState("");
const [projectTechnologies, setProjectTechnologies] =
  useState("");
const [projectGithub, setProjectGithub] =
  useState("");
const [projectLive, setProjectLive] =
  useState("");
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        const user = data.user;

        setName(user?.name || "");
        setEmail(user?.email || "");
        setSkills(user?.skills || []);
        setGithub(user?.github || "");
        setLeetcode(user?.leetcode || "");

        setExperienceYears(
          user?.experienceYears || 0
        );

        setAvailabilityHours(
          user?.availabilityHours || 0
        );

        setCommunicationRating(
          user?.communicationRating || 3
        );

        setProjectsCount(
          user?.projectsCount || 0
        );
        setProjects(user?.projects || []);
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

    loadProfile();
  }, []);

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = skills.some(
      (existingSkill) =>
        existingSkill.toLowerCase() ===
        skill.toLowerCase()
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setSkills([...skills, skill]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(
      skills.filter(
        (skill) => skill !== skillToRemove
      )
    );
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };
  const addProject = () => {
  if (!projectName.trim()) {
    setError("Project name is required.");
    return;
  }

  if (!projectDescription.trim()) {
    setError("Project description is required.");
    return;
  }

  const technologies = projectTechnologies
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);

  const newProject = {
    name: projectName.trim(),
    description: projectDescription.trim(),
    technologies,
    githubUrl: projectGithub.trim(),
    liveUrl: projectLive.trim(),
  };

  setProjects((previousProjects) => [
    ...previousProjects,
    newProject,
  ]);

  setProjectName("");
  setProjectDescription("");
  setProjectTechnologies("");
  setProjectGithub("");
  setProjectLive("");
  setError("");
};
const removeProject = (indexToRemove) => {
  setProjects((previousProjects) =>
    previousProjects.filter(
      (_, index) => index !== indexToRemove
    )
  );
};
  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateProfile({
        name,
        skills,
        github,
        leetcode,
        experienceYears: Number(experienceYears),
        availabilityHours: Number(
          availabilityHours
        ),
        communicationRating: Number(
          communicationRating
        ),
        projectsCount: Number(projectsCount),
        projects,
      });

      setSuccess(
        "Profile updated successfully."
      );
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
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-white">
          Developer Profile
        </h1>

        <p className="mt-2 text-zinc-400">
          Keep your profile updated so DevMatch can
          calculate accurate compatibility scores.
        </p>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="mt-8 space-y-6"
        >
          {/* Basic Information */}

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <h2 className="text-xl font-semibold text-white">
              Basic Information
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-zinc-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <h2 className="text-xl font-semibold text-white">
              Skills
            </h2>

            <div className="mt-5 flex gap-3">
              <input
                value={skillInput}
                onChange={(event) =>
                  setSkillInput(event.target.value)
                }
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React"
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-500"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() =>
                      removeSkill(skill)
                    }
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Compatibility Information */}

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <h2 className="text-xl font-semibold text-white">
              Compatibility Information
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              This information is used by DevMatch to
              calculate your compatibility with projects.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {/* Experience */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                  <Briefcase size={16} />
                  Experience
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={experienceYears}
                  onChange={(event) =>
                    setExperienceYears(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Years of relevant experience
                </p>
              </div>

              {/* Availability */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                  <Clock size={16} />
                  Weekly Availability
                </label>

                <input
                  type="number"
                  min="0"
                  value={availabilityHours}
                  onChange={(event) =>
                    setAvailabilityHours(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Hours available per week
                </p>
              </div>

              {/* Communication */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                  <MessageCircle size={16} />
                  Communication
                </label>

                <select
                  value={communicationRating}
                  onChange={(event) =>
                    setCommunicationRating(
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                >
                  <option value={1}>
                    1 - Beginner
                  </option>

                  <option value={2}>
                    2 - Basic
                  </option>

                  <option value={3}>
                    3 - Good
                  </option>

                  <option value={4}>
                    4 - Very Good
                  </option>

                  <option value={5}>
                    5 - Excellent
                  </option>
                </select>
              </div>

              {/* Projects */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                  <FolderKanban size={16} />
                  Relevant Projects
                </label>

                <input
                  type="number"
                  min="0"
                  value={projectsCount}
                  onChange={(event) =>
                    setProjectsCount(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Number of relevant projects
                </p>
              </div>
            </div>
          </section>
           {/* Projects */}

<section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
  <div>
    <h2 className="text-xl font-semibold text-white">
      Projects
    </h2>

    <p className="mt-2 text-sm text-zinc-500">
      Add projects that demonstrate your skills and experience.
    </p>
  </div>

  {/* Existing Projects */}

  {projects.length > 0 && (
    <div className="mt-6 space-y-4">
      {projects.map((project, index) => (
        <div
          key={index}
          className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {project.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {project.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeProject(index)}
              className="text-zinc-500 hover:text-red-400"
            >
              <X size={18} />
            </button>
          </div>

          {/* Technologies */}

          {project.technologies?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map(
                (technology) => (
                  <span
                    key={technology}
                    className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                  >
                    {technology}
                  </span>
                )
              )}
            </div>
          )}

          {/* Project Links */}

          <div className="mt-4 flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                GitHub →
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Live Demo →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Add Project Form */}

  <div className="mt-6 border-t border-zinc-800 pt-6">

    <h3 className="text-sm font-medium text-zinc-300">
      Add a Project
    </h3>

    <div className="mt-4 space-y-4">

      {/* Project Name */}

      <input
        value={projectName}
        onChange={(event) =>
          setProjectName(event.target.value)
        }
        placeholder="Project name"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
      />

      {/* Description */}

      <textarea
        value={projectDescription}
        onChange={(event) =>
          setProjectDescription(
            event.target.value
          )
        }
        placeholder="Describe what you built and what problem it solves..."
        rows={4}
        className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
      />

      {/* Technologies */}

      <input
        value={projectTechnologies}
        onChange={(event) =>
          setProjectTechnologies(
            event.target.value
          )
        }
        placeholder="Technologies (e.g. React, Node.js, MongoDB)"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
      />

      <p className="text-xs text-zinc-600">
        Separate technologies with commas.
      </p>

      {/* GitHub */}

      <input
        value={projectGithub}
        onChange={(event) =>
          setProjectGithub(event.target.value)
        }
        placeholder="GitHub repository URL"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
      />

      {/* Live Demo */}

      <input
        value={projectLive}
        onChange={(event) =>
          setProjectLive(event.target.value)
        }
        placeholder="Live demo URL (optional)"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
      />

      <button
        type="button"
        onClick={addProject}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 font-medium text-white hover:bg-zinc-700"
      >
        <Plus size={18} />
        Add Project
      </button>

    </div>
  </div>
</section>
          {/* Links */}

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <h2 className="text-xl font-semibold text-white">
              Developer Links
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                  <ExternalLink size={16} />
                  GitHub
                </label>

                <input
                  value={github}
                  onChange={(event) =>
                    setGithub(event.target.value)
                  }
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                  <Code2 size={16} />
                  LeetCode
                </label>

                <input
                  value={leetcode}
                  onChange={(event) =>
                    setLeetcode(event.target.value)
                  }
                  placeholder="https://leetcode.com/username"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
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
                Save Profile
              </>
            )}
          </button>
        </form>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentProfile;