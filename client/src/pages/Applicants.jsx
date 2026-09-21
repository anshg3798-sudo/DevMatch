import { useEffect, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  Code2,
  Mail,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { getMyProjects } from "../services/projectService";
import {
  getApplicants,
  updateApplicationStatus,
} from "../services/applicationService";

const Applicants = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch recruiter's projects and applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        // Get projects created by logged-in recruiter
        const projectData = await getMyProjects();

        const recruiterProjects = projectData.projects || [];

        // Get applicants for every project
        const projectsWithApplicants = await Promise.all(
          recruiterProjects.map(async (project) => {
            try {
              const applicantData = await getApplicants(project._id);

              return {
                ...project,
                applications: applicantData.applications || [],
              };
            } catch (error) {
              console.error(
                `Failed to load applicants for ${project.title}:`,
                error
              );

              return {
                ...project,
                applications: [],
              };
            }
          })
        );

        setProjects(projectsWithApplicants);
      } catch (error) {
        console.error("Failed to load applicants:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load applicants."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  // Update application status
  const handleStatusUpdate = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);

      await updateApplicationStatus(
        applicationId,
        status
      );

      // Update the status locally
      setProjects((previousProjects) =>
        previousProjects.map((project) => ({
          ...project,
          applications: project.applications.map(
            (application) =>
              application._id === applicationId
                ? {
                    ...application,
                    status,
                  }
                : application
          ),
        }))
      );
    } catch (error) {
      console.error(
        "Failed to update application status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={22}
              className="animate-spin"
            />

            <span>Loading applicants...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Applicants
        </h1>

        <p className="mt-2 text-zinc-400">
          Review developers who applied to your projects.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <AlertCircle size={20} />

          <p>{error}</p>
        </div>
      )}

      {/* No Projects */}

      {!error && projects.length === 0 && (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
          <BriefcaseBusiness
            size={42}
            className="mx-auto text-zinc-600"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No projects found
          </h2>

          <p className="mt-2 text-zinc-500">
            Create a project first to start receiving
            applications.
          </p>
        </div>
      )}

      {/* Projects */}

      <div className="mt-8 space-y-8">
        {projects.map((project) => (
          <section
            key={project._id}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60"
          >
            {/* Project Header */}

            <div className="border-b border-zinc-800 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                      <BriefcaseBusiness size={20} />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {project.title}
                      </h2>

                      <p className="mt-1 text-sm text-zinc-500">
                        {project.applications.length}{" "}
                        {project.applications.length === 1
                          ? "applicant"
                          : "applicants"}
                      </p>
                    </div>
                  </div>

                  {project.description && (
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* No Applicants */}

            {project.applications.length === 0 ? (
              <div className="p-8 text-center">
                <Users
                  size={36}
                  className="mx-auto text-zinc-600"
                />

                <p className="mt-3 text-zinc-500">
                  No applications received for this project
                  yet.
                </p>
              </div>
            ) : (
              /* Applicants */

              <div className="divide-y divide-zinc-800">
                {project.applications.map(
                  (application) => {
                    const student =
                      application.student;

                    return (
                      <div
                        key={application._id}
                        className="p-6"
                      >
                        {/* Applicant Top Section */}

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex gap-4">
                            {/* Avatar */}

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-lg font-semibold text-indigo-400">
                              {student?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>

                            {/* Basic Information */}

                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {student?.name ||
                                  "Unknown Developer"}
                              </h3>

                              <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                                <Mail size={15} />

                                <span>
                                  {student?.email ||
                                    "Email unavailable"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Compatibility */}

                          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-5 py-3 text-center">
                            <p className="text-xs text-zinc-500">
                              Compatibility
                            </p>

                            <p className="mt-1 text-2xl font-bold text-indigo-400">
                              {application.compatibilityScore ??
                                0}
                              %
                            </p>
                          </div>
                        </div>

                        {/* Skills */}

                        {student?.skills?.length > 0 && (
                          <div className="mt-5">
                            <p className="mb-2 text-sm font-medium text-zinc-400">
                              Skills
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {student.skills.map(
                                (skill, index) => (
                                  <span
                                    key={`${skill}-${index}`}
                                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Compatibility Explanation */}

          {application.explanation && (
         <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
         <p className="text-sm font-medium text-zinc-300">
          Compatibility Details
         </p>

    {/* Matched Skills */}

    {application.explanation.matchedSkills?.length > 0 && (
      <div className="mt-4">
        <p className="text-xs font-medium text-emerald-400">
          Matched Skills
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {application.explanation.matchedSkills.map(
            (skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>
    )}

    {/* Missing Skills */}

    {application.explanation.missingSkills?.length > 0 && (
      <div className="mt-4">
        <p className="text-xs font-medium text-red-400">
          Missing Skills
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {application.explanation.missingSkills.map(
            (skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>
    )}

    {/* No details */}

    {application.explanation.matchedSkills?.length === 0 &&
      application.explanation.missingSkills?.length === 0 && (
        <p className="mt-3 text-sm text-zinc-500">
          No compatibility details available.
        </p>
      )}
  </div>
)}

                        {/* Developer Links */}

                        <div className="mt-5 flex flex-wrap gap-3">
                          {student?.github && (
                            <a
                              href={student.github}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 transition hover:border-indigo-500/30 hover:text-white"
                            >
                              <ExternalLink size={16} />
                              GitHub
                            </a>
                          )}

                          {student?.leetcode && (
                            <a
                              href={student.leetcode}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 transition hover:border-indigo-500/30 hover:text-white"
                            >
                              <Code2 size={16} />
                              LeetCode
                            </a>
                          )}
                        </div>

                        {/* Status + Actions */}

                        <div className="mt-6 flex flex-col gap-4 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          {/* Status */}

                          <div>
                            <span className="text-sm text-zinc-500">
                              Status:{" "}
                            </span>

                            <span
                              className={`text-sm font-medium ${
                                application.status ===
                                "Accepted"
                                  ? "text-emerald-400"
                                  : application.status ===
                                    "Rejected"
                                  ? "text-red-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {application.status ||
                                "Pending"}
                            </span>
                          </div>

                          {/* Buttons */}

                          <div className="flex gap-3">
                            <button
                              disabled={
                                updatingId ===
                                application._id
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  application._id,
                                  "Rejected"
                                )
                              }
                              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={17} />

                              Reject
                            </button>

                            <button
                              disabled={
                                updatingId ===
                                application._id
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  application._id,
                                  "Accepted"
                                )
                              }
                              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CheckCircle size={17} />

                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Applicants;