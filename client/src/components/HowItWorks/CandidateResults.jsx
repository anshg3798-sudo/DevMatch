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
    <div
      className="
        group
        fade-up
        h-full
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950
        p-6
        shadow-lg
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-indigo-500/30
        hover:shadow-[0_0_40px_rgba(99,102,241,0.18)]
      "
    >
      <h3 className="mb-7 text-2xl font-bold text-white">
        Ranked Candidates
      </h3>

      {/* Top Candidate */}
      <div
        className="
          rounded-2xl
          border
          border-indigo-500/20
          bg-indigo-500/5
          p-6
          transition-all
          duration-300
          hover:border-indigo-400/40
          hover:bg-indigo-500/10
        "
      >
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold text-white">
            {candidates[0].name}
          </h4>

          <span
            className="
              rounded-full
              bg-emerald-500/15
              px-5
              py-2
              text-base
              font-bold
              text-emerald-400
            "
          >
            {candidates[0].score}%
          </span>
        </div>

        <p className="mt-5 leading-8 text-zinc-400">
          {candidates[0].insight}
        </p>
      </div>

      {/* Remaining Candidates */}
      <div className="mt-6 space-y-4">
        {candidates.slice(1).map((candidate, index) => (
          <div
            key={candidate.name}
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              px-5
              py-4
              transition-all
              duration-300
              hover:border-indigo-500/30
              hover:bg-zinc-900
            "
          >
            <span className="font-medium text-zinc-300">
              #{index + 2} {candidate.name}
            </span>

            <span className="text-lg font-bold text-white">
              {candidate.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateResults;