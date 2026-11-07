import { useEffect, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  Mail,
  Loader2,
  AlertCircle,
  Eye,
  Clock3,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getMyProjects } from "../services/projectService";
import {
  getApplicants,
  updateApplicationStatus,
   recalculateProjectScores,
} from "../services/applicationService";



const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "accepted":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

    case "rejected":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
};

function Applicants() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [recalculatingId, setRecalculatingId] = useState(null);
  useEffect(() => {
    let isMounted = true;

    const loadApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        const projectData = await getMyProjects();
        const recruiterProjects = projectData?.projects || [];

        const projectsWithApplicants = await Promise.all(
          recruiterProjects.map(async (project) => {
            try {
              const applicantData = await getApplicants(project._id);

              const sortedApplications = [
                ...(applicantData?.applications || []),
              ].sort(
                (a, b) =>
                  (Number(b.compatibilityScore) || 0) -
                  (Number(a.compatibilityScore) || 0)
              );

              return {
                ...project,
                applications: sortedApplications,
              };
            } catch (projectError) {
              console.error(
                `Failed to load applicants for ${project.title}:`,
                projectError
              );

              return {
                ...project,
                applications: [],
              };
            }
          })
        );

        if (isMounted) {
          setProjects(projectsWithApplicants);
        }
      } catch (loadError) {
        console.error("Failed to load applicants:", loadError);

        if (isMounted) {
          setError(
            getErrorMessage(
              loadError,
              "Unable to load your projects and applicants."
            )
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadApplicants();

    return () => {
      isMounted = false;
    };
  }, []);
  
const handleRecalculateScores = async (projectId) => {
  if (!projectId || recalculatingId) return;

  const confirmed = window.confirm(
    "Are you sure you want to recalculate all applicant scores using the latest matching weights?"
  );

  if (!confirmed) return;

  try {
    setRecalculatingId(projectId);
    setError("");

    // Recalculate scores in the backend
    const result = await recalculateProjectScores(projectId);

    // Fetch updated applicants
    const applicantData = await getApplicants(projectId);

    const sortedApplications = [
      ...(applicantData?.applications || []),
    ].sort(
      (a, b) =>
        (Number(b.compatibilityScore) || 0) -
        (Number(a.compatibilityScore) || 0)
    );

    // Update only the selected project
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project._id === projectId
          ? {
              ...project,
              applications: sortedApplications,
            }
          : project
      )
    );

    alert(
      `${result.updatedCount || 0} applicant scores recalculated successfully.`
    );
  } catch (error) {
    console.error("Recalculation failed:", error);

    setError(
      getErrorMessage(
        error,
        "Unable to recalculate applicant scores."
      )
    );
  } finally {
    setRecalculatingId(null);
  }
};

  const handleReviewCandidate = (application) => {
  if (!application?._id) {
    alert("Application information is unavailable.");
    return;
  }

  navigate(`/recruiter/applicants/${application._id}`);
};

  const handleStatusUpdate = async (applicationId, status) => {
    if (!applicationId || updatingId) return;

    const action = status.toLowerCase();

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this candidate?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(applicationId);
      setError("");

      await updateApplicationStatus(applicationId, status);

      setProjects((currentProjects) =>
        currentProjects.map((project) => ({
          ...project,
          applications: (project.applications || []).map((application) =>
            application._id === applicationId
              ? { ...application, status }
              : application
          ),
        }))
      );
    } catch (updateError) {
      console.error("Failed to update application status:", updateError);

      alert(
        getErrorMessage(
          updateError,
          `Unable to ${action} this candidate. Please try again.`
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p>Loading applicants...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-indigo-400">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">
                Recruiter Workspace
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Applicants
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Review compatibility scores and decide who moves forward.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3">
            <BriefcaseBusiness className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="text-xs text-zinc-500">Your projects</p>
              <p className="text-lg font-semibold text-white">
                {projects.length}
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="mt-1 text-sm">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-semibold underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* No projects */}
        {!error && projects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-16 text-center">
            <BriefcaseBusiness className="mx-auto h-12 w-12 text-zinc-600" />

            <h2 className="mt-4 text-xl font-semibold text-white">
              No projects yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
              Create a project first. Applicants will appear here when
              developers apply.
            </p>
          </div>
        )}

        {/* Project sections */}
        {projects.map((project) => {
          const applications = [...(project.applications || [])].sort(
            (a, b) =>
              (Number(b.compatibilityScore) || 0) -
              (Number(a.compatibilityScore) || 0)
          );

          return (
            <section
              key={project._id}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
            >
              {/* Project header */}
              <div className="border-b border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-indigo-400">
                      <BriefcaseBusiness className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Project
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-white">
                      {project.title || "Untitled Project"}
                    </h2>

                    {project.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                        {project.description}
                      </p>
                    )}
                  </div>

                 
<div className="flex flex-wrap items-center gap-3">

  <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300">
    <Users className="h-4 w-4" />
    {applications.length}{" "}
    {applications.length === 1 ? "applicant" : "applicants"}
  </span>

  <button
    type="button"
    onClick={() => handleRecalculateScores(project._id)}
    disabled={
      recalculatingId !== null ||
      applications.length === 0
    }
    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {recalculatingId === project._id ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <RefreshCw className="h-4 w-4" />
    )}

    {recalculatingId === project._id
      ? "Recalculating..."
      : "Recalculate Scores"}
  </button>

</div>
 
                </div>
              </div>

              {/* Applicants */}
              <div className="divide-y divide-zinc-800">
                {applications.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Users className="mx-auto h-9 w-9 text-zinc-600" />

                    <p className="mt-3 font-medium text-zinc-300">
                      No applicants yet
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Developers who apply to this project will appear here.
                    </p>
                  </div>
                ) : (
                  applications.map((application, index) => {
                    const student = application.student;
                    const name = student?.name || "Unknown Developer";
                    const email = student?.email || "No email provided";
                    const score = Number(application.compatibilityScore) || 0;
        
                    const status = application.status || "Pending";
                    const isUpdating = updatingId === application._id;

                    return (
                      <article
                        key={application._id}
                        className="p-5 transition-colors hover:bg-zinc-900/40 sm:p-6"
                      >
                        {/* Candidate identity and score */}
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-lg font-bold text-indigo-300">
                              {name.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="break-words text-lg font-semibold text-white">
                                  {name}
                                </h3>

                                {index === 0 && score > 0 && (
                                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300">
                                    Top match
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-zinc-400">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="break-all">{email}</span>
                              </p>

                              <span
                                className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(
                                  status
                                )}`}
                              >
                                {status.toLowerCase() === "accepted" ? (
                                  <CheckCircle className="h-3.5 w-3.5" />
                                ) : status.toLowerCase() === "rejected" ? (
                                  <XCircle className="h-3.5 w-3.5" />
                                ) : (
                                  <Clock3 className="h-3.5 w-3.5" />
                                )}

                                {status}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 lg:min-w-44">
                            <div>
                              <p className="text-xs text-zinc-500">
                                Compatibility
                              </p>
                              <p className="mt-1 text-3xl font-bold tabular-nums text-white">
                                {Math.round(score)}%
                              </p>
                            </div>

                            <div
                              className="relative h-12 w-12 shrink-0"
                              aria-label={`Compatibility score ${Math.round(
                                score
                              )}%`}
                            >
                              <svg
                                viewBox="0 0 36 36"
                                className="h-full w-full -rotate-90"
                              >
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="15.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  className="text-zinc-700"
                                />

                                <circle
                                  cx="18"
                                  cy="18"
                                  r="15.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeDasharray={`${
                                    Math.min(Math.max(score, 0), 100) * 0.974
                                  } 100`}
                                  strokeLinecap="round"
                                  className="text-indigo-400"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                      
                        {/* Candidate Summary */}

<div className="mt-5 flex flex-wrap items-center gap-3">

  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
    <CheckCircle className="h-4 w-4 text-emerald-400" />

    <span className="text-sm text-emerald-400">
      {application.matchedSkills?.length || 0} Matched Skills
    </span>
  </div>

  <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
    <XCircle className="h-4 w-4 text-red-400" />

    <span className="text-sm text-red-400">
      {application.missingSkills?.length || 0} Missing Skills
    </span>
  </div>

</div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              handleReviewCandidate(application)
                            }
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition hover:border-indigo-400/50 hover:bg-indigo-500/20"
                          >
                            <Eye className="h-4 w-4" />
                            Review Candidate
                          </button>

                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(
                                  application._id,
                                  "Rejected"
                                )
                              }
                              disabled={
                                isUpdating ||
                                status.toLowerCase() === "rejected"
                              }
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              Reject
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(
                                  application._id,
                                  "Accepted"
                                )
                              }
                              disabled={
                                isUpdating ||
                                status.toLowerCase() === "accepted"
                              }
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Accept
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

export default Applicants;