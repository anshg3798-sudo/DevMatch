
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Loader2,
} from "lucide-react";

import {
  getProjectById,
  updateProject,
} from "../services/projectService";

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

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");

  const [matchingWeights, setMatchingWeights] = useState(
    DEFAULT_WEIGHTS
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totalWeight = Object.values(matchingWeights).reduce(
    (total, value) => total + Number(value),
    0
  );

  const weightsValid = totalWeight === 100;

  // Fetch existing project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjectById(id);
        const project = data.project;

        setFormData({
          title: project.title || "",
          description: project.description || "",
        });

        setSkills(project.requiredSkills || []);

        // Load saved weights or use defaults for older projects
        setMatchingWeights({
          ...DEFAULT_WEIGHTS,
          ...(project.matchingWeights || {}),
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Handle title and description
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle matching weight changes
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

  // Add skill
  const handleAddSkill = () => {
    const trimmedSkill = skill.trim();

    if (!trimmedSkill) return;

    const alreadyExists = skills.some(
      (item) =>
        item.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (alreadyExists) {
      setSkill("");
      return;
    }

    setSkills((prev) => [...prev, trimmedSkill]);
    setSkill("");
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev.filter((item) => item !== skillToRemove)
    );
  };

  // Allow Enter to add skill
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Submit updated project
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
      setSaving(true);

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requiredSkills: skills,
        matchingWeights: {
          skills: Number(matchingWeights.skills),
          availability: Number(matchingWeights.availability),
          experience: Number(matchingWeights.experience),
          communication: Number(matchingWeights.communication),
          projects: Number(matchingWeights.projects),
        },
      };

      await updateProject(id, projectData);

      navigate(`/recruiter/projects/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update project."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="animate-spin" size={20} />
          Loading project...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate(`/recruiter/projects/${id}`)
          }
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Project
        </button>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm text-indigo-400 mb-2">
            Recruiter Panel
          </p>

          <h1 className="text-3xl font-semibold">
            Edit Project
          </h1>

          <p className="text-zinc-400 mt-2">
            Update your project information, required skills,
            and candidate matching preferences.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8"
        >
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Project Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Project Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project..."
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-4 py-3 text-white outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Skills */}
          <div className="mb-8">
            <label
              htmlFor="skill"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Required Skills
            </label>

            <div className="flex gap-3">
              <input
                id="skill"
                name="skill"
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React"
                className="flex-1 min-w-0 rounded-lg bg-zinc-950 border border-zinc-800 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
              />

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {skills.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-sm text-indigo-300"
                  >
                    <span>{item}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(item)}
                      className="text-indigo-400 hover:text-red-400 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Matching Weights */}
          <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                Candidate Matching Preferences
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Decide how important each factor should be when
                calculating candidate compatibility.
              </p>
            </div>

            <div className="space-y-6">
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

            {/* Total */}
            <div className="mt-7 flex items-center justify-between border-t border-zinc-800 pt-5">
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Total Weight
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  All five factors must add up to 100%.
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
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(`/recruiter/projects/${id}`)
              }
              className="flex-1 rounded-lg border border-zinc-700 py-3 text-zinc-300 hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !weightsValid}
              className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 flex items-center justify-center gap-2 transition"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
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
      </div>
    </div>
  );
};

export default EditProject;
