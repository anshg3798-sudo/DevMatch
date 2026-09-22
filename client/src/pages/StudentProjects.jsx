import { useEffect, useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  FolderKanban,
  User,
  Loader2,
  AlertCircle,
  ArrowRight,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";

import { getAllProjects } from "../services/projectService";

const StudentProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedSkill, setSelectedSkill] =
    useState("all");

  const [experienceFilter, setExperienceFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAllProjects();

        setProjects(
          data.projects || []
        );
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // -----------------------------
  // Unique skills
  // -----------------------------

  const skills = useMemo(() => {
    const allSkills = projects.flatMap(
      (project) =>
        project.requiredSkills || []
    );

    return [
      ...new Set(
        allSkills.map((skill) =>
          skill.trim()
        )
      ),
    ].sort();
  }, [projects]);

  // -----------------------------
  // Filter + Search + Sort
  // -----------------------------

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (project) => {
          const title =
            project.title?.toLowerCase() ||
            "";

          const description =
            project.description?.toLowerCase() ||
            "";

          const projectSkills = (
            project.requiredSkills || []
          )
            .join(" ")
            .toLowerCase();

          return (
            title.includes(searchValue) ||
            description.includes(searchValue) ||
            projectSkills.includes(
              searchValue
            )
          );
        }
      );
    }

    if (selectedSkill !== "all") {
      result = result.filter(
        (project) =>
          (project.requiredSkills || [])
            .some(
              (skill) =>
                skill.toLowerCase() ===
                selectedSkill.toLowerCase()
            )
      );
    }

    if (experienceFilter !== "all") {
      result = result.filter(
        (project) => {
          const required =
            Number(
              project.experienceRequired
            ) || 0;

          if (
            experienceFilter === "0-1"
          ) {
            return required <= 1;
          }

          if (
            experienceFilter === "1-3"
          ) {
            return (
              required > 1 &&
              required <= 3
            );
          }

          if (
            experienceFilter === "3-5"
          ) {
            return (
              required > 3 &&
              required <= 5
            );
          }

          if (
            experienceFilter === "5+"
          ) {
            return required > 5;
          }

          return true;
        }
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );
    }

    if (sortBy === "az") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(
          b.title || ""
        )
      );
    }

    if (sortBy === "za") {
      result.sort((a, b) =>
        (b.title || "").localeCompare(
          a.title || ""
        )
      );
    }

    return result;
  }, [
    projects,
    search,
    selectedSkill,
    experienceFilter,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedSkill("all");
    setExperienceFilter("all");
    setSortBy("newest");
  };

  const hasFilters =
    search ||
    selectedSkill !== "all" ||
    experienceFilter !== "all";

  return (
    <StudentDashboardLayout>
      <div>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Browse Projects
          </h1>

          <p className="mt-2 text-zinc-400">
            Discover projects posted by
            recruiters and find opportunities
            that match your skills.
          </p>
        </div>

        {/* Search */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by project name, description, or skill..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
            />
          </div>

          {/* Filters */}

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Skill
              </label>

              <select
                value={selectedSkill}
                onChange={(event) =>
                  setSelectedSkill(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="all">
                  All Skills
                </option>

                {skills.map((skill) => (
                  <option
                    key={skill}
                    value={skill}
                  >
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Experience
              </label>

              <select
                value={experienceFilter}
                onChange={(event) =>
                  setExperienceFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="all">
                  Any Experience
                </option>

                <option value="0-1">
                  0 - 1 years
                </option>

                <option value="1-3">
                  1 - 3 years
                </option>

                <option value="3-5">
                  3 - 5 years
                </option>

                <option value="5+">
                  5+ years
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Sort
              </label>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="az">
                  A - Z
                </option>

                <option value="za">
                  Z - A
                </option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>

        {/* Result count */}

        {!loading && !error && (
          <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
            <SlidersHorizontal
              size={16}
            />

            {filteredProjects.length} project
            {filteredProjects.length !== 1
              ? "s"
              : ""}{" "}
            found
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex items-center gap-3 text-zinc-400">
              <Loader2
                size={22}
                className="animate-spin"
              />

              Loading projects...
            </div>
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredProjects.length ===
            0 && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
              <FolderKanban
                size={42}
                className="mx-auto text-zinc-600"
              />

              <h2 className="mt-4 text-xl font-semibold text-white">
                No projects found
              </h2>

              <p className="mt-2 text-zinc-500">
                Try changing your search or
                filters.
              </p>
            </div>
          )}

        {/* Projects */}

        {!loading &&
          !error &&
          filteredProjects.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map(
                (project) => (
                  <div
                    key={project._id}
                    className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-indigo-500/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <FolderKanban
                          size={21}
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-white">
                          {project.title}
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                          Posted by{" "}
                          {project.createdBy
                            ?.name ||
                            "Recruiter"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-400">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {(
                        project.requiredSkills ||
                        []
                      ).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-zinc-500">
                      <span>
                        Experience:{" "}
                        {project.experienceRequired ||
                          0}
                        y
                      </span>

                      <span>
                        Availability:{" "}
                        {project.availabilityRequired ||
                          0}
                        h/w
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/student/projects/${project._id}`
                        )
                      }
                      className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-500"
                    >
                      View Project
                      <ArrowRight
                        size={17}
                      />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentProjects;