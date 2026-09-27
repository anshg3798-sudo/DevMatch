import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Code2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Briefcase,
  Clock,
  MessageSquare,
  FolderGit2,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { getDeveloperById } from "../services/userService";

const DeveloperDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDeveloper = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDeveloperById(id);

      setDeveloper(data.developer);
    } catch (error) {
      console.error(
        "Failed to load developer:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load developer profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeveloper();
  }, [id]);

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={24}
              className="animate-spin"
            />
            Loading developer profile...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  if (error) {
    return (
      <DashboardLayout>
        <div className="mt-8">
          <button
            onClick={() =>
              navigate("/recruiter/search")
            }
            className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Developers
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------
  // DEVELOPER NOT FOUND
  // -----------------------------

  if (!developer) {
    return (
      <DashboardLayout>
        <div className="mt-8 text-center">
          <p className="text-zinc-500">
            Developer not found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* ========================================= */}
      {/* BACK */}
      {/* ========================================= */}

      <button
        onClick={() =>
          navigate("/recruiter/search")
        }
        className="mb-8 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Developers
      </button>


      {/* ========================================= */}
      {/* PROFILE HEADER */}
      {/* ========================================= */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

          {/* Avatar */}

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
            <User size={36} />
          </div>

          {/* Basic Information */}

          <div className="min-w-0">

            <h1 className="text-3xl font-bold text-white">
              {developer.name}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-zinc-400">
              <Mail size={17} />
              <span>{developer.email}</span>
            </div>

            <div className="mt-3">
              <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                Student / Developer
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* DEVELOPER STATS */}
      {/* ========================================= */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Experience */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">

          <div className="flex items-center gap-3">

            <Briefcase
              size={20}
              className="text-indigo-400"
            />

            <span className="text-sm text-zinc-500">
              Experience
            </span>

          </div>

          <p className="mt-3 text-xl font-semibold text-white">
            {developer.experienceYears || 0} years
          </p>

        </div>


        {/* Availability */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">

          <div className="flex items-center gap-3">

            <Clock
              size={20}
              className="text-indigo-400"
            />

            <span className="text-sm text-zinc-500">
              Availability
            </span>

          </div>

          <p className="mt-3 text-xl font-semibold text-white">
            {developer.availabilityHours || 0} hrs/week
          </p>

        </div>


        {/* Communication */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">

          <div className="flex items-center gap-3">

            <MessageSquare
              size={20}
              className="text-indigo-400"
            />

            <span className="text-sm text-zinc-500">
              Communication
            </span>

          </div>

          <p className="mt-3 text-xl font-semibold text-white">
            {developer.communicationRating || 3}/5
          </p>

        </div>


        {/* Projects */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">

          <div className="flex items-center gap-3">

            <FolderGit2
              size={20}
              className="text-indigo-400"
            />

            <span className="text-sm text-zinc-500">
              Projects
            </span>

          </div>

          <p className="mt-3 text-xl font-semibold text-white">
            {developer.projects?.length ||
              developer.projectsCount ||
              0}
          </p>

        </div>

      </div>


      {/* ========================================= */}
      {/* SKILLS */}
      {/* ========================================= */}

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Code2 size={20} />
          </div>

          <div>

            <h2 className="font-semibold text-white">
              Skills
            </h2>

            <p className="text-sm text-zinc-500">
              Technical skills of this developer
            </p>

          </div>

        </div>


        <div className="mt-6 flex flex-wrap gap-2">

          {developer.skills?.length > 0 ? (

            developer.skills.map(
              (skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300"
                >
                  {skill}
                </span>
              )
            )

          ) : (

            <p className="text-sm text-zinc-600">
              No skills added yet.
            </p>

          )}

        </div>

      </div>


      {/* ========================================= */}
      {/* RESUME */}
      {/* ========================================= */}

      {developer.resumeUrl && (

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <FileText size={20} />
              </div>

              <div>

                <h2 className="font-semibold text-white">
                  Resume / CV
                </h2>

                <p className="text-sm text-zinc-500">
                  Developer's latest resume
                </p>

              </div>

            </div>


            <a
              href={developer.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              <FileText size={17} />
              View Resume
            </a>

          </div>

        </div>

      )}


      {/* ========================================= */}
      {/* DEVELOPER LINKS */}
      {/* ========================================= */}

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <ExternalLink size={20} />
          </div>

          <div>

            <h2 className="font-semibold text-white">
              Developer Links
            </h2>

            <p className="text-sm text-zinc-500">
              External profiles and portfolios
            </p>

          </div>

        </div>


        <div className="mt-6 flex flex-wrap gap-3">

          {developer.github && (

            <a
              href={developer.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
            >
              <ExternalLink size={17} />
              GitHub
            </a>

          )}

          {developer.leetcode && (

            <a
              href={developer.leetcode}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
            >
              <Code2 size={17} />
              LeetCode
            </a>

          )}

          {!developer.github &&
            !developer.leetcode && (

              <p className="text-sm text-zinc-600">
                No external profiles added.
              </p>

          )}

        </div>

      </div>


      {/* ========================================= */}
      {/* PROJECTS + GITHUB VERIFICATION */}
      {/* ========================================= */}

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

        {/* Section Header */}

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <FolderGit2 size={20} />
          </div>

          <div>

            <h2 className="font-semibold text-white">
              Projects
            </h2>

            <p className="text-sm text-zinc-500">
              Projects provided by this developer
            </p>

          </div>

        </div>


        {/* No projects */}

        {!developer.projects ||
          developer.projects.length === 0 ? (

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-8 text-center">

            <FolderGit2
              size={35}
              className="mx-auto text-zinc-600"
            />

            <p className="mt-3 text-sm text-zinc-500">
              This developer has not added any projects yet.
            </p>

          </div>

        ) : (

          <div className="mt-6 space-y-6">

            {developer.projects.map(
              (project, index) => {

                const verification =
                  project.verification;

                const isVerified =
                  verification?.status ===
                  "Verified";

                const isFailed =
                  verification?.status ===
                  "Failed";

                return (

                  <div
                    key={
                      project._id ||
                      project.id ||
                      index
                    }
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6"
                  >

                    {/* Project Header */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <h3 className="text-xl font-semibold text-white">
                          {project.name}
                        </h3>

                        {project.description && (

                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            {project.description}
                          </p>

                        )}

                      </div>


                      {/* Verification Badge */}

                      {verification?.status && (

                        <div>

                          {isVerified && (

                            <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">

                              <CheckCircle2
                                size={15}
                              />

                              GitHub Verified

                            </span>

                          )}


                          {isFailed && (

                            <span className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">

                              <XCircle
                                size={15}
                              />

                              Verification Failed

                            </span>

                          )}

                        </div>

                      )}

                    </div>


                    {/* Technologies */}

                    {project.technologies?.length >
                      0 && (

                      <div className="mt-6">

                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                          Technologies
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">

                          {project.technologies.map(
                            (
                              technology,
                              techIndex
                            ) => (

                              <span
                                key={`${technology}-${techIndex}`}
                                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                              >
                                {technology}
                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )}


                    {/* GitHub Repository */}

                    {project.githubUrl && (

                      <div className="mt-6">

                        <a
                          href={
                            project.githubUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                        >
                          <ExternalLink size={17} />
                          View GitHub Repository
                          <ExternalLink
                            size={15}
                          />
                        </a>

                      </div>

                    )}


                    {/* ================================= */}
                    {/* GITHUB VERIFICATION DETAILS */}
                    {/* ================================= */}

                    {verification && (

                      <div className="mt-6 border-t border-zinc-800 pt-6">

                        <div className="flex items-center gap-2">

                          <ExternalLink
                            size={18}
                            className="text-zinc-400"
                          />

                          <h4 className="font-semibold text-white">
                            GitHub Verification
                          </h4>

                        </div>


                        {/* Verification checks */}

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">

                          {/* Repository */}

                          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">

                            <p className="text-xs text-zinc-500">
                              Repository
                            </p>

                            <div className="mt-2 flex items-center gap-2">

                              {verification.repositoryExists ? (

                                <CheckCircle2
                                  size={17}
                                  className="text-emerald-400"
                                />

                              ) : (

                                <XCircle
                                  size={17}
                                  className="text-red-400"
                                />

                              )}

                              <span className="text-sm text-zinc-300">
                                {verification.repositoryExists
                                  ? "Exists"
                                  : "Not Found"}
                              </span>

                            </div>

                          </div>


                          {/* README */}

                          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">

                            <p className="text-xs text-zinc-500">
                              README
                            </p>

                            <div className="mt-2 flex items-center gap-2">

                              {verification.hasReadme ? (

                                <CheckCircle2
                                  size={17}
                                  className="text-emerald-400"
                                />

                              ) : (

                                <XCircle
                                  size={17}
                                  className="text-red-400"
                                />

                              )}

                              <span className="text-sm text-zinc-300">
                                {verification.hasReadme
                                  ? "Available"
                                  : "Missing"}
                              </span>

                            </div>

                          </div>


                          {/* Code */}

                          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">

                            <p className="text-xs text-zinc-500">
                              Source Code
                            </p>

                            <div className="mt-2 flex items-center gap-2">

                              {verification.hasCode ? (

                                <CheckCircle2
                                  size={17}
                                  className="text-emerald-400"
                                />

                              ) : (

                                <XCircle
                                  size={17}
                                  className="text-red-400"
                                />

                              )}

                              <span className="text-sm text-zinc-300">
                                {verification.hasCode
                                  ? "Detected"
                                  : "Not Detected"}
                              </span>

                            </div>

                          </div>

                        </div>


                        {/* Detected Languages */}

                        {verification
                          .detectedLanguages
                          ?.length > 0 && (

                          <div className="mt-6">

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                              Detected Languages
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">

                              {verification.detectedLanguages.map(
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


                        {/* Matched Technologies */}

                        {verification
                          .matchedTechnologies
                          ?.length > 0 && (

                          <div className="mt-6">

                            <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
                              Matched Technologies
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">

                              {verification.matchedTechnologies.map(
                                (
                                  technology,
                                  technologyIndex
                                ) => (

                                  <span
                                    key={`${technology}-${technologyIndex}`}
                                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400"
                                  >
                                    {technology}
                                  </span>

                                )
                              )}

                            </div>

                          </div>

                        )}


                        {/* Missing Technologies */}

                        {verification
                          .missingTechnologies
                          ?.length > 0 && (

                          <div className="mt-6">

                            <p className="text-xs font-medium uppercase tracking-wide text-red-500">
                              Missing Technologies
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">

                              {verification.missingTechnologies.map(
                                (
                                  technology,
                                  technologyIndex
                                ) => (

                                  <span
                                    key={`${technology}-${technologyIndex}`}
                                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400"
                                  >
                                    {technology}
                                  </span>

                                )
                              )}

                            </div>

                          </div>

                        )}


                        {/* Verified Date */}

                        {verification.verifiedAt && (

                          <p className="mt-6 text-xs text-zinc-600">

                            Verified on{" "}

                            {new Date(
                              verification.verifiedAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}

                          </p>

                        )}

                      </div>

                    )}

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </DashboardLayout>
  );
};

export default DeveloperDetails;