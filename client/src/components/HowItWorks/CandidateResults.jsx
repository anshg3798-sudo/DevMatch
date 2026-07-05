const candidates = [
  {
    name: "Alex Johnson",
    score: 94,
    insight:
      "Matches all required technologies, aligns with the project timeline, and has a high-quality portfolio.",
  },
  {
    name: "Emma Davis",
    score: 91,
  },
  {
    name: "Daniel Kim",
    score: 84,
  },
];

const CandidateResults = () => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">
        Ranked Candidates
      </h3>

      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">
            {candidates[0].name}
          </h4>

          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-400">
            {candidates[0].score}%
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-zinc-400">
          {candidates[0].insight}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {candidates.slice(1).map((candidate, index) => (
          <div
            key={candidate.name}
            className="flex items-center justify-between rounded-lg border border-zinc-800 px-4 py-3"
          >
            <span className="text-zinc-300">
              #{index + 2} {candidate.name}
            </span>

            <span className="font-semibold text-white">
              {candidate.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateResults;