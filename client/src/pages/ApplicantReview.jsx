import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Code2,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,

} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { updateApplicationStatus,getApplicationById } from "../services/applicationService";

const ApplicantReview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD APPLICATION FROM SESSION STORAGE
  // =========================================================

  useEffect(() => {
  let isMounted = true;

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getApplicationById(applicationId);

      if (!response?.success || !response?.application) {
        throw new Error("Application information not found.");
      }

      if (isMounted) {
        setApplication(response.application);
      }

    } catch (error) {
      console.error("Failed to load applicant:", error);

      if (isMounted) {
        setError(
          error.response?.data?.message ||
          error.message ||
          "Failed to load applicant information."
        );
      }

    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadApplication();

  return () => {
    isMounted = false;
  };

}, [applicationId]);

  // =========================================================
  // ACCEPT / REJECT APPLICATION
  // =========================================================

  const handleStatusChange = async (status) => {
  if (!application || actionLoading) return;

  try {
    setActionLoading(true);
    setError("");

    const response = await updateApplicationStatus(
      applicationId,
      status
    );

    if (!response?.success) {
      throw new Error("Unable to update application status.");
    }

    setApplication((prev) => ({
      ...prev,
      status: response.application?.status || status,
    }));

  } catch (error) {
    console.error("Failed to update application:", error);

    alert(
      error.response?.data?.message ||
      error.message ||
      "Failed to update application."
    );

  } finally {
    setActionLoading(false);
  }
};

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={24}
              className="animate-spin"
            />

            <span>Loading applicant...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !application) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <button
            onClick={() =>
              navigate("/recruiter/applicants")
            }
            className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />

            Back to Applicants
          </button>

          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            {error || "Applicant not found."}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const student = application.student || {};

  const breakdown =
    application.compatibilityBreakdown || {};

  const compatibilityScore =
    application.compatibilityScore ?? 0;

  const status = application.status || "Pending";
  const matchingWeights = application.matchingWeightsUsed || {
  skills: 40,
  availability: 20,
  experience: 15,
  communication: 15,
  projects: 10,
};
  /*
   * Depending on how you store GitHub verification,
   * it can come from either:
   *
   * application.githubVerification
   * OR
   * student.githubVerification
   */

  const studentProjects = Array.isArray(student.projects)
  ? student.projects
  : [];

const githubProjects = studentProjects.filter(
  (project) => project?.githubUrl
);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* ================================================= */}
        {/* BACK BUTTON */}
        {/* ================================================= */}

        <button
          onClick={() =>
            navigate("/recruiter/applicants")
          }
          className="mb-8 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />

          Back to Applicants
        </button>

        {/* ================================================= */}
        {/* CANDIDATE HEADER */}
        {/* ================================================= */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row">

            {/* Candidate Information */}

            <div className="flex items-center gap-5">

              {/* Avatar */}

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                <User size={36} />
              </div>

              {/* Name / Email */}

              <div>

                <h1 className="text-3xl font-bold text-white">
                  {student.name || "Unknown Developer"}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-zinc-400">
                  <Mail size={17} />

                  <span>
                    {student.email ||
                      "No email available"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">

                  <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-400">
                    Student / Developer
                  </span>

                  {/* Application Status */}

                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      status === "Accepted"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : status === "Rejected"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {status}
                  </span>

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* COMPATIBILITY SCORE */}
            {/* ================================================= */}

            <div className="flex min-w-[200px] flex-col items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6">

              <p className="text-sm text-zinc-400">
                Compatibility
              </p>

              <p className="mt-2 text-4xl font-bold text-indigo-400">
                {compatibilityScore}%
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Overall Match
              </p>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* COMPATIBILITY BREAKDOWN */}
        {/* ================================================= */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

          <h2 className="text-xl font-semibold text-white">
            Compatibility Breakdown
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            How this candidate matches the project
            requirements.
          </p>

         <div className="mt-6 grid gap-4 md:grid-cols-5">

  <ScoreCard
    title="Skills"
    score={breakdown.skills ?? 0}
    weight={`${matchingWeights.skills}%`}
  />

  <ScoreCard
    title="Availability"
    score={breakdown.availability ?? 0}
    weight={`${matchingWeights.availability}%`}
  />

  <ScoreCard
    title="Experience"
    score={breakdown.experience ?? 0}
    weight={`${matchingWeights.experience}%`}
  />

  <ScoreCard
    title="Communication"
    score={breakdown.communication ?? 0}
    weight={`${matchingWeights.communication}%`}
  />

  <ScoreCard
    title="Projects"
    score={breakdown.projects ?? 0}
    weight={`${matchingWeights.projects}%`}
  />

</div>

        </div>

        {/* ================================================= */}
        {/* SKILLS */}
        {/* ================================================= */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Code2 size={20} />
            </div>

            <div>

              <h2 className="text-xl font-semibold text-white">
                Skills
              </h2>

              <p className="text-sm text-zinc-500">
                Technical skills of this developer.
              </p>

            </div>

          </div>

          <div className="mt-5 flex flex-wrap gap-2">

            {student.skills?.length > 0 ? (
              student.skills.map(
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
              <p className="text-sm text-zinc-500">
                No skills added.
              </p>
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* MATCHED / MISSING SKILLS */}
        {/* ================================================= */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          {/* MATCHED */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

            <h2 className="font-semibold text-white">
              Matched Skills
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Skills matching the project requirements.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              {application.matchedSkills?.length >
              0 ? (
                application.matchedSkills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-zinc-500">
                  No matched skills.
                </p>
              )}

            </div>

          </div>

          {/* MISSING */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

            <h2 className="font-semibold text-white">
              Missing Skills
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Required skills not found in the candidate
              profile.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              {application.missingSkills?.length >
              0 ? (
                application.missingSkills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-zinc-500">
                  No missing skills.
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* RESUME / CV */}
        {/* ================================================= */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileText size={22} />
            </div>

            <div>

              <h2 className="text-xl font-semibold text-white">
                Resume / CV
              </h2>

              <p className="text-sm text-zinc-500">
                Candidate resume.
              </p>

            </div>

          </div>

          <div className="mt-5">

            {student.resumeUrl ? (
              <a
                href={student.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              >
                <FileText size={18} />

                View Resume

                <ExternalLink size={15} />
              </a>
            ) : (
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-500">
                  No resume uploaded.
                </p>
              </div>
            )}

          </div>

        </div>

       
{/* ================================================= */}
{/* GITHUB PROJECT VERIFICATION */}
{/* ================================================= */}

<div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
      <ExternalLink size={22} />
    </div>

    <div>
      <h2 className="text-xl font-semibold text-white">
        GitHub Project Verification
      </h2>
      <p className="text-sm text-zinc-500">
        Repository analysis, detected technologies and project evidence.
      </p>
    </div>
  </div>

  {/* GitHub Profile */}
  {student.github && (
    <a
      href={student.github}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
    >
      <ExternalLink size={17} />
      Open GitHub Profile
      <ExternalLink size={14} />
    </a>
  )}

  {/* Candidate Projects */}
  <div className="mt-6 space-y-5">
    {githubProjects.length > 0 ? (
      githubProjects.map((project, index) => (
        <GitHubProjectVerification
          key={project._id || `${project.name}-${index}`}
          project={project}
        />
      ))
    ) : (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm text-zinc-400">
          No GitHub projects have been added to this developer's profile.
        </p>
      </div>
    )}
  </div>
</div>


        {/* ================================================= */}
        {/* DEVELOPER LINKS */}
        {/* ================================================= */}

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

          <h2 className="text-xl font-semibold text-white">
            Developer Links
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">

            {student.github && (
              <a
                href={student.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              >
                <ExternalLink size={18} />

                GitHub

                <ExternalLink size={15} />
              </a>
            )}

            {student.leetcode && (
              <a
                href={student.leetcode}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              >
                <Code2 size={18} />

                LeetCode

                <ExternalLink size={15} />
              </a>
            )}

            {!student.github &&
              !student.leetcode && (
                <p className="text-sm text-zinc-500">
                  No external profiles added.
                </p>
              )}

          </div>

        </div>

        {/* ================================================= */}
        {/* ACCEPT / REJECT */}
        {/* ================================================= */}

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center">

          {/* Current Status */}

          <div>

            <p className="text-sm text-zinc-500">
              Application Status
            </p>

            <p
              className={`mt-1 font-semibold ${
                status === "Accepted"
                  ? "text-emerald-400"
                  : status === "Rejected"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {status}
            </p>
            {(status === "Accepted" || application.lastMessageAt) && (
              <Link to={`/recruiter/messages?application=${applicationId}`}
                className="mt-3 inline-flex rounded-lg border border-indigo-400/40 px-3 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-400/10">
                {status === "Accepted" ? "Message candidate" : "View conversation"}
              </Link>
            )}

          </div>

          {/* Buttons */}

          <div className="flex gap-4">

            <button
              disabled={
  actionLoading ||
  status === "Rejected"
}
              onClick={() =>
                handleStatusChange("Rejected")
              }
              className="flex items-center gap-2 rounded-lg border border-red-500/30 px-5 py-3 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <XCircle size={18} />
              )}

              Reject
            </button>

            <button
              disabled={
  actionLoading ||
  status === "Accepted"
}
              onClick={() =>
                handleStatusChange("Accepted")
              }
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle size={18} />
              )}

              Accept
            </button>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

// =========================================================
// GITHUB PROJECT VERIFICATION CARD
// =========================================================

const GitHubProjectVerification = ({ project }) => {
  const verification = project?.verification || null;

  const evidence = verification?.projectEvidence || {};
  const authenticity = verification?.authenticity || {};
  const ownership = authenticity?.ownership || {};
  const contributions = verification?.contributionEvidence;
  const examples = [
    ...(contributions?.pullRequests || []).map((item) => ({ ...item, kind: "Merged pull request" })),
    ...(contributions?.commits || []).map((item) => ({ ...item, kind: "Commit" })),
  ];

  const renderCheck = (label, value) => (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <span className="text-sm text-zinc-400">{label}</span>

      {value === true ? (
        <span className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle size={16} />
          Passed
        </span>
      ) : value === false ? (
        <span className="flex items-center gap-2 text-sm text-red-400">
          <XCircle size={16} />
          Not found
        </span>
      ) : (
        <span className="text-sm text-zinc-500">Unknown</span>
      )}
    </div>
  );

  const renderList = (title, items, colorClass) => (
    <div>
      <p className="mb-3 text-sm font-medium text-zinc-400">
        {title}
      </p>

      {Array.isArray(items) && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`rounded-lg px-3 py-2 text-xs ${colorClass}`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-600">None found.</p>
      )}
    </div>
  );

  const status = verification?.status || "Not Verified";

  const statusStyle =
    status === "Verified"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : status === "Failed"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : status === "Unable to Verify"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      {/* Project Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {project.name || "Untitled Project"}
          </h3>

          {project.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              {project.description}
            </p>
          )}
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle}`}
        >
          {status === "Verified" && !contributions ? "Recheck required" : status}
        </span>
      </div>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h4 className="font-semibold text-white">GitHub contribution evidence</h4>
        <dl className="mt-3 grid gap-2 text-sm text-zinc-300">
          <div> <dt className="inline font-medium text-white">Account</dt>{" · "}
            <dd className="inline">{contributions?.connected ? `Connected${ownership.candidateGithub ? ` as @${ownership.candidateGithub}` : ""}` : contributions ? "Connection needed" : "Recheck required"}</dd>
          </div>
          <div> <dt className="inline font-medium text-white">Contributions</dt>{" · "}
            <dd className="inline">{examples.length > 0 ? `${examples.length} examples found` : contributions?.incomplete ? "Check incomplete" : contributions?.connected ? "None found in this check" : "Awaiting verification"}</dd>
          </div>
          <div> <dt className="inline font-medium text-white">Project evidence</dt>{" · "}
            <dd className="inline">{contributions ? evidence.status || "Unavailable" : "Recheck required"}</dd>
          </div>
        </dl>
        {contributions?.checkedSha && <p className="mt-2 text-xs text-zinc-400">Repository snapshot <code>{contributions.checkedSha.slice(0, 12)}</code>{verification.verifiedAt && ` · Checked ${new Date(verification.verifiedAt).toLocaleDateString()}`}</p>}
        {examples.length > 0 && <ul className="mt-3 space-y-3">
          {examples.map(({ url, label, kind, date, files }) => (
            <li key={url} className="border-t border-zinc-800 pt-2">
              <p className="text-xs text-zinc-400">{kind}{date && ` · ${new Date(date).toLocaleDateString()}`}</p>
              <a href={url} target="_blank" rel="noreferrer" className="break-words text-sm text-indigo-300 hover:underline">{label}</a>
              {files?.length > 0 && <p className="mt-1 break-all text-xs text-zinc-400">{files.join(" · ")}</p>}
            </li>
          ))}
        </ul>}
      </section>

      {/* Repository Link */}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
        >
          <ExternalLink size={16} />
          Open Repository
        </a>
      )}

      {/* Claimed Technologies */}
      {project.technologies?.length > 0 && (
        <div className="mt-5">
          {renderList(
            "Technologies claimed by candidate",
            project.technologies,
            "bg-zinc-800 text-zinc-300"
          )}
        </div>
      )}

      {!verification ? (
        <div className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-medium text-amber-400">
            Verification not performed
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            This project has a GitHub repository, but no verification
            report has been saved yet.
          </p>
        </div>
      ) : (
        <>
          {/* Verification Error */}
          {verification.error?.message && (
            <div className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-sm font-medium text-amber-400">
                Verification issue
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {verification.error.message}
              </p>
            </div>
          )}

          {/* Basic Checks */}
          <div className="mt-6">
            <h4 className="mb-3 font-medium text-white">
              Repository Checks
            </h4>

            <div className="grid gap-3 md:grid-cols-3">
              {renderCheck(
                "Repository exists",
                verification.repositoryExists
              )}

              {renderCheck(
                "README found",
                verification.hasReadme
              )}

              {renderCheck(
                "Code found",
                verification.hasCode
              )}
            </div>
          </div>

          {/* Scores */}
          {(typeof authenticity.score === "number" ||
            typeof evidence.score === "number" ||
            typeof authenticity.technologyScore === "number") && (
            <div className="mt-6">
              <h4 className="mb-3 font-medium text-white">
                Verification Scores
              </h4>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Authenticity",
                    value: authenticity.score,
                  },
                  {
                    label: "Project Evidence",
                    value: evidence.score,
                  },
                  {
                    label: "Technology Match",
                    value: authenticity.technologyScore,
                  },
                ]
                  .filter((item) => typeof item.value === "number")
                  .map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                    >
                      <p className="text-xs text-zinc-500">
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {Math.round(item.value)}%
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Technology Details */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {renderList(
              "Detected Languages",
              verification.detectedLanguages,
              "bg-indigo-500/10 text-indigo-400"
            )}

            {renderList(
              "Detected Technologies",
              verification.detectedTechnologies,
              "bg-indigo-500/10 text-indigo-400"
            )}

            {renderList(
              "Matched Technologies",
              verification.matchedTechnologies,
              "bg-emerald-500/10 text-emerald-400"
            )}

            {renderList(
              "Missing Technologies",
              verification.missingTechnologies,
              "bg-red-500/10 text-red-400"
            )}
          </div>

          {/* Project Evidence */}
          {evidence.domains?.length > 0 && (
            <div className="mt-6">
              {renderList(
                "Detected Project Domains",
                evidence.domains,
                "bg-violet-500/10 text-violet-400"
              )}
            </div>
          )}

          {authenticity.domainEvidence && (
            <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <h4 className="mb-3 font-medium text-white">
                Domain Evidence
              </h4>
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-zinc-400">
                {JSON.stringify(authenticity.domainEvidence, null, 2)}
              </pre>
            </div>
          )}

          {/* Ownership Evidence */}
          {contributions?.connected && authenticity.ownership && (
            <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <h4 className="mb-4 font-medium text-white">
                Repository Ownership Evidence
              </h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-500">
                    Candidate GitHub
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {ownership.candidateGithub || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Repository Owner
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {ownership.repositoryOwner || "Not available"}
                  </p>
                </div>

                {renderCheck(
                  "Connected account owns repository",
                  ownership.ownerMatches
                )}

                {renderCheck(
                  "Candidate is a contributor",
                  ownership.candidateIsContributor
                )}
              </div>

              <p className="mt-4 text-xs leading-5 text-zinc-500">
                These checks provide public repository ownership
                evidence. They do not independently prove account
                control or code authorship.
              </p>
            </div>
          )}

          {/* Verification Time */}
          <div className="mt-6 border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500">
              Verification time
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {verification.verifiedAt
                ? new Date(verification.verifiedAt).toLocaleString()
                : "Not available"}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// =========================================================
// SCORE CARD
// =========================================================

const ScoreCard = ({
  title,
  score,
  weight,
}) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {score}%
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        Weight: {weight}
      </p>

    </div>
  );
};

// =========================================================
// VERIFICATION ITEM
// =========================================================

const VerificationItem = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">

      <span className="text-sm text-zinc-400">
        {label}
      </span>

      {value ? (
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle size={17} />

          <span className="text-sm">
            Passed
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-400">
          <XCircle size={17} />

          <span className="text-sm">
            Failed
          </span>
        </div>
      )}

    </div>
  );
};

export default ApplicantReview;
