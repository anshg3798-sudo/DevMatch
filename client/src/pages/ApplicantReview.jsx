import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { updateApplicationStatus } from "../services/applicationService";

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
    const loadApplication = () => {
      try {
        setLoading(true);
        setError("");

        const storedApplication = sessionStorage.getItem(
          `application-${applicationId}`
        );

        if (!storedApplication) {
          setError(
            "Applicant information could not be loaded. Please go back to Applicants and open the applicant again."
          );
          return;
        }

        const parsedApplication = JSON.parse(storedApplication);

        if (!parsedApplication) {
          setError("Invalid applicant information.");
          return;
        }

        setApplication(parsedApplication);
      } catch (error) {
        console.error("Failed to load applicant:", error);

        setError("Failed to load applicant information.");
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [applicationId]);

  // =========================================================
  // ACCEPT / REJECT APPLICATION
  // =========================================================

  const handleStatusChange = async (status) => {
    try {
      setActionLoading(true);

      const response = await updateApplicationStatus(
        applicationId,
        status
      );

      console.log("Application status updated:", response);

      setApplication((prev) => ({
        ...prev,
        status,
      }));

      // Update the stored application too
      const storedApplication = sessionStorage.getItem(
        `application-${applicationId}`
      );

      if (storedApplication) {
        const parsedApplication = JSON.parse(
          storedApplication
        );

        parsedApplication.status = status;

        sessionStorage.setItem(
          `application-${applicationId}`,
          JSON.stringify(parsedApplication)
        );
      }
    } catch (error) {
      console.error(
        "Failed to update application:",
        error
      );

      alert(
        error.response?.data?.message ||
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

  /*
   * Depending on how you store GitHub verification,
   * it can come from either:
   *
   * application.githubVerification
   * OR
   * student.githubVerification
   */

  const githubVerification =
    application.githubVerification ||
    student.githubVerification ||
    null;

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
              weight="40%"
            />

            <ScoreCard
              title="Availability"
              score={breakdown.availability ?? 0}
              weight="20%"
            />

            <ScoreCard
              title="Experience"
              score={breakdown.experience ?? 0}
              weight="15%"
            />

            <ScoreCard
              title="Communication"
              score={breakdown.communication ?? 0}
              weight="15%"
            />

            <ScoreCard
              title="Projects"
              score={breakdown.projects ?? 0}
              weight="10%"
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
        {/* GITHUB VERIFICATION */}
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
                Verification details for the candidate's
                GitHub project.
              </p>

            </div>

          </div>

          {/* GitHub Profile */}

          <div className="mt-5">

            {student.github ? (
              <a
                href={student.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              >
                <ExternalLink size={18} />

                Open GitHub

                <ExternalLink size={15} />
              </a>
            ) : (
              <p className="text-sm text-zinc-500">
                No GitHub profile added.
              </p>
            )}

          </div>

          {/* Verification Result */}

          <div className="mt-6">

            {githubVerification ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">

                {/* Status */}

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    {githubVerification.status ===
                    "Verified" ? (
                      <ShieldCheck
                        size={24}
                        className="text-emerald-400"
                      />
                    ) : (
                      <ShieldX
                        size={24}
                        className="text-red-400"
                      />
                    )}

                    <div>

                      <p className="text-sm text-zinc-500">
                        Verification Status
                      </p>

                      <p
                        className={`font-semibold ${
                          githubVerification.status ===
                          "Verified"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {githubVerification.status ||
                          "Unknown"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Verification Checks */}

                <div className="mt-6 grid gap-3 sm:grid-cols-3">

                  <VerificationItem
                    label="Repository"
                    value={
                      githubVerification.repositoryExists
                    }
                  />

                  <VerificationItem
                    label="README"
                    value={
                      githubVerification.hasReadme
                    }
                  />

                  <VerificationItem
                    label="Code"
                    value={
                      githubVerification.hasCode
                    }
                  />

                </div>

                {/* Detected Languages */}

                <div className="mt-6">

                  <p className="text-sm font-medium text-zinc-400">
                    Detected Languages
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {githubVerification
                      .detectedLanguages?.length >
                    0 ? (
                      githubVerification.detectedLanguages.map(
                        (language, index) => (
                          <span
                            key={`${language}-${index}`}
                            className="rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300"
                          >
                            {language}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-zinc-600">
                        No languages detected.
                      </p>
                    )}

                  </div>

                </div>

                {/* Detected Technologies */}

                <div className="mt-6">

                  <p className="text-sm font-medium text-zinc-400">
                    Detected Technologies
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {githubVerification
                      .detectedTechnologies?.length >
                    0 ? (
                      githubVerification.detectedTechnologies.map(
                        (technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="rounded-lg bg-indigo-500/10 px-3 py-2 text-xs text-indigo-400"
                          >
                            {technology}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-zinc-600">
                        No technologies detected.
                      </p>
                    )}

                  </div>

                </div>

                {/* Matched Technologies */}

                <div className="mt-6">

                  <p className="text-sm font-medium text-zinc-400">
                    Matched Technologies
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {githubVerification
                      .matchedTechnologies?.length >
                    0 ? (
                      githubVerification.matchedTechnologies.map(
                        (technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400"
                          >
                            {technology}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-zinc-600">
                        No matched technologies.
                      </p>
                    )}

                  </div>

                </div>

                {/* Missing Technologies */}

                <div className="mt-6">

                  <p className="text-sm font-medium text-zinc-400">
                    Missing Technologies
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {githubVerification
                      .missingTechnologies?.length >
                    0 ? (
                      githubVerification.missingTechnologies.map(
                        (technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400"
                          >
                            {technology}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-zinc-600">
                        No missing technologies.
                      </p>
                    )}

                  </div>

                </div>

              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">

                <p className="text-sm text-zinc-500">
                  GitHub verification information is not
                  available for this applicant.
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

          </div>

          {/* Buttons */}

          <div className="flex gap-4">

            <button
              disabled={actionLoading}
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
              disabled={actionLoading}
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