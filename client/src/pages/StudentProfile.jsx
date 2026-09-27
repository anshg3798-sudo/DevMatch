import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Code2,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  Clock,
  MessageSquare,
  FolderGit2,
} from "lucide-react";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";

import {
  getProfile,
  updateProfile,
  uploadResume,
  verifyProject,
} from "../services/userService";

const StudentProfile = () => {
  // --------------------------------------------------
  // PROFILE STATE
  // --------------------------------------------------

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [skills, setSkills] = useState("");

  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");

  const [experienceYears, setExperienceYears] = useState(0);
  const [communicationRating, setCommunicationRating] =
    useState(3);
  const [availabilityHours, setAvailabilityHours] =
    useState(0);

  // --------------------------------------------------
  // PROJECT STATE
  // --------------------------------------------------

  const [projects, setProjects] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] =
    useState("");
  const [projectTechnologies, setProjectTechnologies] =
    useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectLive, setProjectLive] = useState("");

  // --------------------------------------------------
  // RESUME STATE
  // --------------------------------------------------

  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] =
    useState(false);

  // --------------------------------------------------
  // GENERAL STATE
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [verifyingProjectId, setVerifyingProjectId] =
    useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD PROFILE
  // --------------------------------------------------

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProfile();

      const user = data.user;

      setName(user.name || "");
      setEmail(user.email || "");

      setSkills(
        user.skills?.length
          ? user.skills.join(", ")
          : ""
      );

      setGithub(user.github || "");
      setLeetcode(user.leetcode || "");

      setExperienceYears(
        user.experienceYears ?? 0
      );

      setCommunicationRating(
        user.communicationRating ?? 3
      );

      setAvailabilityHours(
        user.availabilityHours ?? 0
      );

      setProjects(user.projects || []);

      setResumeUrl(user.resumeUrl || "");
      setResumeFileName(
        user.resumeFileName || ""
      );
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

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const data = await updateProfile({
        name,
        email,
        skills: skillsArray,
        github,
        leetcode,

        experienceYears: Number(
          experienceYears
        ),

        communicationRating: Number(
          communicationRating
        ),

        availabilityHours: Number(
          availabilityHours
        ),

        projectsCount: projects.length,

        projects,
      });

      if (data.user) {
        setProjects(data.user.projects || projects);

        setResumeUrl(
          data.user.resumeUrl || resumeUrl
        );

        setResumeFileName(
          data.user.resumeFileName ||
            resumeFileName
        );
      }

      setMessage(
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

  // --------------------------------------------------
  // ADD PROJECT
  // --------------------------------------------------

  const addProject = () => {
    setError("");
    setMessage("");

    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!projectDescription.trim()) {
      setError(
        "Please enter a project description."
      );
      return;
    }

    if (!projectGithub.trim()) {
      setError(
        "Please enter the GitHub repository URL."
      );
      return;
    }

    const technologies = projectTechnologies
      .split(",")
      .map((technology) =>
        technology.trim()
      )
      .filter(Boolean);

    const newProject = {
      name: projectName.trim(),
      description:
        projectDescription.trim(),
      technologies,
      githubUrl: projectGithub.trim(),
      liveUrl: projectLive.trim(),
    };

    setProjects((previousProjects) => [
      ...previousProjects,
      newProject,
    ]);

    // Clear form

    setProjectName("");
    setProjectDescription("");
    setProjectTechnologies("");
    setProjectGithub("");
    setProjectLive("");

    setMessage(
      "Project added. Click Save Profile to save it."
    );
  };

  // --------------------------------------------------
  // REMOVE PROJECT
  // --------------------------------------------------

  const removeProject = (projectIndex) => {
    setProjects((previousProjects) =>
      previousProjects.filter(
        (_, index) => index !== projectIndex
      )
    );

    setMessage(
      "Project removed. Click Save Profile to save the changes."
    );
  };

  // --------------------------------------------------
  // RESUME FILE SELECT
  // --------------------------------------------------

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setMessage("");

    if (!file) {
      setResumeFile(null);
      return;
    }

    console.log("Selected resume:", file);
    console.log("Resume file type:", file.type);
    console.log("Resume file name:", file.name);
    console.log("Resume file size:", file.size);

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Resume must be smaller than 5 MB."
      );
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  // --------------------------------------------------
  // UPLOAD RESUME
  // --------------------------------------------------

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setError("Please select a PDF first.");
      return;
    }

    try {
      setUploadingResume(true);
      setError("");
      setMessage("");

      const data = await uploadResume(
        resumeFile
      );

      setResumeUrl(
        data.resumeUrl ||
          data.user?.resumeUrl ||
          ""
      );

      setResumeFileName(
        data.resumeFileName ||
          data.user?.resumeFileName ||
          resumeFile.name
      );

      setResumeFile(null);

      setMessage(
        "Resume uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Failed to upload resume:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to upload resume."
      );
    } finally {
      setUploadingResume(false);
    }
  };

  // --------------------------------------------------
  // VERIFY GITHUB PROJECT
  // --------------------------------------------------

  const handleVerifyProject = async (
    project,
    projectIndex
  ) => {
    if (!project?._id) {
      setError(
        "Please save your profile before verifying this project."
      );
      return;
    }

    if (!project.githubUrl) {
      setError(
        "This project does not have a GitHub repository."
      );
      return;
    }

    try {
      setVerifyingProjectId(
        project._id
      );

      setError("");
      setMessage("");

      const data = await verifyProject(
        project._id
      );

      const verification =
        data.verification;

      setProjects((previousProjects) =>
        previousProjects.map(
          (currentProject, index) => {
            if (
              index !== projectIndex
            ) {
              return currentProject;
            }

            return {
              ...currentProject,
              verification,
            };
          }
        )
      );

      if (
        verification?.status ===
        "Verified"
      ) {
        setMessage(
          "Project verified successfully."
        );
      } else {
        setMessage(
          "Project verification completed."
        );
      }
    } catch (error) {
      console.error(
        "Failed to verify project:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to verify project."
      );
    } finally {
      setVerifyingProjectId(null);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={24}
              className="animate-spin"
            />

            Loading profile...
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <StudentDashboardLayout>
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-white">
            My Profile
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your developer profile,
            projects and resume.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">
            <CheckCircle2 size={20} />

            <p>{message}</p>
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            <AlertCircle size={20} />

            <p>{error}</p>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* BASIC INFORMATION */}
        {/* ------------------------------------------ */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <User size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>

              <p className="text-sm text-zinc-500">
                Your personal information.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label className="text-sm text-zinc-400">
                Name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                placeholder="Your name"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="text-sm text-zinc-400">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-white outline-none focus:border-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* SKILLS */}
        {/* ------------------------------------------ */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Code2 size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Skills
              </h2>

              <p className="text-sm text-zinc-500">
                Add your technical skills separated
                by commas.
              </p>
            </div>
          </div>

          <input
            value={skills}
            onChange={(event) =>
              setSkills(event.target.value)
            }
            placeholder="React, Node.js, MongoDB, Express"
            className="mt-6 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* ------------------------------------------ */}
        {/* EXPERIENCE */}
        {/* ------------------------------------------ */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Briefcase size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Developer Information
              </h2>

              <p className="text-sm text-zinc-500">
                Information used by the matching
                engine.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* EXPERIENCE */}

            <div>
              <label className="text-sm text-zinc-400">
                Experience (Years)
              </label>

              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(event) =>
                  setExperienceYears(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* AVAILABILITY */}

            <div>
              <label className="text-sm text-zinc-400">
                Availability (Hours/Week)
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
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* COMMUNICATION */}

            <div>
              <label className="text-sm text-zinc-400">
                Communication Rating
              </label>

              <select
                value={communicationRating}
                onChange={(event) =>
                  setCommunicationRating(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                <option value="1">
                  1 / 5
                </option>

                <option value="2">
                  2 / 5
                </option>

                <option value="3">
                  3 / 5
                </option>

                <option value="4">
                  4 / 5
                </option>

                <option value="5">
                  5 / 5
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* PROJECTS */}
        {/* ------------------------------------------ */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FolderGit2 size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Projects
              </h2>

              <p className="text-sm text-zinc-500">
                Projects you have worked on.
              </p>
            </div>
          </div>

          {/* EXISTING PROJECTS */}

          <div className="mt-8 space-y-5">
            {projects.length === 0 && (
              <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
                <FolderGit2
                  size={32}
                  className="mx-auto text-zinc-600"
                />

                <p className="mt-3 text-zinc-500">
                  No projects added yet.
                </p>
              </div>
            )}

            {projects.map(
              (project, index) => (
                <div
                  key={
                    project._id ||
                    `project-${index}`
                  }
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
                >
                  {/* PROJECT HEADER */}

                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {project.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {project.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeProject(index)
                      }
                      className="flex h-fit items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={16} />

                      Remove
                    </button>
                  </div>

                  {/* TECHNOLOGIES */}

                  {project.technologies
                    ?.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Technologies
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies.map(
                          (
                            technology,
                            technologyIndex
                          ) => (
                            <span
                              key={`${technology}-${technologyIndex}`}
                              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* PROJECT LINKS */}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.githubUrl && (
                      <a
                        href={
                          project.githubUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                      >
                        <ExternalLink size={16} />

                        GitHub
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={
                          project.liveUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                      >
                        <ExternalLink
                          size={16}
                        />

                        Live Demo
                      </a>
                    )}
                  </div>

                  {/* -------------------------------- */}
                  {/* VERIFICATION */}
                  {/* -------------------------------- */}

                  <div className="mt-6 border-t border-zinc-800 pt-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h4 className="font-semibold text-white">
                          GitHub Verification
                        </h4>

                        <p className="mt-1 text-sm text-zinc-500">
                          Verify that this repository
                          exists and contains the
                          claimed technologies.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          verifyingProjectId ===
                            project._id ||
                          !project._id
                        }
                        onClick={() =>
                          handleVerifyProject(
                            project,
                            index
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {verifyingProjectId ===
                        project._id ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />

                            Verifying...
                          </>
                        ) : (
                          <>
                            <ExternalLink
                              size={16}
                            />

                            Verify Project
                          </>
                        )}
                      </button>
                    </div>

                    {/* PROJECT NOT SAVED */}

                    {!project._id && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-400">
                        <AlertCircle
                          size={16}
                        />

                        Save your profile first
                        before verifying this
                        project.
                      </div>
                    )}

                    {/* VERIFICATION RESULT */}

                    {project.verification && (
                      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                        {/* STATUS */}

                        <div className="flex items-center gap-3">
                          {project.verification
                            .status ===
                          "Verified" ? (
                            <CheckCircle2
                              size={22}
                              className="text-emerald-400"
                            />
                          ) : (
                            <XCircle
                              size={22}
                              className="text-red-400"
                            />
                          )}

                          <div>
                            <p className="font-semibold text-white">
                              Verification Status
                            </p>

                            <p
                              className={`text-sm ${
                                project
                                  .verification
                                  .status ===
                                "Verified"
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {
                                project
                                  .verification
                                  .status
                              }
                            </p>
                          </div>
                        </div>

                        {/* CHECKS */}

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-lg bg-zinc-950 p-4">
                            <p className="text-xs text-zinc-500">
                              Repository
                            </p>

                            <p
                              className={`mt-1 font-medium ${
                                project
                                  .verification
                                  .repositoryExists
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {project
                                .verification
                                .repositoryExists
                                ? "Found"
                                : "Not Found"}
                            </p>
                          </div>

                          <div className="rounded-lg bg-zinc-950 p-4">
                            <p className="text-xs text-zinc-500">
                              README
                            </p>

                            <p
                              className={`mt-1 font-medium ${
                                project
                                  .verification
                                  .hasReadme
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {project
                                .verification
                                .hasReadme
                                ? "Present"
                                : "Missing"}
                            </p>
                          </div>

                          <div className="rounded-lg bg-zinc-950 p-4">
                            <p className="text-xs text-zinc-500">
                              Code
                            </p>

                            <p
                              className={`mt-1 font-medium ${
                                project
                                  .verification
                                  .hasCode
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {project
                                .verification
                                .hasCode
                                ? "Found"
                                : "Not Found"}
                            </p>
                          </div>
                        </div>

                        {/* DETECTED LANGUAGES */}

                        {project.verification
                          .detectedLanguages
                          ?.length >
                          0 && (
                          <div className="mt-5">
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                              Detected Languages
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.verification.detectedLanguages.map(
                                (
                                  language,
                                  languageIndex
                                ) => (
                                  <span
                                    key={`${language}-${languageIndex}`}
                                    className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                                  >
                                    {language}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* MATCHED TECHNOLOGIES */}

                        {project.verification
                          .matchedTechnologies
                          ?.length >
                          0 && (
                          <div className="mt-5">
                            <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
                              Matched Technologies
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.verification.matchedTechnologies.map(
                                (
                                  technology,
                                  technologyIndex
                                ) => (
                                  <span
                                    key={`${technology}-${technologyIndex}`}
                                    className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400"
                                  >
                                    {technology}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* MISSING TECHNOLOGIES */}

                        {project.verification
                          .missingTechnologies
                          ?.length >
                          0 && (
                          <div className="mt-5">
                            <p className="text-xs font-medium uppercase tracking-wide text-red-500">
                              Missing Technologies
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.verification.missingTechnologies.map(
                                (
                                  technology,
                                  technologyIndex
                                ) => (
                                  <span
                                    key={`${technology}-${technologyIndex}`}
                                    className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400"
                                  >
                                    {technology}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* ------------------------------------------ */}
          {/* ADD PROJECT */}
          {/* ------------------------------------------ */}

          <div className="mt-8 border-t border-zinc-800 pt-8">
            <h3 className="text-lg font-semibold text-white">
              Add Project
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Add a project to your developer profile.
            </p>

            <div className="mt-6 grid gap-5">
              {/* PROJECT NAME */}

              <div>
                <label className="text-sm text-zinc-400">
                  Project Name
                </label>

                <input
                  value={projectName}
                  onChange={(event) =>
                    setProjectName(
                      event.target.value
                    )
                  }
                  placeholder="DevMatch"
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="text-sm text-zinc-400">
                  Description
                </label>

                <textarea
                  value={
                    projectDescription
                  }
                  onChange={(event) =>
                    setProjectDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe what your project does..."
                  className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* TECHNOLOGIES */}

              <div>
                <label className="text-sm text-zinc-400">
                  Technologies
                </label>

                <input
                  value={
                    projectTechnologies
                  }
                  onChange={(event) =>
                    setProjectTechnologies(
                      event.target.value
                    )
                  }
                  placeholder="React, Node.js, Express, MongoDB"
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Separate technologies using commas.
                </p>
              </div>

              {/* GITHUB */}

              <div>
                <label className="text-sm text-zinc-400">
                  GitHub Repository
                </label>

                <div className="relative">
                  <ExternalLink
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    value={projectGithub}
                    onChange={(event) =>
                      setProjectGithub(
                        event.target.value
                      )
                    }
                    placeholder="https://github.com/username/repository"
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* LIVE URL */}

              <div>
                <label className="text-sm text-zinc-400">
                  Live Demo URL
                </label>

                <input
                  value={projectLive}
                  onChange={(event) =>
                    setProjectLive(
                      event.target.value
                    )
                  }
                  placeholder="https://your-project.com"
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* ADD BUTTON */}

              <button
                type="button"
                onClick={addProject}
                className="flex w-fit items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 font-medium text-white transition hover:bg-zinc-700"
              >
                <Plus size={18} />

                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* RESUME / CV */}
        {/* ------------------------------------------ */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Resume / CV
              </h2>

              <p className="text-sm text-zinc-500">
                Upload your latest resume as a PDF.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-sm font-medium text-zinc-300">
              Upload Resume
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                <label className="cursor-pointer bg-zinc-800 px-5 py-3 font-medium text-white transition hover:bg-zinc-700">
                  Choose File

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={
                      handleResumeChange
                    }
                    className="hidden"
                  />
                </label>

                <span className="truncate px-4 text-sm text-zinc-400">
                  {resumeFile
                    ? resumeFile.name
                    : resumeFileName ||
                      "No file selected"}
                </span>
              </div>

              <button
                type="button"
                onClick={
                  handleResumeUpload
                }
                disabled={uploadingResume}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingResume ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />

                    Upload Resume
                  </>
                )}
              </button>
            </div>

            <p className="mt-3 text-xs text-zinc-600">
              PDF only • Maximum size 5 MB
            </p>

            {/* EXISTING RESUME */}

            {resumeUrl && (
              <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <FileText
                    size={22}
                    className="text-indigo-400"
                  />

                  <div>
                    <p className="font-medium text-white">
                      {resumeFileName ||
                        "Current Resume"}
                    </p>

                    <p className="text-xs text-zinc-500">
                      Your current uploaded CV
                    </p>
                  </div>
                </div>

                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                >
                  <ExternalLink
                    size={16}
                  />

                  View Resume
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* DEVELOPER LINKS */}
        {/* ------------------------------------------ */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <ExternalLink size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Developer Links
              </h2>

              <p className="text-sm text-zinc-500">
                Your public developer profiles.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* GITHUB */}

            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <ExternalLink size={16} />

                GitHub
              </label>

              <input
                value={github}
                onChange={(event) =>
                  setGithub(
                    event.target.value
                  )
                }
                placeholder="https://github.com/username"
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* LEETCODE */}

            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <Code2 size={16} />

                LeetCode
              </label>

              <input
                value={leetcode}
                onChange={(event) =>
                  setLeetcode(
                    event.target.value
                  )
                }
                placeholder="https://leetcode.com/username"
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* SAVE PROFILE */}
        {/* ------------------------------------------ */}

        <div className="mt-8 flex justify-end pb-10">
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentProfile;