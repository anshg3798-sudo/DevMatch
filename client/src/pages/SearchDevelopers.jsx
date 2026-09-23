import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Code2,
  Loader2,
  AlertCircle,
  Users,
  ExternalLink,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { searchDevelopers } from "../services/userService";

const SearchDevelopers = () => {
  const [search, setSearch] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [minExperience, setMinExperience] = useState("");
const [minAvailability, setMinAvailability] = useState("");
const [skillFilter, setSkillFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fetchDevelopers = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await searchDevelopers(searchValue);

      setDevelopers(data.developers || []);
    } catch (error) {
      console.error(
        "Failed to load developers:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load developers."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    fetchDevelopers(search);
  };

  const handleClear = () => {
  setSearch("");
  setMinExperience("");
  setMinAvailability("");
  setSkillFilter("");
  fetchDevelopers("");
  };
  const filteredDevelopers = developers.filter((developer) => {
  const experienceMatch =
    minExperience === "" ||
    (developer.experienceYears ?? 0) >= Number(minExperience);

  const availabilityMatch =
    minAvailability === "" ||
    (developer.availabilityHours ?? 0) >= Number(minAvailability);

  const skillMatch =
    skillFilter === "" ||
    (developer.skills || []).some((skill) =>
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    );

  return (
    experienceMatch &&
    availabilityMatch &&
    skillMatch
  );
});
  return (
    <DashboardLayout>
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Search Developers
        </h1>

        <p className="mt-2 text-zinc-400">
          Find developers based on their skills and
          profiles.
        </p>
      </div>

      {/* Search */}

      <form
        onSubmit={handleSearch}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, email, or skill..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-6 py-3.5 font-medium text-white transition hover:bg-indigo-500"
        >
          Search
        </button>

        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3.5 text-zinc-300 transition hover:bg-zinc-800"
          >
            Clear
          </button>
        )}
      </form>
      {/* Filters */}

<div className="mt-4 grid gap-3 md:grid-cols-3">

  {/* Minimum Experience */}
  <input
    type="number"
    min="0"
    placeholder="Minimum experience (years)"
    value={minExperience}
    onChange={(e) => setMinExperience(e.target.value)}
    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-500"
  />

  {/* Minimum Availability */}
  <input
    type="number"
    min="0"
    placeholder="Minimum availability (hrs/week)"
    value={minAvailability}
    onChange={(e) => setMinAvailability(e.target.value)}
    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-500"
  />

  {/* Skill */}
  <input
    type="text"
    placeholder="Filter by skill..."
    value={skillFilter}
    onChange={(e) => setSkillFilter(e.target.value)}
    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-500"
  />

</div>
      {/* Error */}

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <AlertCircle size={20} />

          <p>{error}</p>
        </div>
      )}

      {/* Results count */}

      {!loading && !error && (
        <div className="mt-8 flex items-center gap-2 text-sm text-zinc-500">
          <Users size={17} />

          {filteredDevelopers.length} developer
          {filteredDevelopers.length !== 1 ? "s" : ""} found
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

            Loading developers...
          </div>
        </div>
      )}

      {/* Empty */}

      {!loading &&
        !error &&
        developers.length === 0 && (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
            <Users
              size={42}
              className="mx-auto text-zinc-600"
            />

            <h2 className="mt-4 text-xl font-semibold text-white">
              No developers found
            </h2>

            <p className="mt-2 text-zinc-500">
              Try searching for another name or skill.
            </p>
          </div>
        )}

      {/* Developers */}

      {!loading &&
        !error &&
        developers.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDevelopers.map((developer) => (
              <div
                key={developer._id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-indigo-500/30"
              >
                {/* Developer header */}

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                    <User size={21} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-white">
                      {developer.name}
                    </h2>

                    <p className="truncate text-sm text-zinc-500">
                      {developer.email}
                    </p>
                  </div>
                </div>

                {/* Skills */}

                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Skills
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {developer.skills?.length > 0 ? (
                      developer.skills.map(
                        (skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300"
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-sm text-zinc-600">
                        No skills added
                      </span>
                    )}
                  </div>
                </div>
          {/* Developer Stats */}

<div className="mt-6 grid grid-cols-2 gap-3">

  {/* Experience */}
  <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
    <p className="text-xs text-zinc-500">
      Experience
    </p>

    <p className="mt-1 text-sm font-semibold text-white">
      {developer.experienceYears ?? 0} years
    </p>
  </div>

  {/* Availability */}
  <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
    <p className="text-xs text-zinc-500">
      Availability
    </p>

    <p className="mt-1 text-sm font-semibold text-white">
      {developer.availabilityHours ?? 0} hrs/week
    </p>
  </div>

  {/* Communication */}
  <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
    <p className="text-xs text-zinc-500">
      Communication
    </p>

    <p className="mt-1 text-sm font-semibold text-white">
      {developer.communicationRating ?? 3}/5
    </p>
  </div>

  {/* Projects */}
  <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
    <p className="text-xs text-zinc-500">
      Projects
    </p>

    <p className="mt-1 text-sm font-semibold text-white">
      {developer.projectsCount ?? 0}
    </p>
  </div>

</div> 
                {/* Developer links */}

               {/* Developer links */}

<div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-800 pt-5">
  {developer.github && (
    <a
      href={developer.github}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
    >
      <ExternalLink size={15} />
      GitHub
    </a>
  )}

  {developer.leetcode && (
    <a
      href={developer.leetcode}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
    >
      <Code2 size={15} />
      LeetCode
    </a>
  )}

  <button
    type="button"
    onClick={() =>
      navigate(`/recruiter/developers/${developer._id}`)
    }
    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
  >
    <User size={15} />
    View Profile
  </button>
</div> 
              </div>
            ))}
          </div>
        )}
    </DashboardLayout>
  );
};

export default SearchDevelopers;