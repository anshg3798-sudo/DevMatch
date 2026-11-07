
import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../services/projectService";

const DEFAULT_WEIGHTS = {
  skills: 40,
  availability: 20,
  experience: 15,
  communication: 15,
  projects: 10,
};

const WEIGHT_LABELS = [
  { key: "skills", label: "Skills" },
  { key: "availability", label: "Availability" },
  { key: "experience", label: "Experience" },
  { key: "communication", label: "Communication" },
  { key: "projects", label: "Projects" },
];

const CreateProjectForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [experienceRequired, setExperienceRequired] = useState(0);
  const [availabilityRequired, setAvailabilityRequired] = useState(0);
  const [communicationRequired, setCommunicationRequired] = useState(3);

  const [matchingWeights, setMatchingWeights] = useState(
    DEFAULT_WEIGHTS
  );

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalWeight = Object.values(matchingWeights).reduce(
    (total, value) => total + Number(value),
    0
  );

  const weightsValid = totalWeight === 100;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWeightChange = (key, value) => {
    const numericValue = Math.min(
      100,
      Math.max(0, Math.round(Number(value) || 0))
    );

    setMatchingWeights((prev) => ({
      ...prev,
      [key]: numericValue,
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();

    const newSkill = skillInput.trim();

    if (!newSkill) return;

    const alreadyExists = skills.some(
      (existingSkill) =>
        existingSkill.toLowerCase() === newSkill.toLowerCase()
    );

    if (alreadyExists) {
      setError("This skill has already been added.");
      return;
    }

    setSkills((prev) => [...prev, newSkill]);
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

    if (!weightsValid) {
      setError(
        `Matching weights must total exactly 100%. Current total: ${totalWeight}%.`
      );
      return;
    }

    try {
      setLoading(true);

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requiredSkills: skills,

        experienceRequired: Number(experienceRequired),
        availabilityRequired: Number(availabilityRequired),
        communicationRequired: Number(communicationRequired),

        matchingWeights: {
          skills: Number(matchingWeights.skills),
          availability: Number(matchingWeights.availability),
          experience: Number(matchingWeights.experience),
          communication: Number(matchingWeights.communication),
          projects: Number(matchingWeights.projects),
        },
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
              className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
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

      {/* Compatibility Requirements */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">

        <h3 className="text-lg font-semibold text-white">
          Compatibility Requirements
        </h3>

        <p className="mt-1 text-sm text-zinc-500">
          These requirements will be used by DevMatch to calculate
          developer compatibility.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-3">

          {/* Experience */}
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Minimum Experience
            </label>

            <input
              type="number"
              min="0"
              step="0.5"
              value={experienceRequired}
              onChange={(e) =>
                setExperienceRequired(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            <p className="mt-1 text-xs text-zinc-600">
              Years
            </p>
          </div>

          {/* Availability */}
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Required Availability
            </label>

            <input
              type="number"
              min="0"
              value={availabilityRequired}
              onChange={(e) =>
                setAvailabilityRequired(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            <p className="mt-1 text-xs text-zinc-600">
              Hours per week
            </p>
          </div>

          {/* Communication */}
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Communication Level
            </label>

            <select
              value={communicationRequired}
              onChange={(e) =>
                setCommunicationRequired(Number(e.target.value))
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
            >
              <option value={1}>1 - Beginner</option>
              <option value={2}>2 - Basic</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
          </div>

        </div>
      </section>

      {/* Custom Matching Weights */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">

        <div>
          <h3 className="text-lg font-semibold text-white">
            Custom Matching Weights
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Choose how much importance each factor should have
            while ranking developers.
          </p>
        </div>

        <div className="mt-6 space-y-6">

          {WEIGHT_LABELS.map(({ key, label }) => (
            <div key={key}>

              <div className="mb-2 flex items-center justify-between gap-4">

                <label
                  htmlFor={`${key}-weight`}
                  className="text-sm font-medium text-zinc-300"
                >
                  {label}
                </label>

                <div className="flex items-center gap-2">
                  <input
                    id={`${key}-weight`}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={matchingWeights[key]}
                    onChange={(e) =>
                      handleWeightChange(key, e.target.value)
                    }
                    className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-right text-sm text-white outline-none focus:border-indigo-500"
                  />

                  <span className="text-sm text-zinc-400">
                    %
                  </span>
                </div>

              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={matchingWeights[key]}
                onChange={(e) =>
                  handleWeightChange(key, e.target.value)
                }
                className="w-full cursor-pointer accent-indigo-500"
                aria-label={`${label} matching percentage`}
              />

            </div>
          ))}

        </div>

        {/* Total Weight */}
        <div className="mt-7 flex items-center justify-between border-t border-zinc-800 pt-5">

          <div>
            <p className="text-sm font-medium text-zinc-300">
              Total Weight
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              All factors must add up to 100%.
            </p>
          </div>

          <span
            className={`text-xl font-bold ${
              weightsValid
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {totalWeight}%
          </span>

        </div>

        {!weightsValid && (
          <p className="mt-3 text-sm text-red-400">
            {totalWeight < 100
              ? `You need ${100 - totalWeight}% more.`
              : `Reduce the total by ${totalWeight - 100}%.`}
          </p>
        )}

        {weightsValid && (
          <p className="mt-3 text-sm text-emerald-400">
            Your matching percentages are valid.
          </p>
        )}

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
          disabled={loading || !weightsValid}
          className="flex min-w-40 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
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
