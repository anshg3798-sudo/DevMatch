import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../services/projectService";
import { requiredSkills } from "../HowItWorks/requirementsData";

const CreateProjectForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();

    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = skills.some(
      (existingSkill) =>
        existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setError("This skill has already been added.");
      return;
    }

    setSkills((prev) => [...prev, skill]);

    setSkillInput("");
    setError("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!formData.title.trim()) {
    setError("Project title is required.");
    return;
  }

  if (!formData.description.trim()) {
    setError("Project description is required.");
    return;
  }

  if (skills.length === 0) {
    setError("Please add at least one required skill.");
    return;
  }

  try {
    setLoading(true);

    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      requiredSkills: skills,
    };

    await createProject(projectData);

    navigate("/recruiter/projects");

  } catch (error) {
    console.error("Create project error:", error);

    const message =
      error.response?.data?.message ||
      "Failed to create project. Please try again.";

    setError(message);

  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Basic Information */}

      <section>
        <h2 className="text-lg font-semibold text-white">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Tell developers what your project is about.
        </p>

        <div className="mt-5 space-y-5">

          {/* Project Title */}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Project Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI Resume Analyzer"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
            />
          </div>

          {/* Description */}

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Project Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your project and what you are trying to build..."
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
            />
          </div>

        </div>
      </section>

      {/* Required Skills */}

      <section>
        <h2 className="text-lg font-semibold text-white">
          Required Skills
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Add the technologies and skills developers should have.
        </p>

        <div className="mt-5">

          <div className="flex gap-3">

            <input
              id="skill"
              name="skill"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSkill(e);
                }
              }}
              placeholder="e.g. React"
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
            >
              <Plus size={18} />
              Add
            </button>

          </div>

          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">

              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-300"
                >
                  <span>{skill}</span>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400 transition hover:text-white"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* Requirements */}

      <section>
        <h2 className="text-lg font-semibold text-white">
          Project Requirements
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Explain what you expect from the developer.
        </p>

        <div className="mt-5">

          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={6}
            placeholder="e.g. Experience with REST APIs, Git, and responsive frontend development..."
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
          />

        </div>
      </section>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}

      <div className="flex justify-end border-t border-zinc-800 pt-6">

        <button
          type="submit"
          disabled={loading}
          className="flex min-w-40 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Creating...
            </>
          ) : (
            "Create Project"
          )}

        </button>

      </div>

    </form>
  );
};

export default CreateProjectForm;